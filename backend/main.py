"""StatSkill AI — hardened FastAPI backend.

Security model
--------------
- Passwords are stored as bcrypt hashes. Legacy plaintext passwords in the
  JSON dataset are verified once and transparently upgraded to hashes on the
  first successful login (or via ``python main.py --hash-passwords``).
- Session tokens are signed, expiring bearer tokens (HMAC-SHA256, constant
  time comparison). No raw token is ever persisted server-side; a small
  revocation list handles logout.
- Login attempts are rate limited per email+IP with temporary account lockout.
- Admin endpoints require the ``X-Admin-Key`` header. If
  ``STATSKILL_ADMIN_KEY`` is not configured, admin endpoints are disabled
  (fail closed) instead of falling back to a guessable default.
- CORS origins come from ``STATSKILL_CORS_ORIGINS`` (no wildcard).
- All JSON writes are atomic (temp file + os.replace) and guarded by a lock.
- Every mutating payload is size-limited and recursively depth/width limited.
"""

from __future__ import annotations

import argparse
import base64
import copy
import hashlib
import hmac
import json
import math
import os
import re
import secrets
import sys
import time
from collections import deque
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

try:
    import bcrypt

    _BCRYPT_AVAILABLE = True
except ImportError:  # pragma: no cover - fallback keeps the API usable
    _BCRYPT_AVAILABLE = False

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = Path(os.getenv("STATSKILL_DATA_FILE", BASE_DIR / "statskill.json"))
DEMO_FILE = Path(os.getenv("STATSKILL_DEMO_FILE", BASE_DIR / "demo.json"))
ENVIRONMENT = os.getenv("STATSKILL_ENV", "development").strip().lower()
IS_PRODUCTION = ENVIRONMENT in {"production", "prod"}

# Fail closed: without an explicit key, admin endpoints return 403.
ADMIN_KEY = os.getenv("STATSKILL_ADMIN_KEY", "")
if IS_PRODUCTION and not ADMIN_KEY:
    raise RuntimeError(
        "STATSKILL_ADMIN_KEY must be set when STATSKILL_ENV=production."
    )

TOKEN_SECRET = os.getenv("STATSKILL_TOKEN_SECRET", "")
if not TOKEN_SECRET:
    if IS_PRODUCTION:
        raise RuntimeError(
            "STATSKILL_TOKEN_SECRET must be set when STATSKILL_ENV=production."
        )
    TOKEN_SECRET = secrets.token_urlsafe(48)  # dev convenience; sessions reset on restart
    print(
        "[StatSkill] STATSKILL_TOKEN_SECRET is not set; generated an ephemeral "
        "dev secret. Sessions will expire whenever the server restarts.",
        file=sys.stderr,
    )

TOKEN_TTL_SECONDS = int(os.getenv("STATSKILL_TOKEN_TTL_SECONDS", str(12 * 3600)))

# Rate limiting / lockout configuration.
LOGIN_WINDOW_SECONDS = 15 * 60
LOGIN_MAX_ATTEMPTS = int(os.getenv("STATSKILL_LOGIN_MAX_ATTEMPTS", "10"))
LOCKOUT_SECONDS = 5 * 60

MAX_BODY_BYTES = int(os.getenv("STATSKILL_MAX_BODY_BYTES", str(2 * 1024 * 1024)))
MAX_DEPTH = 12
MAX_ITEMS_PER_CONTAINER = 500
MAX_STRING_LENGTH = 100_000

DATA_LOCK = Lock()
SESSIONS_LOCK = Lock()
REVOKED_TOKENS: dict[str, float] = {}  # jti -> expiry timestamp

EMAIL_RE = re.compile(r"^[^@\s]{1,64}@[^@\s.]+(\.[^@\s.]+)+$")


def _hash_password(password: str) -> str:
    if _BCRYPT_AVAILABLE:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("ascii")
    # Deterministic dev-only fallback (salted SHA-256). Not for production use.
    salt = secrets.token_hex(16)
    digest = hashlib.sha256(f"{salt}${password}".encode("utf-8")).hexdigest()
    return f"sha256${salt}${digest}"


def _verify_password(password: str, stored: str) -> bool:
    if not stored:
        return False
    if stored.startswith("bcrypt$"):
        try:
            if not _BCRYPT_AVAILABLE:
                return False
            return bcrypt.checkpw(
                password.encode("utf-8"), stored[len("bcrypt$"):].encode("ascii")
            )
        except ValueError:
            return False
    if stored.startswith("sha256$"):
        try:
            _, salt, digest = stored.split("$", 2)
        except ValueError:
            return False
        candidate = hashlib.sha256(f"{salt}${password}".encode("utf-8")).hexdigest()
        return hmac.compare_digest(candidate, digest)
    # Legacy plaintext value from the demo dataset.
    return secrets.compare_digest(stored, password)


