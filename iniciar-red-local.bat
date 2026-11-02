@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title RECETARIO - Servidor de Red Local

echo ======================================================================
echo                PLATAFORMA GASTRONOMICA RECETARIO
echo                   Iniciador de Red Local [LAN]
echo ======================================================================
echo.
echo [1/4] Verificando y liberando puertos 4000 y 5173...
powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 4000,5173 -ErrorAction Stop | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {}; exit 0" 2>nul

echo [2/4] Detectando direccion IP de la red local activa...
set "IP="
for /f "usebackq tokens=*" %%a in (`powershell -NoProfile -Command "(Get-NetRoute -DestinationPrefix '0.0.0.0/0' | Select-Object -First 1 | Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' }).IPAddress" 2^>nul`) do (
    set "IP=%%a"
)

if "%IP%"=="" (
    for /f "usebackq tokens=*" %%a in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -match 'Wi-Fi|Ethernet' -and $_.IPAddress -notmatch '^(127\.|169\.254\.)' } | Select-Object -ExpandProperty IPAddress -First 1)" 2^>nul`) do (
        set "IP=%%a"
    )
)

if "%IP%"=="" (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
        if "!IP!"=="" (
            set "temp_ip=%%a"
            set "IP=!temp_ip: =!"
        )
    )
)

echo.
echo [3/4] Iniciando servidores en paralelo:
echo ----------------------------------------------------------------------
echo   * Acceso desde esta computadora:
echo     Frontend: http://localhost:5173
echo     Backend:  http://localhost:4000
echo.
if not "%IP%"=="" (
    echo   * Acceso desde otros dispositivos en tu red Wi-Fi [movil o tablet]:
    echo     URL de la aplicacion: http://!IP!:5173
    echo.
    echo   [NOTA] Asegurate de que el otro dispositivo este conectado a la
    echo   misma red Wi-Fi que esta computadora.
) else (
    echo   [AVISO] No se pudo detectar la IP de red automaticamente.
    echo   Ejecuta 'ipconfig' en una terminal para conocer tu direccion IPv4.
)
echo ----------------------------------------------------------------------
echo.

start "RECETARIO_BACKEND_SRV" cmd /k "cd /d "%~dp0backend" && npm run dev"
start "RECETARIO_FRONTEND_SRV" cmd /k "cd /d "%~dp0recetario" && npm run dev -- --host"

echo [4/4] Esperando enlace y abriendo navegador web...
powershell -NoProfile -Command "Start-Sleep -Milliseconds 2500" 2>nul
start "" "http://localhost:5173"

echo.
echo ======================================================================
echo Los servidores estan en ejecucion.
echo.
echo [PRESIONA CUALQUIER TECLA EN ESTA VENTANA PARA DETENER AMBOS SERVIDORES]
echo ======================================================================
pause > nul

echo.
echo Deteniendo servidores y liberando puertos 4000 y 5173...
powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 4000,5173 -ErrorAction Stop | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {}; exit 0" 2>nul
taskkill /FI "WINDOWTITLE eq RECETARIO_BACKEND_SRV*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq RECETARIO_FRONTEND_SRV*" /F >nul 2>&1

echo.
echo Servidores detenidos correctamente.
powershell -NoProfile -Command "Start-Sleep -Seconds 1" 2>nul
exit
