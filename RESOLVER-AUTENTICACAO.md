# 🔐 Resolver Problema de Autenticação do GitHub

## ⚠️ Problema Detectado
O Git está usando credenciais de outro usuário (maria-ksnn) ao invés de Aleksandro Alves.

---

## ✅ Solução 1: Usar Personal Access Token (Recomendado)

### Passo 1: Criar Token no GitHub
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note**: "Crew Sem Crew - Token de Acesso"
   - **Expiration**: 90 days (ou No expiration)
   - **Scopes**: Marque `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (você não verá novamente!)

### Passo 2: Configurar Git com Token
Abra o terminal e execute:

```bash
git remote set-url origin https://SEU_TOKEN@github.com/aajunior43/crew-sem-crew.git
```

**Substitua `SEU_TOKEN` pelo token que você copiou!**

### Passo 3: Tentar Enviar Novamente
```bash
git push origin main
```

---

## ✅ Solução 2: Limpar Credenciais Antigas

### Windows (Gerenciador de Credenciais)

1. Pressione `Win + R`
2. Digite: `control /name Microsoft.CredentialManager`
3. Clique em **"Credenciais do Windows"**
4. Procure por credenciais do GitHub
5. Remova todas as credenciais relacionadas ao GitHub
6. Tente fazer push novamente (pedirá novas credenciais)

### Ou via Linha de Comando:
```bash
git credential-manager uninstall
git credential-manager install
```

---

## ✅ Solução 3: Configurar SSH (Mais Seguro)

### Passo 1: Gerar Chave SSH
```bash
ssh-keygen -t ed25519 -C "aleksandro@agentesai.dev"
```
Pressione Enter 3 vezes (aceitar padrões)

### Passo 2: Copiar Chave Pública
```bash
type %USERPROFILE%\.ssh\id_ed25519.pub
```
Copie todo o conteúdo exibido

### Passo 3: Adicionar no GitHub
1. Acesse: https://github.com/settings/keys
2. Clique em **"New SSH key"**
3. **Title**: "Meu Computador - Crew Sem Crew"
4. **Key**: Cole a chave copiada
5. Clique em **"Add SSH key"**

### Passo 4: Mudar URL do Repositório
```bash
git remote set-url origin git@github.com:aajunior43/crew-sem-crew.git
```

### Passo 5: Testar Conexão
```bash
ssh -T git@github.com
```

### Passo 6: Enviar
```bash
git push origin main
```

---

## ✅ Solução 4: Forçar Credenciais Corretas

```bash
git config --global user.name "Aleksandro Alves"
git config --global user.email "aleksandro@agentesai.dev"
git config --global credential.helper wincred
```

Depois tente:
```bash
git push origin main
```

---

## 🎯 Comandos Úteis para Diagnóstico

### Ver configuração atual:
```bash
git config --list
```

### Ver URL do repositório:
```bash
git remote -v
```

### Ver usuário configurado:
```bash
git config user.name
git config user.email
```

### Limpar cache de credenciais:
```bash
git credential-cache exit
```

---

## 📝 Após Resolver

Execute novamente:
```bash
git push origin main
```

Ou use o arquivo:
```bash
ENVIAR-GITHUB.bat
```

---

## 💡 Dica

Se você trabalha com múltiplas contas do GitHub, considere usar:
- **SSH com múltiplas chaves**
- **Git Credential Manager** configurado por repositório

---

**Dev Aleksandro Alves**