def _is_hashed(stored: str) -> bool:
    return stored.startswith(("$2b$", "$2a$", "$2y$", "bcrypt$", "sha256$"))


def _needs_upgrade(stored: str) -> bool:
    return bool(stored) and not _is_hashed(stored)


app = FastAPI(
    title="StatSkill AI API",
    version="2.1.0",
    description=(
        "Multi-user StatSkill demo API. The 50-user STATSKILL dataset is the "
        "primary source of truth; demo.json supplies the requested Ananya demo "
        "login. Passwords are bcrypt-hashed, tokens are signed and expiring, "
        "and login attempts are rate limited."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "STATSKILL_CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Admin-Key"],
)


@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    """Reject oversized payloads before they are parsed."""
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > MAX_BODY_BYTES:
        raise HTTPException(status_code=413, detail="Request body too large.")
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.setdefault("Cache-Control", "no-store")
    if IS_PRODUCTION:
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response


# ---------------------------------------------------------------------------
# Request models with strict validation
# ---------------------------------------------------------------------------


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=256)


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=256)
    role: str | None = Field(default=None, max_length=80)
    department: str | None = Field(default=None, max_length=80)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        cleaned = re.sub(r"\s+", " ", value).strip()
        if not re.fullmatch(r"[A-Za-z\u0080-\uFFFF][A-Za-z\u0080-\uFFFF .'-]*", cleaned):
            raise ValueError("Name contains unsupported characters.")
        return cleaned

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
            raise ValueError("Password must include at least one letter and one number.")
        return value


class PasswordChangeRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=256)
    new_password: str = Field(min_length=8, max_length=256)

    @field_validator("new_password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
            raise ValueError("New password must include at least one letter and one number.")
        return value


class UserUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = re.sub(r"\s+", " ", value).strip()
        if not cleaned:
            raise ValueError("Name cannot be empty.")
        return cleaned[:80]


class AdminUserPatch(BaseModel):
    data: dict[str, Any]


class AdminDatasetUpdate(BaseModel):
    data: dict[str, Any]


# ---------------------------------------------------------------------------
# Safe JSON storage helpers
# ---------------------------------------------------------------------------


def validate_json_structure(value: Any, depth: int = 0) -> None:
    """Recursively bound payload shape so patches cannot explode memory/CPU."""
    if depth > MAX_DEPTH:
        raise HTTPException(status_code=400, detail=f"Payload nested deeper than {MAX_DEPTH} levels.")
    if isinstance(value, dict):
        if len(value) > MAX_ITEMS_PER_CONTAINER:
            raise HTTPException(status_code=400, detail="Payload has too many keys.")
        for key, item in value.items():
            if not isinstance(key, str) or len(key) > 100:
                raise HTTPException(status_code=400, detail="Invalid key in payload.")
            validate_json_structure(item, depth + 1)
    elif isinstance(value, list):
        if len(value) > MAX_ITEMS_PER_CONTAINER:
            raise HTTPException(status_code=400, detail="Payload array is too long.")
        for item in value:
            validate_json_structure(item, depth + 1)
    elif isinstance(value, str):
        if len(value) > MAX_STRING_LENGTH:
            raise HTTPException(status_code=400, detail="String value is too long.")
    elif isinstance(value, float) and not math.isfinite(value):
        raise HTTPException(status_code=400, detail="Non-finite numbers are not allowed.")


def read_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise HTTPException(status_code=500, detail="Data file unavailable.")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="Data file is corrupted.") from exc


def write_json(path: Path, data: dict[str, Any]) -> None:
    """Atomic write: temp file in the same directory, then os.replace()."""
    tmp = path.with_suffix(path.suffix + f".tmp.{os.getpid()}")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, path)


def read_dataset() -> dict[str, Any]:
    with DATA_LOCK:
        return read_json(DATA_FILE)


def read_demo() -> dict[str, Any]:
    with DATA_LOCK:
        return read_json(DEMO_FILE)


def write_dataset(data: dict[str, Any]) -> None:
    with DATA_LOCK:
        write_json(DATA_FILE, data)


