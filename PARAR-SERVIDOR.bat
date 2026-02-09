@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🛑 PARAR SERVIDOR - AGENTES AI                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Procurando processos do servidor Python...
echo.

REM Matar processos Python que estão rodando http.server
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "python.exe"') do (
    echo 🔴 Encerrando processo %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ✅ Servidor parado com sucesso!
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
