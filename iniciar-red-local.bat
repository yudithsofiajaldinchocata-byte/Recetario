@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title RECETARIO - Servidor de Red Local

echo ======================================================================
echo                PLATAFORMA GASTRONOMICA RECETARIO
echo                   Iniciador de Red Local [LAN]
echo ======================================================================
echo.
echo Detectando direccion IP de la red local activa...

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
echo [INFO] Servidores listos para ejecutarse en paralelo:
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
echo Iniciando Backend en una nueva ventana...
start "RECETARIO - Backend Express (Puerto 4000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Iniciando Frontend en una nueva ventana con acceso de red...
start "RECETARIO - Frontend Vite (Puerto 5173)" cmd /k "cd /d "%~dp0recetario" && npm run dev -- --host"

echo.
echo ======================================================================
echo Los dos servidores estan en ejecucion.
echo Para detener los servicios, simplemente cierra las dos ventanas
echo emergentes correspondientes o presiona Ctrl + C en cada una.
echo ======================================================================
echo.
pause
