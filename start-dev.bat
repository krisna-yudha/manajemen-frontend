@echo off
echo ===============================================
echo    Starting Next.js Development Server
echo ===============================================
echo.
echo Changing to project directory...
cd /d "c:\xampp\htdocs\management\manajemen-FrontEnd\manajemen-frontend"

echo.
echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    npm install
) else (
    echo node_modules found. Continuing...
)

echo.
echo Starting development server...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ===============================================
echo.

npm run dev

echo.
echo Development server stopped.
pause