def save_dataset_record(record: dict[str, Any]) -> None:
    """Replace (or append) one user record inside the dataset atomically."""
    with DATA_LOCK:
        dataset = read_json(DATA_FILE)
        users = dataset.setdefault("users", [])
        for idx, candidate in enumerate(users):
            if candidate.get("id") == record.get("id"):
                users[idx] = record
                break
        else:
            users.append(record)
        write_json(DATA_FILE, dataset)


def is_number(value: Any) -> bool:
    try:
        return math.isfinite(float(value))
    except (TypeError, ValueError):
        return False


def avg(values: list[Any]) -> float:
    nums = [float(v) for v in values if is_number(v)]
    return sum(nums) / len(nums) if nums else 0.0


def deep_merge(base: dict[str, Any], patch: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(base)
    for key, value in patch.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = copy.deepcopy(value)
    return result


def sanitize_profile(profile: dict[str, Any]) -> dict[str, Any]:
    """Strip credential material from anything that leaves the server."""
    return {
        key: value
        for key, value in profile.items()
        if str(key).lower() not in {"password", "password_hash", "token", "secret"}
    }


ENGINE_DEFINITIONS = {
    "statisticalMethods": {"name": "Statistical Methods", "benchmark": 3.5, "weight": 1.15},
    "dataQuality": {"name": "Data Quality", "benchmark": 3.5, "weight": 1.05},
    "python": {"name": "Python", "benchmark": 3.0, "weight": 1.0},
    "gis": {"name": "GIS & Spatial Statistics", "benchmark": 3.0, "weight": 1.0},
    "machineLearning": {"name": "Machine Learning", "benchmark": 3.0, "weight": 0.95},
}


def ensure_competency_shape(user_record: dict[str, Any]) -> None:
    """
    Keep all derived competency-dependent structures synchronized after JSON updates.
    Explicit competency scores are treated as authoritative when supplied.
    """
    competencies = user_record.get("competencies") or []
    if not isinstance(competencies, list):
        competencies = []

    comp_by_key = {}
    for item in competencies:
        if isinstance(item, dict) and item.get("key"):
            comp_by_key[item["key"]] = item

    # Build direct score map from explicit competency records.
    score_map: dict[str, float] = {}
    for key, item in comp_by_key.items():
        if is_number(item.get("score")):
            score_map[key] = float(item["score"])

    # Apply any direct score map from raw API patches.
    for key, value in (user_record.get("competencyScores") or {}).items():
        if key in ENGINE_DEFINITIONS and is_number(value):
            score_map[key] = float(value)

    # If raw inputs are provided and no direct score exists, calculate a fallback score.
    raw_inputs = user_record.get("rawInputs") or {}
    learning_hours = raw_inputs.get("learningHours") or {}
    self_assessment = raw_inputs.get("selfAssessment") or {}
    assessment_history = user_record.get("assessmentHistory") or []
    courses = user_record.get("courses") or []

    for key, definition in ENGINE_DEFINITIONS.items():
        if key not in score_map:
            assessments = [a for a in assessment_history if a.get("domain") == key]
            domain_courses = [c for c in courses if c.get("domain") == key]
            quiz = avg([a.get("score") for a in assessments]) / 20
            course = avg([c.get("score") for c in domain_courses]) / 20
            self_score = avg(self_assessment.get(key, []))
            effort = min(5.0, float(learning_hours.get(key, 0) or 0) / 8.0)
            score_map[key] = max(
                0.0,
                min(5.0, quiz * 0.50 + course * 0.25 + self_score * 0.15 + effort * 0.10),
            )

    new_competencies = []
    for key, definition in ENGINE_DEFINITIONS.items():
        item = copy.deepcopy(comp_by_key.get(key, {}))
        score = max(0.0, min(5.0, float(score_map.get(key, 0.0))))
        benchmark = float(item.get("benchmark", definition["benchmark"]))
        gap = max(0.0, benchmark - score)
        item.update(
            {
                "key": key,
                "name": item.get("name", definition["name"]),
                "score": round(score, 2),
                "scoreOutOf5": round(score, 2),
                "scorePercent": round(score * 20, 1),
                "benchmark": benchmark,
                "gap": round(gap, 2),
                "gapPercent": round((gap / benchmark) * 100, 1) if benchmark else 0,
                "weight": float(item.get("weight", definition["weight"])),
                "level": item.get("level") or ("Strong" if score >= 3.5 else "Moderate" if score >= 2 else "Weak"),
            }
        )
        new_competencies.append(item)

    user_record["competencies"] = new_competencies
    user_record["competencyScores"] = {
        item["key"]: item["score"] for item in new_competencies
    }

    # Benchmark comparison is always derived from the same competency variables.
    user_record["benchmarkComparison"] = [
        {
            "competency": item["name"],
            "currentScore": item["score"],
            "benchmark": item["benchmark"],
            "gap": item["gap"],
            "status": "Benchmark Met" if item["gap"] <= 0 else "Below Benchmark",
            "readinessPercent": round(min(100, (item["score"] / item["benchmark"]) * 100), 1)
            if item["benchmark"] else 0,
        }
        for item in new_competencies
    ]

    # Critical skills are all below-benchmark competencies, prioritized by gap.
    below = sorted(
        [item for item in new_competencies if item["gap"] > 0],
        key=lambda item: item["gap"],
        reverse=True,
    )
    user_record["criticalSkills"] = [
        {
            "competency": item["name"],
            "priority": "High" if item["gap"] >= 1 else "Medium",
            "currentScore": item["score"],
            "benchmark": item["benchmark"],
            "gap": item["gap"],
            "recommendedAction": f"Improve {item['name']} through targeted practice and applied assignments.",
        }
        for item in below[:5]
    ]

    dashboard = user_record.setdefault("dashboard", {})
    weighted_sum = sum(item["score"] * item["weight"] for item in new_competencies)
    total_weight = sum(item["weight"] for item in new_competencies) or 1
    weighted = weighted_sum / total_weight
    assessment_history = user_record.get("assessmentHistory") or []
    raw_learning_hours = user_record.get("rawInputs") or {}
    learning_hours_for_score = raw_learning_hours.get("learningHours") or {}
    quiz_average = round(avg([a.get("score") for a in assessment_history]))
    total_hours = sum(float(v or 0) for v in learning_hours_for_score.values())

    # A competency score update changes the overall competency score and only
    # the directly dependent competency analytics. Other user-authored dashboard
    # metrics (assessment counts, rank, XP, module progress) are preserved.
    dashboard["overallCompetency"] = round(
        min(100, max(0, weighted * 20 * 0.82 + quiz_average * 0.12 + min(total_hours, 100) * 0.06))
    )
    dashboard["overallCompetencyLabel"] = f"{dashboard['overallCompetency']}/100"
    dashboard["criticalSkillGaps"] = sum(
        1 for item in user_record["criticalSkills"] if str(item.get("priority", "")).lower() == "high"
    )
    dashboard["moderateSkillGaps"] = sum(
        1 for item in new_competencies if item["gap"] > 0 and item["level"] != "Weak"
    )
    dashboard["strongSkills"] = sum(item["level"] == "Strong" for item in new_competencies)
    user_record["analytics"] = {
        **(user_record.get("analytics") or {}),
        "competencyScores": dict(user_record["competencyScores"]),
        "totalLearningHours": (user_record.get("analytics") or {}).get("totalLearningHours", total_hours),
    }
    user_record["engine"] = {
        **(user_record.get("engine") or {}),
        "methodology": (user_record.get("engine") or {}).get(
            "methodology",
            "50% assessments · 25% courses · 15% self-assessment · 10% learning effort",
        ),
        "assessmentAverage": (user_record.get("engine") or {}).get("assessmentAverage", quiz_average),
        "learningHours": (user_record.get("engine") or {}).get("learningHours", total_hours),
        "overallScore": dashboard["overallCompetency"],
    }

    path = user_record.get("learningPath") or {}
    user_record["learningPath"] = path
    # Modules and learning progress are source data. They are not inferred from
    # competency score changes unless the caller explicitly changes them.
    if "modules" not in path and isinstance(user_record.get("modules"), list):
        path["modules"] = user_record["modules"]

    # Keep analytics competency scores in one place while preserving the source
    # dataset's other analytics values.
    analytics = user_record.get("analytics") or {}
    analytics["competencyScores"] = dict(user_record["competencyScores"])
    user_record["analytics"] = analytics


def find_user_record(dataset: dict[str, Any], email_or_id: str) -> dict[str, Any] | None:
    target = str(email_or_id).strip().lower()
    for record in dataset.get("users", []):
        profile = record.get("profile") or {}
        candidates = [
            str(record.get("id", "")),
            str(record.get("employeeCode", "")),
            str(profile.get("email", "")),
        ]
        if any(target == candidate.lower() for candidate in candidates):
            return record

    return None


def upgrade_plaintext_passwords(dataset: dict[str, Any]) -> int:
    """Hash any legacy plaintext passwords found in the dataset (one-time cost)."""
    upgraded = 0
    for record in dataset.get("users", []):
        profile = record.get("profile") or {}
        stored = str(profile.get("password", ""))
        if _needs_upgrade(stored):
            profile["password"] = _hash_password(stored)
            upgraded += 1
    if upgraded:
        write_dataset(dataset)
    return upgraded


def resolve_login(
    dataset: dict[str, Any], email: str, password: str
) -> tuple[dict[str, Any], dict[str, Any]] | None:
    """Verify credentials; transparently upgrades legacy plaintext passwords."""
    record = find_user_record(dataset, email)
    if record:
        profile = record.get("profile") or {}
        stored = str(profile.get("password", ""))
        if _verify_password(password, stored):
            if _needs_upgrade(stored):
                profile["password"] = _hash_password(password)
                save_dataset_record(record)
            return record, profile

    # Exact requested demo credentials from demo.json.
    demo = read_demo()
    demo_user = demo.get("user") or {}
    demo_stored = str(demo_user.get("password", ""))
    if (
        email.strip().lower() == str(demo_user.get("email", "")).strip().lower()
        and _verify_password(password, demo_stored)
    ):
        record = find_user_record(dataset, str(demo_user.get("id", ""))) or (
            dataset.get("users") or [None]
        )[0]
        if record:
            stored = str((record.get("profile") or {}).get("password", ""))
            if _needs_upgrade(stored):
                # Legacy plaintext in the dataset: upgrade it to a hash.
                (record.get("profile") or {})["password"] = _hash_password(password)
                save_dataset_record(record)
            merged_profile = deep_merge(record.get("profile") or {}, demo_user)
            merged_profile.pop("password", None)
            return record, merged_profile

    return None


# ---------------------------------------------------------------------------
# Signed, expiring session tokens
# ---------------------------------------------------------------------------


def _sign(payload_b64: str) -> str:
    return hmac.new(
        TOKEN_SECRET.encode("utf-8"), payload_b64.encode("ascii"), hashlib.sha256
    ).hexdigest()[:43]


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
        "jti": secrets.token_hex(8),
    }
    raw = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    body = base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")
    return f"{body}.{_sign(body)}"


