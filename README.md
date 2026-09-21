# StatSkill AI — Complete Demo

This project keeps the existing UI/themes and connects the dashboard to FastAPI.

## Project structure

- `frontend/` — React/Vite application
- `backend/` — FastAPI API
- `backend/statskill.json` — 50-user dataset (primary data source)
- `backend/demo.json` — requested Ananya demo credentials

## Exact demo login

Email: `ananya.verma@demo.gov.in`
Password: `Demo@12345`

This login resolves to the rich `USR-001` record in `statskill.json`, while preserving the requested demo email/password in the profile.

The 50-user dataset can also be logged into using each user's own profile email/password.

## Windows: start backend

Open PowerShell in `backend`:

```powershell
py -3.14 -m pip install -r requirements.txt
py -3.14 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Browse the API at:

`http://127.0.0.1:8000/docs`

Do not browse to `http://0.0.0.0:8000`.

## Windows: start frontend

The safest Windows option is to double-click `START_FRONTEND.bat` from the project root. It enters the correct frontend directory and calls `npm.cmd` instead of the PowerShell `npm.ps1` wrapper.

Or from a terminal:

```powershell
cd frontend
npm install
npm run dev
```

Then open the Vite URL, normally:

`http://localhost:5173`

The frontend `.env` already points to `http://localhost:8000`.

## Live data updates

The frontend refreshes `/api/me/data` every 5 seconds.

For a demo competency update:

```http
PUT /api/admin/users/USR-001
X-Admin-Key: dev-admin-key
Content-Type: application/json
```

Body:

```json
{
  "data": {
    "competencyScores": {
      "statisticalMethods": 4.9
    }
  }
}
```

The backend updates the competency, benchmark comparison, critical skills, dashboard score, analytics, and engine values from the same variable. The logged-in browser picks it up automatically within the refresh interval.

You can also replace the entire 50-user dataset with:

`PUT /api/admin/dataset`

using the same `X-Admin-Key`.

## Important

The CSS/theme files and the language dictionary are kept as application assets; the integration changes are in application/data plumbing only.
