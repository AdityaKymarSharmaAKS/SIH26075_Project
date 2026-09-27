# StatSkill AI — FastAPI Demo Integration

This bundle connects the existing StatSkill AI UI to a FastAPI backend without changing the existing theme or language CSS.

## 1. Start FastAPI

```bash
cd backend
python -m venv .venv

# Windows
.venv\\Scripts\\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

# Optional admin JSON push key
# Windows PowerShell:
$env:STATSKILL_ADMIN_KEY="change-this-in-production"
# macOS/Linux:
export STATSKILL_ADMIN_KEY="change-this-in-production"

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:8000`, or you can create `.env` from `.env.example` and set `VITE_API_BASE_URL`.

## 3. Demo login

Email: `ananya.verma@demo.gov.in`
Password: `Demo@12345`

## What is dynamic

The login response and refresh response contain the complete user snapshot:

- profile / identity / department / project
- dashboard KPIs
- competency scores and benchmark comparison
- assessment / assignment records and scores
- course records and course scores
- learning path / modules / progress / lessons
- self-assessment
- learning hours
- documents
- certificates
- notifications
- derived critical skill gaps and recommendations
- competency-engine evidence

The browser refreshes `/api/me/data` every 15 seconds while signed in. Therefore a new JSON value pushed to the backend is picked up without manually changing React constants.

## Push new JSON data

Send the complete demo dataset to:

`PUT /api/admin/data`

with:

`X-Admin-Key: <your STATSKILL_ADMIN_KEY>`

Example body shape:

```json
{
  "data": {
    "user": {
      "id": "USR-001",
      "name": "Ananya Verma",
      "email": "ananya.verma@demo.gov.in",
      "password": "Demo@12345",
      "role": "Statistical Investigator",
      "department": "MoSPI",
      "projectId": "SIH26101"
    },
    "competencyScores": {
      "statisticalMethods": 4.9
    },
    "assessments": [],
    "courses": [],
    "selfAssessment": {},
    "learningHours": {},
    "modules": [],
    "documents": [],
    "certificates": [],
    "notifications": []
  }
}
```

For a partial competency update from an upstream system, merge that update into your existing dataset before calling the endpoint. The frontend will then receive the complete recalculated snapshot on its next refresh.

## API endpoints

- `GET /health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/me/data`
- `GET /api/users/{email}/data` (demo lookup)
- `PUT /api/me/profile`
- `PUT /api/admin/data`

Swagger UI: `http://localhost:8000/docs`
