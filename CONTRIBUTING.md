# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Sistema de Agentes AI! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Pull Requests](#pull-requests)
- [Padrões de Código](#padrões-de-código)

## 📜 Código de Conduta

Este projeto adota um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

## 🚀 Como Contribuir

### 1. Fork o Repositório

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/crew-sem-crew.git

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original-usuario/crew-sem-crew.git
```

### 2. Crie uma Branch

```bash
# Crie uma branch para sua feature
git checkout -b feature/minha-feature

# Ou para correção de bug
git checkout -b fix/meu-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e documentado
- Siga os padrões de código do projeto
- Teste suas alterações
- Atualize a documentação se necessário

### 4. Commit suas Mudanças

```bash
# Adicione os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"
```

#### Padrão de Commits

Use o padrão Conventional Commits:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/minha-feature

# Abra um Pull Request no GitHub
```

## 🐛 Reportando Bugs

### Antes de Reportar

- Verifique se o bug já foi reportado
- Teste na versão mais recente
- Colete informações sobre o bug

### Como Reportar

Crie uma issue com:

1. **Título claro** - Descreva o problema brevemente
2. **Descrição detalhada** - Explique o que aconteceu
3. **Passos para reproduzir** - Como replicar o bug
4. **Comportamento esperado** - O que deveria acontecer
5. **Screenshots** - Se aplicável
6. **Ambiente** - Navegador, OS, versão

### Template de Bug Report

```markdown
## Descrição
[Descrição clara do bug]

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
[O que deveria acontecer]

## Screenshots
[Se aplicável]

## Ambiente
- OS: [ex: Windows 11]
- Navegador: [ex: Chrome 120]
- Versão: [ex: 2.1]
```

## 💡 Sugerindo Melhorias

### Como Sugerir

1. **Verifique** se já não foi sugerido
2. **Descreva** a melhoria claramente
3. **Explique** por que seria útil
4. **Forneça** exemplos se possível

### Template de Feature Request

```markdown
## Descrição da Feature
[Descrição clara da funcionalidade]

## Problema que Resolve
[Qual problema esta feature resolve]

## Solução Proposta
[Como você imagina que funcione]

## Alternativas Consideradas
[Outras abordagens que você pensou]

## Contexto Adicional
[Qualquer outra informação relevante]
```

## 🔄 Pull Requests

### Checklist

Antes de submeter um PR, verifique:

- [ ] Código segue os padrões do projeto
- [ ] Comentários foram adicionados onde necessário
- [ ] Documentação foi atualizada
- [ ] Testes foram adicionados/atualizados
- [ ] Todas as verificações passam
- [ ] Commits seguem o padrão
- [ ] Branch está atualizada com main

### Processo de Review

1. **Submeta o PR** com descrição clara
2. **Aguarde review** de um mantenedor
3. **Responda feedback** se necessário
4. **Atualize o PR** conforme solicitado
5. **Merge** será feito após aprovação

### Template de Pull Request

```markdown
## Descrição
[Descrição das mudanças]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
[Passos para testar as mudanças]

## Checklist
- [ ] Código segue os padrões
- [ ] Documentação atualizada
- [ ] Testes adicionados
- [ ] Todas as verificações passam
```

## 📝 Padrões de Código

### JavaScript

```javascript
// Use const/let ao invés de var
const myVariable = 'value';

// Nomes descritivos
function calculateTotalPrice(items) {
    // ...
}

// Comentários quando necessário
// Calcula o preço total incluindo impostos
const totalWithTax = price * (1 + taxRate);

// Arrow functions para callbacks
items.map(item => item.price);
```

### CSS

```css
/* Use classes semânticas */
.neo-button-primary {
    /* Propriedades em ordem alfabética */
    background: var(--neo-accent-primary);
    border-radius: var(--neo-radius-md);
    padding: var(--neo-spacing-md);
}

/* Comentários para seções */
/* ============================================
   BUTTONS
   ============================================ */
```

### HTML

```html
<!-- Use HTML5 semântico -->
<section class="neo-card">
    <header class="neo-card-header">
        <h2>Título</h2>
    </header>
    <div class="neo-card-body">
        <!-- Conteúdo -->
    </div>
</section>

<!-- Indentação consistente -->
<!-- Atributos em ordem: class, id, data-*, outros -->
```

## 🎨 Adicionando Novos Agentes

### Estrutura do Agente

```json
{
  "key": "meuAgente",
  "name": "Meu Agente",
  "icon": "🤖",
  "color": "#00d4ff",
  "category": "Categoria",
  "systemPrompt": "Prompt do sistema...",
  "userPromptTemplate": "Template do usuário..."
}
```

### Diretrizes

1. **Key única** - Use camelCase
2. **Nome descritivo** - Claro e específico
3. **Ícone apropriado** - Emoji relevante
4. **Cor consistente** - Use paleta do projeto
5. **Categoria correta** - Uma das 10 categorias
6. **Prompt profissional** - Siga padrões de engenharia de prompt

## 🔄 Adicionando Workflows

### Estrutura do Workflow

```javascript
'meu-workflow': {
    name: '🎯 Meu Workflow',
    description: 'Descrição do workflow',
    category: 'Categoria',
    agents: [
        { 
            key: 'agente1', 
            name: 'Agente 1', 
            instruction: 'Instrução específica' 
        },
        // ...
    ],
    globalInput: 'Template de input'
}
```

### Diretrizes

1. **Nome claro** - Descreva o objetivo
2. **Descrição útil** - Explique quando usar
3. **Sequência lógica** - Agentes que se complementam
4. **6 agentes** - Padrão do projeto
5. **Input template** - Forneça exemplo

## 📚 Documentação

### Atualizando Docs

- Mantenha README.md atualizado
- Adicione exemplos quando relevante
- Use markdown corretamente
- Inclua screenshots se necessário

### Criando Novos Docs

- Use template consistente
- Organize em seções claras
- Adicione índice se longo
- Link para docs relacionados

## 🧪 Testes

### Testando Localmente

```bash
# Inicie servidor local
python -m http.server 8000

# Teste em múltiplos navegadores
# - Chrome
# - Firefox
# - Edge
# - Safari

# Teste responsividade
# - Desktop
# - Tablet
# - Mobile
```

### Checklist de Testes

- [ ] Funcionalidade funciona como esperado
- [ ] Não quebra funcionalidades existentes
- [ ] Funciona em diferentes navegadores
- [ ] Responsivo em diferentes tamanhos
- [ ] Sem erros no console
- [ ] Performance aceitável

## 🎯 Áreas para Contribuir

### Fácil (Good First Issue)

- Corrigir typos na documentação
- Adicionar novos agentes
- Melhorar mensagens de erro
- Adicionar tooltips

### Médio

- Criar novos workflows
- Melhorar UI/UX
- Adicionar testes
- Otimizar performance

### Avançado

- Implementar modo paralelo
- Adicionar novos provedores de API
- Criar sistema de plugins
- Implementar analytics

## 💬 Comunicação

### Canais

- **Issues**: Para bugs e features
- **Discussions**: Para perguntas e ideias
- **Pull Requests**: Para código

### Dicas

- Seja respeitoso e construtivo
- Forneça contexto suficiente
- Responda feedback prontamente
- Agradeça contribuições

## 🏆 Reconhecimento

Contribuidores serão:

- Listados no README.md
- Mencionados no CHANGELOG
- Creditados nos commits

## 📞 Precisa de Ajuda?

- Leia a [documentação](docs/)
- Abra uma [discussion](https://github.com/seu-usuario/crew-sem-crew/discussions)
- Entre em contato: seu-email@exemplo.com

---

**Obrigado por contribuir! 🎉**

Sua contribuição ajuda a tornar este projeto melhor para todos.
