# StatSkill AI

StatSkill AI is a local React/Vite application backed by a FastAPI demo API.

## Run on Windows

1. Run `START_BACKEND.bat` from the project root. It installs `backend/requirements.txt` with Python 3.14 and starts FastAPI on port 8000.
2. Run `START_FRONTEND.bat`. It installs the frontend dependencies and starts Vite on port 5173.
3. Open `http://127.0.0.1:5173`.

The backend API documentation is available at `http://127.0.0.1:8000/docs`.

## Demo login

- Email: `ananya.verma@demo.gov.in`
- Password: `Demo@12345`

New accounts can be created from the sign-in screen. Account data is stored in `backend/demo.json`; sessions are kept in memory and end when the backend restarts. This setup is intended for local demonstration, not production authentication.

## API

- `GET /health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/me/data`
- `GET /api/users/{email}/data` (demo account only)
- `PUT /api/me/profile`
- `PUT /api/admin/data` (requires `STATSKILL_ADMIN_KEY`)