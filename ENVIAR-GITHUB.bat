@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ENVIANDO PROJETO PARA O GITHUB
echo ========================================
echo.

echo 📦 Adicionando todos os arquivos...
git add .

echo.
echo 💬 Criando commit...
git commit -m "feat: Sistema completo de agentes AI v2.1 - 113 agentes especializados com workflows inteligentes"

echo.
echo 🌐 Enviando para o GitHub...
git push origin main

echo.
echo ========================================
echo ✅ PROJETO ENVIADO COM SUCESSO!
echo ========================================
echo.
echo 🔗 Repositório: https://github.com/aajunior43/crew-sem-crew
echo.
pause
