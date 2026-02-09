# 🤖 Sistema de Agentes AI - Multi-Agent Workflow Platform

![Version](https://img.shields.io/badge/version-2.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

Sistema completo de agentes especializados com workflows inteligentes e interface moderna. Execute múltiplos agentes AI em sequência com contexto compartilhado.

![Screenshot](docs/screenshot.png)

## ✨ Características Principais

- 🤖 **113 Agentes Especializados** - Organizados em 10 categorias
- 🔄 **10 Workflows Pré-Configurados** - Fluxos inteligentes prontos para usar
- 🎨 **Interface Moderna** - Design neomorphism elegante e intuitivo
- 📝 **Prompts Profissionais** - Engenharia de prompt aplicada em todos os agentes
- 🔗 **Contexto Compartilhado** - Agentes trabalham em sequência com contexto
- 💾 **Salvar/Carregar** - Salve seus workflows personalizados
- 🌐 **Multi-API** - Suporte para OpenAI, Google Gemini e OpenRouter

## 🚀 Demo Online

🔗 **[Ver Demo ao Vivo](https://seu-usuario.github.io/crew-sem-crew)**

## 📋 Índice

- [Instalação](#-instalação)
- [Uso Rápido](#-uso-rápido)
- [Agentes Disponíveis](#-agentes-disponíveis)
- [Workflows](#-workflows)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🔧 Instalação

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Python 3.x ou Node.js (para servidor local)
- API Key de um dos provedores suportados

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/crew-sem-crew.git

# Entre na pasta
cd crew-sem-crew

# Inicie um servidor local
python -m http.server 8000

# Ou com Node.js
npx http-server -p 8000

# Acesse no navegador
http://localhost:8000
```

## 🎯 Uso Rápido

### 1. Configure sua API

1. Abra a aplicação
2. Selecione o provedor (OpenAI, Gemini ou OpenRouter)
3. Cole sua API Key
4. Busque e selecione um modelo

### 2. Use um Workflow Pronto

1. Clique em **"📋 Templates"**
2. Escolha um dos 10 workflows disponíveis
3. Personalize o input global
4. Clique em **"▶️ Executar Agentes"**

### 3. Ou Crie seu Próprio Fluxo

1. Arraste agentes do menu lateral
2. Configure instruções de cada agente
3. Adicione input global (opcional)
4. Execute e veja os resultados

## 🤖 Agentes Disponíveis

### 📊 Negócios & Gestão (15 agentes)
Planejador Estratégico, Analista de Mercado, Gestor de Projetos, Gestor de Riscos, Analista de ROI, e mais...

### 💰 Financeiro & Contábil (12 agentes)
Analista de Balanço, Contador Virtual, Analista de Valuation, Planejador Tributário, Gestor de Investimentos, e mais...

### 📈 Marketing & Vendas (15 agentes)
Estrategista de Marketing, Copywriter, Especialista em SEO, Growth Hacker, Analista de Funil, e mais...

### 💻 Tecnologia & Desenvolvimento (12 agentes)
Arquiteto de Software, Desenvolvedor Frontend/Backend, Especialista em DevOps, Cloud, IA/ML, e mais...

### ✍️ Conteúdo & Comunicação (10 agentes)
Redator de Blog, Editor de Conteúdo, Ghostwriter, Tradutor Técnico, Especialista em PR, e mais...

### 🎓 Educação & Treinamento (8 agentes)
Designer Instrucional, Especialista em EAD, Criador de Quizzes, Gamificação, e mais...

### 👥 RH & Pessoas (10 agentes)
Recrutador Virtual, Gestor de Performance, Especialista em Onboarding, Coach de Liderança, e mais...

### ⚖️ Jurídico & Compliance (8 agentes)
Especialista em LGPD, Analista de Compliance, Consultor Trabalhista, Analista de Contratos, e mais...

### 🎨 Criatividade & Design (5 agentes)
Designer Gráfico, Especialista em UX/UI, Branding, Design Thinking, Diretor de Arte

### 🌟 Especialidades Diversas (5 agentes)
E-commerce, Logística, Sustentabilidade, Customer Success, Análise de Dados

## 🔄 Workflows Pré-Configurados

### 1. 🚀 Lançamento de Produto
Fluxo completo para lançar um novo produto no mercado (6 agentes)

### 2. 💻 Desenvolvimento de Software
Desenvolvimento de aplicação completa do zero (6 agentes)

### 3. ✍️ Criação de Conteúdo
Produção de conteúdo de alta qualidade (6 agentes)

### 4. 💰 Análise Financeira
Análise completa da saúde financeira empresarial (6 agentes)

### 5. 👔 Processo Seletivo
Recrutamento e seleção de talentos (6 agentes)

### 6. 📈 Estratégia de Growth
Crescimento acelerado e escalável (6 agentes)

### 7. ⚖️ Compliance Legal
Conformidade legal e gestão de riscos (6 agentes)

### 8. 🎓 Treinamento Corporativo
Criação de programa de treinamento completo (6 agentes)

### 9. 🎨 Branding e Identidade
Criação de marca e identidade visual (6 agentes)

### 10. 🛒 Setup de E-commerce
Estruturação completa de loja virtual (6 agentes)

## 📚 Documentação

### Guias Principais
- [📖 Workflows Inteligentes](WORKFLOWS-INTELIGENTES.md) - Guia completo dos workflows
- [🎓 Engenharia de Prompt](ENGENHARIA-DE-PROMPT-APLICADA.md) - Técnicas aplicadas
- [🎨 Melhorias de Layout](MELHORIAS-LAYOUT.md) - Detalhes da interface
- [📊 Resumo Completo](RESUMO-FINAL-COMPLETO.md) - Visão geral do sistema

### Documentação Técnica
- [🔧 Como Ver os 100 Agentes](COMO-VER-OS-100-AGENTES.md)
- [🐛 Guia de Debug](GUIA-DEBUG-MENU.md)
- [📝 Relatório de Melhorias](RELATORIO-MELHORIA-PROMPTS.md)

## 🏗️ Arquitetura

```
crew-sem-crew/
├── index.html                      # Página principal
├── css/
│   ├── neomorphism.css            # Estilos principais
│   └── components/                # Componentes CSS
├── js/
│   ├── agent-roles.js             # Definição de agentes
│   ├── force-load-agents.js       # Carregamento de agentes
│   ├── workflow-templates.js      # Templates de workflows
│   ├── script.js                  # Lógica principal
│   ├── api-manager.js             # Gestão de APIs
│   └── context-manager.js         # Gestão de contexto
└── agents/                        # 100 agentes JSON
    ├── negocios-gestao/
    ├── financeiro-contabil/
    ├── marketing-vendas/
    └── ...
```

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3 (Neomorphism), JavaScript (ES6+)
- **APIs**: OpenAI, Google Gemini, OpenRouter
- **Design**: Sistema de design customizado
- **Arquitetura**: Multi-agent system com contexto compartilhado

## 🎨 Features

### Interface
- ✅ Design neomorphism moderno
- ✅ Drag and drop intuitivo
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Animações suaves
- ✅ Feedback visual em tempo real

### Funcionalidades
- ✅ 113 agentes especializados
- ✅ 10 workflows pré-configurados
- ✅ Contexto compartilhado entre agentes
- ✅ Salvar/carregar workflows
- ✅ Busca de agentes
- ✅ Estatísticas de execução
- ✅ Suporte a múltiplas APIs

### Prompts
- ✅ Engenharia de prompt profissional
- ✅ 13 templates específicos ultra-detalhados
- ✅ Metodologias e frameworks incluídos
- ✅ Output estruturado e previsível

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes
- Mantenha o código limpo e documentado
- Siga o padrão de código existente
- Teste suas mudanças
- Atualize a documentação se necessário

## 📝 Roadmap

### Curto Prazo
- [ ] Mais 10 workflows
- [ ] Exportar/importar workflows
- [ ] Histórico de execuções
- [ ] Favoritos de agentes

### Médio Prazo
- [ ] Modo paralelo de execução
- [ ] Workflows condicionais
- [ ] Integração com mais APIs
- [ ] Templates de prompts customizáveis

### Longo Prazo
- [ ] Marketplace de workflows
- [ ] Colaboração em tempo real
- [ ] Analytics avançado
- [ ] Mobile app nativo

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Aleksandro Alves**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [seu-linkedin](https://linkedin.com/in/seu-linkedin)

## 🙏 Agradecimentos

- OpenAI pela API GPT
- Google pela API Gemini
- OpenRouter pela agregação de APIs
- Comunidade open source

## 📞 Suporte

- 📧 Email: seu-email@exemplo.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/crew-sem-crew/issues)
- 📖 Docs: [Documentação Completa](docs/)

## ⭐ Star History

Se este projeto foi útil para você, considere dar uma ⭐!

---

**Desenvolvido com ❤️ por Aleksandro Alves**

**Versão**: 2.1 | **Status**: Production Ready | **Última atualização**: Fevereiro 2026
