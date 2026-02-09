@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🤖 AGENTES AI - SISTEMA v2.0                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Iniciando servidor HTTP local...
echo.
echo 📍 URL: http://localhost:8000
echo.
echo ⚠️  IMPORTANTE: Mantenha esta janela aberta!
echo    Para parar o servidor, pressione Ctrl+C
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM Aguardar 2 segundos e abrir navegador
timeout /t 2 /nobreak >nul
start http://localhost:8000

REM Iniciar servidor Python
python -m http.server 8000
