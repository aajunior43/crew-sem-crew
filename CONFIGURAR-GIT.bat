@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 CONFIGURAR GIT PARA GITHUB
echo ========================================
echo.

echo 👤 Configurando usuário...
git config user.name "Aleksandro Alves"
git config user.email "aleksandro@agentesai.dev"

echo.
echo 🌐 Configuração atual do repositório:
git remote -v

echo.
echo ========================================
echo ⚠️  ATENÇÃO - AUTENTICAÇÃO NECESSÁRIA
echo ========================================
echo.
echo O Git está usando credenciais de outro usuário.
echo.
echo 📋 ESCOLHA UMA OPÇÃO:
echo.
echo 1. Usar Personal Access Token (Recomendado)
echo    - Acesse: https://github.com/settings/tokens
echo    - Crie um novo token com permissão 'repo'
echo    - Execute: git remote set-url origin https://SEU_TOKEN@github.com/aajunior43/crew-sem-crew.git
echo.
echo 2. Limpar credenciais antigas
echo    - Abra: Painel de Controle ^> Gerenciador de Credenciais
echo    - Remova credenciais antigas do GitHub
echo    - Tente fazer push novamente
echo.
echo 3. Configurar SSH (Mais seguro)
echo    - Leia o arquivo: RESOLVER-AUTENTICACAO.md
echo.
echo ========================================
echo.
echo 📖 Para mais detalhes, leia: RESOLVER-AUTENTICACAO.md
echo.
pause
