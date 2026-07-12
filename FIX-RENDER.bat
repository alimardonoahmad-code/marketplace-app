@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   FIX RENDER - copy these to Environment
echo ============================================
echo.
echo 1. Open: https://dashboard.render.com
echo 2. Click: marketplace-api
echo 3. Click: Environment (left menu)
echo 4. DELETE variable: DATABASE_URL
echo 5. ADD these 5 variables:
echo.
echo DB_HOST
echo ep-blue-firefly-ase3kg2f-pooler.c-4.eu-central-1.aws.neon.tech
echo.
echo DB_PORT
echo 5432
echo.
echo DB_USERNAME
echo neondb_owner
echo.
echo DB_PASSWORD
echo [paste password from Neon - Show password]
echo.
echo DB_DATABASE
echo neondb
echo.
echo 6. Click Save Changes
echo 7. Wait 5 min until status = Live
echo.
echo Test: https://marketplace-api-sf4p.onrender.com/api/categories
echo.
pause
