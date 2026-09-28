@echo off
setlocal
cd /d "%~dp0backend"

echo.
echo === StatSkill AI FastAPI Backend ===
echo Working directory:
cd
echo.

where py >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python Launcher (py.exe) is not available.
  pause
  exit /b 1
)

py -3.14 --version
echo.
echo Installing backend dependencies...
py -3.14 -m pip install -r requirements.txt
if errorlevel 1 (
  echo.
  echo ERROR: Python dependencies could not be installed.
  pause
  exit /b 1
)

echo.
echo Starting FastAPI...
py -3.14 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
