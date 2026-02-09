# 🚀 Como Executar o Sistema de Agentes AI

## Método 1: Arquivo .bat (Recomendado - Windows)

### Passo a Passo:

1. **Duplo clique** no arquivo `EXECUTAR.bat`
2. Uma janela do terminal será aberta
3. O navegador abrirá automaticamente em `http://localhost:8000`
4. Pronto! O sistema está rodando

### ⚠️ Importante:
- **NÃO FECHE** a janela do terminal enquanto estiver usando o sistema
- Para parar o servidor, pressione `Ctrl+C` na janela do terminal
- Se o navegador não abrir automaticamente, acesse manualmente: `http://localhost:8000`

---

## Método 2: Linha de Comando

### Windows (PowerShell ou CMD):
```bash
python -m http.server 8000
```

### Linux/Mac:
```bash
python3 -m http.server 8000
```

Depois acesse: `http://localhost:8000`

---

## Requisitos

- **Python 3.x** instalado no sistema
  - Para verificar: `python --version`
  - Download: https://www.python.org/downloads/

---

## Solução de Problemas

### ❌ "Python não é reconhecido como comando"
**Solução:** Instale o Python ou adicione ao PATH do sistema

### ❌ "Porta 8000 já está em uso"
**Solução:** Use outra porta:
```bash
python -m http.server 8080
```
E acesse: `http://localhost:8080`

### ❌ "Agentes não aparecem"
**Solução:** Certifique-se de estar acessando via `http://localhost:8000` e não abrindo o arquivo HTML diretamente

---

## 📋 Funcionalidades Disponíveis

✅ 113 agentes especializados em 10 categorias  
✅ Sistema de busca com debounce  
✅ Drag and drop de agentes  
✅ Workflows pré-configurados  
✅ Histórico de execuções  
✅ Exportação em múltiplos formatos  
✅ Tema claro/escuro  
✅ Retry automático de API  
✅ Validação de inputs  

---

## 🔑 Configuração Inicial

1. Selecione o **Provedor de API** (OpenAI, Gemini, OpenRouter)
2. Cole sua **API Key**
3. Clique em **Buscar Modelos**
4. Selecione o **Modelo** desejado
5. Arraste agentes para a área de trabalho
6. Digite sua tarefa
7. Clique em **Executar Workflow**

---

## 📞 Suporte

Para problemas ou dúvidas, consulte a documentação completa no repositório.
