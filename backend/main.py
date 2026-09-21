
from __future__ import annotations

import copy
import json
import math
import os
import secrets
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = Path(os.getenv("STATSKILL_DATA_FILE", BASE_DIR / "statskill.json"))
DEMO_FILE = Path(os.getenv("STATSKILL_DEMO_FILE", BASE_DIR / "demo.json"))
ADMIN_KEY = os.getenv("STATSKILL_ADMIN_KEY", "dev-admin-key")
DATA_LOCK = Lock()
SESSIONS: dict[str, str] = {}

app = FastAPI(
    title="StatSkill AI API",
    version="2.0.0",
    description=(
        "Multi-user StatSkill demo API. The 50-user STATSKILL dataset is the "
        "primary source of truth; demo.json supplies the requested Ananya demo login."
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
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserUpdateRequest(BaseModel):
    name: str | None = None


class AdminUserPatch(BaseModel):
    data: dict[str, Any]


class AdminDatasetUpdate(BaseModel):
    data: dict[str, Any]


def read_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise HTTPException(status_code=500, detail=f"Data file not found: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail=f"Invalid JSON in {path}: {exc}") from exc


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def read_dataset() -> dict[str, Any]:
    with DATA_LOCK:
        return read_json(DATA_FILE)


def read_demo() -> dict[str, Any]:
    with DATA_LOCK:
        return read_json(DEMO_FILE)


def write_dataset(data: dict[str, Any]) -> None:
    with DATA_LOCK:
        write_json(DATA_FILE, data)


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
    return {
        key: value
        for key, value in profile.items()
        if str(key).lower() not in {"password", "password_hash"}
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
    target = email_or_id.strip().lower()
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


def resolve_login(dataset: dict[str, Any], email: str, password: str) -> tuple[dict[str, Any], dict[str, Any]] | None:
    # Primary dataset credentials.
    record = find_user_record(dataset, email)
    if record:
        profile = record.get("profile") or {}
        if secrets.compare_digest(str(profile.get("password", "")), password):
            return record, profile

    # Exact requested demo credentials from demo.json.
    demo = read_demo()
    demo_user = demo.get("user") or {}
    if (
        email.strip().lower() == str(demo_user.get("email", "")).strip().lower()
        and secrets.compare_digest(str(demo_user.get("password", "")), password)
    ):
        record = find_user_record(dataset, str(demo_user.get("id", ""))) or dataset.get("users", [None])[0]
        if record:
            merged_profile = deep_merge(record.get("profile") or {}, demo_user)
            return record, merged_profile

    return None


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


def session_record(authorization: str | None) -> tuple[dict[str, Any], dict[str, Any]]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token.")
    token = authorization.split(" ", 1)[1].strip()
    session = SESSIONS.get(token)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    dataset = read_dataset()
    record = find_user_record(dataset, session["id"])
    if not record:
        raise HTTPException(status_code=401, detail="Session user no longer exists.")

    return record, session["profile"]


def require_admin_key(x_admin_key: str | None) -> None:
    if not x_admin_key or not secrets.compare_digest(x_admin_key, ADMIN_KEY):
        raise HTTPException(status_code=403, detail="Invalid admin API key.")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/meta")
def meta() -> dict[str, Any]:
    dataset = read_dataset()
    return {
        "dataset": dataset.get("dataset"),
        "version": dataset.get("version"),
        "userCount": len(dataset.get("users", [])),
        "domains": dataset.get("sourceModel", {}).get("competencyDomains", list(ENGINE_DEFINITIONS)),
    }


@app.post("/api/auth/login")
def login(request: LoginRequest) -> dict[str, Any]:
    dataset = read_dataset()
    resolved = resolve_login(dataset, str(request.email), request.password)
    if not resolved:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    record, profile = resolved
    token = secrets.token_urlsafe(32)
    SESSIONS[token] = {"id": record["id"], "profile": profile}

    return {
        "access_token": token,
        "token_type": "bearer",
        "data": build_user_payload(record, profile),
    }


@app.post("/api/auth/logout")
def logout(authorization: str | None = Header(default=None)) -> dict[str, bool]:
    if authorization and authorization.lower().startswith("bearer "):
        SESSIONS.pop(authorization.split(" ", 1)[1].strip(), None)
    return {"ok": True}


@app.get("/api/me")
def me(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    record, profile = session_record(authorization)
    return {"user": build_user_payload(record, profile)["user"], "data": build_user_payload(record, profile)}


@app.get("/api/me/data")
def my_data(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    record, profile = session_record(authorization)
    return build_user_payload(record, profile)


@app.get("/api/users/{email_or_id}/data")
def public_demo_lookup(email_or_id: str) -> dict[str, Any]:
    dataset = read_dataset()
    record = find_user_record(dataset, email_or_id)

    if record is None:
        demo = read_demo()
        demo_user = demo.get("user") or {}
        if email_or_id.strip().lower() == str(demo_user.get("email", "")).strip().lower():
            record = find_user_record(dataset, str(demo_user.get("id", "")))
            if record:
                return build_user_payload(record, deep_merge(record.get("profile") or {}, demo_user))

    if record is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return build_user_payload(record)


@app.get("/api/admin/users")
def admin_users(x_admin_key: str | None = Header(default=None)) -> dict[str, Any]:
    require_admin_key(x_admin_key)
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


@app.put("/api/admin/users/{user_id}")
def admin_patch_user(
    user_id: str,
    request: AdminUserPatch,
    x_admin_key: str | None = Header(default=None),
) -> dict[str, Any]:
    require_admin_key(x_admin_key)
    dataset = read_dataset()
    record = find_user_record(dataset, user_id)
    if record is None:
        raise HTTPException(status_code=404, detail="User not found.")

    patch = request.data
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
    for idx, candidate in enumerate(dataset.get("users", [])):
        if candidate.get("id") == record.get("id"):
            dataset["users"][idx] = record
            break

    write_dataset(dataset)
    return build_user_payload(record)


@app.put("/api/admin/dataset")
def admin_replace_dataset(
    request: AdminDatasetUpdate,
    x_admin_key: str | None = Header(default=None),
) -> dict[str, Any]:
    require_admin_key(x_admin_key)
    data = request.data
    if not isinstance(data.get("users"), list):
        raise HTTPException(status_code=400, detail="data.users must be an array.")
    for record in data["users"]:
        if not isinstance(record, dict) or not record.get("id") or not isinstance(record.get("profile"), dict):
            raise HTTPException(status_code=400, detail="Every user needs id and profile.")

    write_dataset(data)
    return {"ok": True, "userCount": len(data["users"])}


@app.put("/api/me/profile")
def update_profile(
    request: UserUpdateRequest,
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    record, profile = session_record(authorization)
    if request.name is not None:
        cleaned = request.name.strip()
        if not cleaned:
            raise HTTPException(status_code=400, detail="Name cannot be empty.")
        record.setdefault("profile", {})["name"] = cleaned
        profile["name"] = cleaned

    dataset = read_dataset()
    for idx, candidate in enumerate(dataset.get("users", [])):
        if candidate.get("id") == record.get("id"):
            dataset["users"][idx] = record
            break
    write_dataset(dataset)
    return build_user_payload(record, profile)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
