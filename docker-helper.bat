@echo off
echo ========================================
echo    NHA BAN TAO STORE - Docker Helper
echo ========================================
echo.

if "%1"=="" goto help
if "%1"=="build" goto build
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="seed" goto seed
if "%1"=="clean" goto clean
if "%1"=="status" goto status
goto help

:build
echo [*] Building Docker images...
docker-compose build
echo [OK] Build completed!
goto end

:start
echo [*] Starting containers...
docker-compose up -d
echo.
echo [OK] Containers started!
echo.
echo   Frontend: http://localhost
echo   Backend:  http://localhost:5001/api
echo.
goto end

:stop
echo [*] Stopping containers...
docker-compose down
echo [OK] Containers stopped!
goto end

:restart
echo [*] Restarting containers...
docker-compose restart
echo [OK] Containers restarted!
goto end

:logs
if "%2"=="" (
    echo [*] Showing all logs...
    docker-compose logs -f
) else (
    echo [*] Showing %2 logs...
    docker-compose logs -f %2
)
goto end

:seed
echo [*] Running seed script...
docker-compose exec backend node seed.js
echo [OK] Seed completed!
goto end

:clean
echo [*] Cleaning up...
docker-compose down -v --rmi all
echo [OK] Cleanup completed!
goto end

:status
echo [*] Container status:
docker-compose ps
goto end

:help
echo Usage: docker-helper.bat [command]
echo.
echo Commands:
echo   build     Build Docker images
echo   start     Start all containers
echo   stop      Stop all containers
echo   restart   Restart all containers
echo   logs      Show logs (add service name for specific logs)
echo   seed      Run database seed script
echo   status    Show container status
echo   clean     Remove all containers, volumes, and images
echo.
echo Examples:
echo   docker-helper.bat build
echo   docker-helper.bat start
echo   docker-helper.bat logs backend
echo.
goto end

:end
