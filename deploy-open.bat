@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Marketplace - One-click deploy prep
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Pushing latest code to GitHub...
git add .
git -c user.email="deploy@marketplace.local" -c user.name="Marketplace Deploy" commit -m "Deploy config update" 2>nul
git push origin main
if errorlevel 1 (
  echo ERROR: git push failed. Check GitHub login.
  pause
  exit /b 1
)
echo OK: GitHub updated
echo.

echo [2] Open these links in browser:
echo.
echo   Render Web Service:
echo   https://dashboard.render.com/web/new
echo.
echo   Vercel Frontend:
echo   https://vercel.com/new/clone?repository-url=https://github.com/alimardonoahmad-code/marketplace-app
echo.
echo   Vercel Admin:
echo   https://vercel.com/new
echo.
echo [3] Render settings - copy/paste:
echo   Root Directory: backend
echo   Build Command: npm install ^&^& npm run build
echo   Start Command: npm run start:prod
echo   Instance: Free
echo.
echo [4] Required env on Render:
echo   DATABASE_URL = from Neon Connect button
echo   ALLOWED_ORIGINS = https://placeholder.vercel.app
echo.
pause