def parse_token(token: str) -> dict[str, Any] | None:
    try:
        body, signature = token.rsplit(".", 1)
    except ValueError:
        return None
    if not hmac.compare_digest(signature, _sign(body)):
        return None
    try:
        padded = body + "=" * (-len(body) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")))
    except Exception:
        return None
    if not isinstance(payload, dict):
        return None
    if payload.get("exp", 0) < time.time():
        return None
    jti = str(payload.get("jti", ""))
    with SESSIONS_LOCK:
        if jti in REVOKED_TOKENS:
            return None
    return payload


def revoke_token(payload: dict[str, Any]) -> None:
    jti = str(payload.get("jti", ""))
    if not jti:
        return
    now = time.time()
    with SESSIONS_LOCK:
        # Opportunistic cleanup of expired revocations.
        for stale in [k for k, exp in REVOKED_TOKENS.items() if exp < now]:
            REVOKED_TOKENS.pop(stale, None)
        REVOKED_TOKENS[jti] = float(payload.get("exp", now + 3600))


# ---------------------------------------------------------------------------
# Login rate limiting (per email + client IP) with temporary lockout
# ---------------------------------------------------------------------------

RATE_LOCK = Lock()
FAILED_LOGINS: dict[str, deque[float]] = {}
LOCKED_UNTIL: dict[str, float] = {}


def _rate_key(email: str, request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "?")
    return f"{email.strip().lower()}|{ip}"


def check_rate_limit(key: str) -> None:
    now = time.time()
    with RATE_LOCK:
        locked_until = LOCKED_UNTIL.get(key, 0)
        if locked_until > now:
            wait_minutes = max(1, int((locked_until - now) // 60) + 1)
            raise HTTPException(
                status_code=429,
                detail=f"Too many failed login attempts. Try again in {wait_minutes} minute(s).",
            )


def record_failed_login(key: str) -> None:
    now = time.time()
    with RATE_LOCK:
        attempts = FAILED_LOGINS.setdefault(key, deque(maxlen=LOGIN_MAX_ATTEMPTS * 2))
        attempts.append(now)
        recent = [t for t in attempts if now - t <= LOGIN_WINDOW_SECONDS]
        FAILED_LOGINS[key] = deque(recent, maxlen=LOGIN_MAX_ATTEMPTS * 2)
        if len(recent) >= LOGIN_MAX_ATTEMPTS:
            LOCKED_UNTIL[key] = now + LOCKOUT_SECONDS
            FAILED_LOGINS[key].clear()


def record_successful_login(key: str) -> None:
    with RATE_LOCK:
        FAILED_LOGINS.pop(key, None)
        LOCKED_UNTIL.pop(key, None)


# ---------------------------------------------------------------------------
# Auth dependencies
# ---------------------------------------------------------------------------


def get_token_payload(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = parse_token(authorization.split(" ", 1)[1].strip())
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def session_record(payload: dict[str, Any] = Depends(get_token_payload)) -> tuple[dict[str, Any], dict[str, Any]]:
    dataset = read_dataset()
    record = find_user_record(dataset, str(payload.get("sub", "")))
    if not record:
        raise HTTPException(status_code=401, detail="Session user no longer exists.")
    profile = sanitize_profile(record.get("profile") or {})
    return record, profile


def require_admin_key(x_admin_key: str | None = Header(default=None)) -> None:
    if not ADMIN_KEY:
        raise HTTPException(
            status_code=503,
            detail="Admin endpoints are disabled: set STATSKILL_ADMIN_KEY to enable them.",
        )
    if not x_admin_key or not hmac.compare_digest(x_admin_key, ADMIN_KEY):
        raise HTTPException(status_code=403, detail="Invalid admin API key.")


def build_user_payload(record: dict[str, Any], effective_profile: dict[str, Any] | None = None) -> dict[str, Any]:
    record = copy.deepcopy(record)

    profile = sanitize_profile(effective_profile or record.get("profile") or {})
    user = {
        "id": record.get("id"),
        "employeeCode": record.get("employeeCode"),
        **profile,
    }

    modules = (record.get("learningPath") or {}).get("modules") or []
    competencies = record.get("competencies") or []
    competency_scores = {
        str(item.get("key")): item.get("score")
        for item in competencies
        if isinstance(item, dict) and item.get("key") and is_number(item.get("score"))
    }

    return {
        "user": user,
        "id": record.get("id"),
        "employeeCode": record.get("employeeCode"),
        "profile": profile,
        "dashboard": record.get("dashboard") or {},
        "competencyScores": competency_scores or record.get("competencyScores") or record.get("analytics", {}).get("competencyScores") or {},
        "competencies": competencies,
        "criticalSkills": record.get("criticalSkills") or [],
        "benchmarkComparison": record.get("benchmarkComparison") or [],
        "learningPath": record.get("learningPath") or {},
        "modules": modules,
        "courses": record.get("courses") or [],
        "assignments": record.get("assignments") or [],
        "assessmentHistory": record.get("assessmentHistory") or [],
        "assessments": record.get("assessmentHistory") or [],
        "documents": record.get("documents") or [],
        "certificates": record.get("certificates") or [],
        "notifications": record.get("notifications") or [],
        "analytics": record.get("analytics") or {},
        "engine": record.get("engine") or {},
        "rawInputs": record.get("rawInputs") or {},
        "selfAssessment": (record.get("rawInputs") or {}).get("selfAssessment") or {},
        "learningHours": (record.get("rawInputs") or {}).get("learningHours") or {},
        "summary": {
            "dashboard": record.get("dashboard") or {},
            "competencies": record.get("competencies") or [],
            "criticalSkills": record.get("criticalSkills") or [],
            "benchmarkComparison": record.get("benchmarkComparison") or [],
            "analytics": record.get("analytics") or {},
            "engine": record.get("engine") or {},
        },
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/health")
def health() -> dict[str, Any]:
    ok = DATA_FILE.exists() and DEMO_FILE.exists()
    return {
        "status": "ok" if ok else "degraded",
        "datasetLoaded": DATA_FILE.exists(),
        "environment": ENVIRONMENT,
        "time": int(time.time()),
    }


@app.get("/api/meta")
def meta() -> dict[str, Any]:
    dataset = read_dataset()
    return {
        "dataset": dataset.get("dataset"),
        "version": dataset.get("version"),
        "userCount": len(dataset.get("users", [])),
        "domains": dataset.get("sourceModel", {}).get("competencyDomains", list(ENGINE_DEFINITIONS)),
        "security": {
            "passwordHashing": "bcrypt" if _BCRYPT_AVAILABLE else "sha256-salted (dev)",
            "signedTokens": True,
            "tokenTtlSeconds": TOKEN_TTL_SECONDS,
            "adminEndpointsEnabled": bool(ADMIN_KEY),
        },
    }


@app.post("/api/auth/login")
def login(request: LoginRequest, http_request: Request) -> dict[str, Any]:
    email = str(request.email).strip().lower()
    key = _rate_key(email, http_request)
    check_rate_limit(key)

    dataset = read_dataset()
    resolved = resolve_login(dataset, email, request.password)
    if not resolved:
        record_failed_login(key)
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    record_successful_login(key)
    record, profile = resolved
    token = create_token(str(record["id"]))

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": TOKEN_TTL_SECONDS,
        "data": build_user_payload(record, profile),
    }


@app.post("/api/auth/register")
def register_user(request: RegisterRequest, http_request: Request) -> dict[str, Any]:
    """Self-service signup: creates a fresh user record with hashed password."""
    email = str(request.email).strip().lower()
    key = _rate_key(email, http_request)
    check_rate_limit(key)

    dataset = read_dataset()
    if find_user_record(dataset, email) is not None:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    existing_ids = {str(record.get("id", "")) for record in dataset.get("users", [])}
    new_id = f"USR-{secrets.token_hex(3).upper()}"
    while new_id in existing_ids:
        new_id = f"USR-{secrets.token_hex(3).upper()}"

    employee_codes = {str(record.get("employeeCode", "")) for record in dataset.get("users", [])}
    employee_code = f"EMP-{secrets.randbelow(900000) + 100000}"
    while employee_code in employee_codes:
        employee_code = f"EMP-{secrets.randbelow(900000) + 100000}"

    record: dict[str, Any] = {
        "id": new_id,
        "employeeCode": employee_code,
        "profile": {
            "name": request.name,
            "email": email,
            "password": _hash_password(request.password),
            "role": (request.role or "Statistical Investigator")[:80],
            "department": (request.department or "MoSPI")[:80],
            "projectId": "SIH26101",
        },
        "rawInputs": {
            "learningHours": {key: 0 for key in ENGINE_DEFINITIONS},
            "selfAssessment": {key: [] for key in ENGINE_DEFINITIONS},
        },
        "assessmentHistory": [],
        "courses": [],
        "learningPath": {"modules": []},
    }
    ensure_competency_shape(record)

    with DATA_LOCK:
        fresh = read_json(DATA_FILE)
        if find_user_record(fresh, email) is not None:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        fresh.setdefault("users", []).append(record)
        write_json(DATA_FILE, fresh)

    record_successful_login(key)
    profile = sanitize_profile(record["profile"])
    return {
        "access_token": create_token(new_id),
        "token_type": "bearer",
        "expires_in": TOKEN_TTL_SECONDS,
        "data": build_user_payload(record, profile),
    }


@app.post("/api/auth/logout")
def logout(authorization: str | None = Header(default=None)) -> dict[str, bool]:
    if authorization and authorization.lower().startswith("bearer "):
        parsed = parse_token(authorization.split(" ", 1)[1].strip())
        if parsed:
            revoke_token(parsed)
    return {"ok": True}


@app.get("/api/me")
def me(
    _: dict[str, Any] = Depends(get_token_payload),
    session: tuple[Any, dict[str, Any]] = Depends(session_record),
) -> dict[str, Any]:
    record, profile = session
    payload = build_user_payload(record, profile)
    return {"user": payload["user"], "data": payload}


@app.get("/api/me/data")
def my_data(session: tuple[Any, dict[str, Any]] = Depends(session_record)) -> dict[str, Any]:
    record, profile = session
    return build_user_payload(record, profile)


@app.put("/api/me/password")
def change_password(
    request: PasswordChangeRequest,
    session: tuple[Any, dict[str, Any]] = Depends(session_record),
) -> dict[str, Any]:
    record, _profile = session
    stored = str((record.get("profile") or {}).get("password", ""))
    if not _verify_password(request.current_password, stored):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    record.setdefault("profile", {})["password"] = _hash_password(request.new_password)
    save_dataset_record(record)
    return {"ok": True, "message": "Password updated."}


@app.get("/api/users/{email_or_id}/data")
def public_demo_lookup(email_or_id: str) -> dict[str, Any]:
    """Demo lookup. Returns profile-visible data only (never credentials)."""
    if not EMAIL_RE.match(email_or_id) and not re.fullmatch(r"USR-[A-Za-z0-9-]{1,40}", email_or_id):
        raise HTTPException(status_code=400, detail="Provide a valid email or user id.")
    dataset = read_dataset()
    record = find_user_record(dataset, email_or_id)

    if record is None:
        demo = read_demo()
        demo_user = demo.get("user") or {}
        if email_or_id.strip().lower() == str(demo_user.get("email", "")).strip().lower():
            record = find_user_record(dataset, str(demo_user.get("id", "")))
            if record:
                merged = deep_merge(record.get("profile") or {}, demo_user)
                return build_user_payload(record, sanitize_profile(merged))

    if record is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return build_user_payload(record)


@app.put("/api/admin/users/{user_id}")
def admin_patch_user(
    user_id: str,
    request: AdminUserPatch,
    _: None = Depends(require_admin_key),
) -> dict[str, Any]:  # noqa: D401
    validate_json_structure(request.data)
    dataset = read_dataset()
    record = find_user_record(dataset, user_id)
    if record is None:
        raise HTTPException(status_code=404, detail="User not found.")

    patch = request.data
    protected = {"id", "password", "password_hash", "token", "secret"}
    blocked = [key for key in patch if str(key).lower() in protected]
    if blocked:
        raise HTTPException(
            status_code=400,
            detail=f"These fields cannot be patched: {', '.join(sorted(set(blocked)))}.",
        )

    # Convenience: {"competencyScores": {"statisticalMethods": 4.9}}
    # automatically updates competency records and all dependent summaries.
    if isinstance(patch.get("competencyScores"), dict):
        existing = record.setdefault("competencyScores", {})
        existing.update(patch["competencyScores"])

    # Convenience: {"competencies":[...]} is accepted as authoritative.
    if isinstance(patch.get("competencies"), list):
        record["competencies"] = copy.deepcopy(patch["competencies"])

    # Apply all other fields.
    for key, value in patch.items():
        if key not in {"competencyScores", "competencies"}:
            if isinstance(value, dict) and isinstance(record.get(key), dict):
                record[key] = deep_merge(record[key], value)
            else:
                record[key] = copy.deepcopy(value)

    dependent_keys = {"competencyScores", "competencies", "assessmentHistory", "courses", "rawInputs", "learningPath"}
    if dependent_keys.intersection(patch.keys()):
        ensure_competency_shape(record)
    save_dataset_record(record)
    return build_user_payload(record)


@app.put("/api/admin/dataset")
def admin_replace_dataset(
    request: AdminDatasetUpdate,
    _: None = Depends(require_admin_key),
) -> dict[str, Any]:
    data = request.data
    validate_json_structure(data)
    if not isinstance(data.get("users"), list):
        raise HTTPException(status_code=400, detail="data.users must be an array.")
    seen_emails: set[str] = set()
    for record in data["users"]:
        if not isinstance(record, dict) or not record.get("id") or not isinstance(record.get("profile"), dict):
            raise HTTPException(status_code=400, detail="Every user needs id and profile.")
        email = str((record["profile"] or {}).get("email", "")).strip().lower()
        if email:
            if email in seen_emails:
                raise HTTPException(status_code=400, detail=f"Duplicate email in dataset: {email}")
            seen_emails.add(email)

    # Hash any plaintext passwords before persisting the replacement dataset.
    for record in data["users"]:
        profile = record.get("profile") or {}
        stored = str(profile.get("password", ""))
        if _needs_upgrade(stored):
            profile["password"] = _hash_password(stored)

    write_dataset(data)
    return {"ok": True, "userCount": len(data["users"])}


@app.get("/api/admin/users")
def admin_users(_: None = Depends(require_admin_key)) -> dict[str, Any]:
    dataset = read_dataset()
    return {
        "users": [
            {
                "id": record.get("id"),
                "employeeCode": record.get("employeeCode"),
                "name": (record.get("profile") or {}).get("name"),
                "email": (record.get("profile") or {}).get("email"),
                "role": (record.get("profile") or {}).get("role"),
            }
            for record in dataset.get("users", [])
        ]
    }


@app.put("/api/me/profile")
def update_profile(
    request: UserUpdateRequest,
    session: tuple[Any, dict[str, Any]] = Depends(session_record),
) -> dict[str, Any]:
    record, profile = session
    if request.name is not None:
        cleaned = request.name.strip()[:80]
        if not cleaned:
            raise HTTPException(status_code=400, detail="Name cannot be empty.")
        record.setdefault("profile", {})["name"] = cleaned
        profile["name"] = cleaned

    save_dataset_record(record)
    return build_user_payload(record, profile)


def cli() -> None:
    parser = argparse.ArgumentParser(description="StatSkill AI backend utilities")
    parser.add_argument(
        "--hash-passwords",
        action="store_true",
        help="One-time migration: bcrypt-hash every legacy plaintext password in the dataset.",
    )
    args = parser.parse_args()
    if args.hash_passwords:
        dataset = read_dataset()
        count = upgrade_plaintext_passwords(dataset)
        print(f"Upgraded {count} plaintext password(s) to bcrypt hashes.")
        return
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=not IS_PRODUCTION)


if __name__ == "__main__":
    cli()
