@echo off
chcp 65001 >nul
title 星盘API服务器

echo.
echo ========================================
echo    Star Chart API Server Launcher
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] 检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python未安装!
    pause
    exit /b 1
)

echo [INFO] 检查依赖...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo [INFO] 安装Flask...
    pip install flask flask-cors
)

pip show ephem >nul 2>&1
if errorlevel 1 (
    echo [INFO] 安装PyEphem...
    pip install ephem
)

echo.
echo [INFO] 启动服务器...
echo [INFO] 访问: http://localhost:5000
echo [INFO] 按 Ctrl+C 停止
echo.

python pse_server.py

pause
