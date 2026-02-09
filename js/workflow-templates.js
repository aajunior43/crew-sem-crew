// 🔄 TEMPLATES DE WORKFLOWS INTELIGENTES
const WorkflowTemplates = {
    templates: {
        // 1. LANÇAMENTO DE PRODUTO
        'lancamento-produto': {
            name: '🚀 Lançamento de Produto',
            description: 'Fluxo completo para lançar um novo produto no mercado',
            category: 'Marketing & Negócios',
            agents: [
                { key: 'analistaMercado', name: 'Analista de Mercado', instruction: 'Analise o mercado, concorrência e oportunidades.' },
                { key: 'planejadorEstrategico', name: 'Planejador Estratégico', instruction: 'Crie estratégia de posicionamento e go-to-market.' },
                { key: 'estrategistaMarketing', name: 'Estrategista de Marketing', instruction: 'Desenvolva plano de marketing com canais, budget e timeline.' },
                { key: 'copywriter', name: 'Copywriter', instruction: 'Crie copy persuasivo para landing page e anúncios.' },
                { key: 'criadorLandingPages', name: 'Criador de Landing Pages', instruction: 'Projete landing page de alta conversão.' },
                { key: 'especialistaSeo', name: 'Especialista em SEO', instruction: 'Otimize conteúdo para SEO e palavras-chave.' }
            ],
            globalInput: 'Produto: [DESCREVA SEU PRODUTO]\nPúblico-alvo: [DESCREVA SEU PÚBLICO]\nDiferenciais: [LISTE OS DIFERENCIAIS]'
        },

        // 2. DESENVOLVIMENTO DE SOFTWARE
        'desenvolvimento-software': {
            name: '💻 Desenvolvimento de Software',
            description: 'Fluxo completo de desenvolvimento de aplicação',
            category: 'Tecnologia',
            agents: [
                { key: 'arquitetoSoftware', name: 'Arquiteto de Software', instruction: 'Projete arquitetura escalável e defina stack tecnológico.' },
                { key: 'desenvolvedorBackend', name: 'Desenvolvedor Backend', instruction: 'Implemente APIs, banco de dados e lógica de negócio.' },
                { key: 'desenvolvedorFrontend', name: 'Desenvolvedor Frontend', instruction: 'Desenvolva interface responsiva e componentes reutilizáveis.' },
                { key: 'especialistaUxUi', name: 'Especialista em UX/UI', instruction: 'Revise experiência do usuário e sugira melhorias de interface.' },
                { key: 'revisorCodigo', name: 'Revisor de Código', instruction: 'Revise código, identifique problemas e sugira otimizações.' },
                { key: 'especialistaDevops', name: 'Especialista em DevOps', instruction: 'Configure CI/CD, deploy e monitoramento da aplicação.' }
            ],
            globalInput: 'Projeto: [DESCREVA O PROJETO]\nRequisitos: [LISTE OS REQUISITOS]\nRestrições: [MENCIONE RESTRIÇÕES]'
        },

        // 3. CRIAÇÃO DE CONTEÚDO
        'criacao-conteudo': {
            name: '✍️ Criação de Conteúdo Completo',
            description: 'Produção de conteúdo de alta qualidade do zero',
            category: 'Conteúdo',
            agents: [
                { key: 'pesquisador', name: 'Pesquisador', instruction: 'Pesquise o tema em profundidade, dados e tendências.' },
                { key: 'redatorBlog', name: 'Redator de Blog', instruction: 'Escreva artigo completo e bem estruturado.' },
                { key: 'editorConteudo', name: 'Editor de Conteúdo', instruction: 'Revise e refine o artigo para máxima qualidade.' },
                { key: 'especialistaSeo', name: 'Especialista em SEO', instruction: 'Otimize o conteúdo para SEO com palavras-chave.' },
                { key: 'criadorApresentacoes', name: 'Criador de Apresentações', instruction: 'Crie estrutura de apresentação visual.' },
                { key: 'gestorRedesSociais', name: 'Gestor de Redes Sociais', instruction: 'Adapte conteúdo para redes sociais.' }
            ],
            globalInput: 'Tema: [TEMA DO CONTEÚDO]\nObjetivo: [OBJETIVO DO CONTEÚDO]\nPúblico: [PÚBLICO-ALVO]'
        },

        // 4. ANÁLISE FINANCEIRA COMPLETA
        'analise-financeira': {
            name: '💰 Análise Financeira Empresarial',
            description: 'Análise completa da saúde financeira da empresa',
            category: 'Financeiro',
            agents: [
                { key: 'analistaBalanco', name: 'Analista de Balanço', instruction: 'Analise demonstrações financeiras e calcule indicadores.' },
                { key: 'analistaFluxoCaixa', name: 'Analista de Fluxo de Caixa', instruction: 'Analise fluxo de caixa e projeções financeiras.' },
                { key: 'analistaCustos', name: 'Analista de Custos', instruction: 'Identifique custos, desperdícios e oportunidades de redução.' },
                { key: 'analistaValuation', name: 'Analista de Valuation', instruction: 'Calcule valuation da empresa com múltiplas metodologias.' },
                { key: 'gestorRiscos', name: 'Gestor de Riscos', instruction: 'Identifique riscos financeiros e sugira mitigações.' },
                { key: 'planejadorTributario', name: 'Planejador Tributário', instruction: 'Otimize carga tributária e sugira economia fiscal.' }
            ],
            globalInput: 'Empresa: [NOME DA EMPRESA]\nDados Financeiros: [COLE DEMONSTRATIVOS]\nObjetivo: [OBJETIVO DA ANÁLISE]'
        },

        // 5. RECRUTAMENTO E SELEÇÃO
        'recrutamento-selecao': {
            name: '👔 Processo Seletivo Completo',
            description: 'Recrutamento e seleção de talentos',
            category: 'RH',
            agents: [
                { key: 'recrutadorVirtual', name: 'Recrutador Virtual', instruction: 'Crie job description e defina perfil ideal.' },
                { key: 'analistaCompetencias', name: 'Avaliador de Competências', instruction: 'Defina competências críticas e matriz de avaliação.' },
                { key: 'especialistaOnboarding', name: 'Especialista em Onboarding', instruction: 'Projete programa de onboarding.' },
                { key: 'gestorPerformance', name: 'Gestor de Performance', instruction: 'Defina KPIs e metas para a posição.' },
                { key: 'especialistaRemuneracao', name: 'Especialista em Remuneração', instruction: 'Sugira pacote de remuneração competitivo.' },
                { key: 'especialistaCultura', name: 'Especialista em Cultura', instruction: 'Avalie fit cultural e estratégias de integração.' }
            ],
            globalInput: 'Vaga: [TÍTULO DA VAGA]\nÁrea: [ÁREA/DEPARTAMENTO]\nRequisitos: [REQUISITOS PRINCIPAIS]'
        },

        // 6. GROWTH HACKING
        'growth-hacking': {
            name: '📈 Estratégia de Growth',
            description: 'Crescimento acelerado e escalável',
            category: 'Marketing',
            agents: [
                { key: 'especialistaGrowthHacking', name: 'Especialista em Growth Hacking', instruction: 'Analise funil AARRR e identifique oportunidades.' },
                { key: 'analistaFunilVendas', name: 'Analista de Funil de Vendas', instruction: 'Mapeie funil, identifique gargalos e otimizações.' },
                { key: 'especialistaEmailMarketing', name: 'Especialista em Email Marketing', instruction: 'Crie sequências de email para ativação e retenção.' },
                { key: 'analistaTrafegoPago', name: 'Analista de Tráfego Pago', instruction: 'Desenvolva estratégia de aquisição paga escalável.' },
                { key: 'analistaCrm', name: 'Analista de CRM', instruction: 'Configure automações e segmentações.' },
                { key: 'analistaRoi', name: 'Analista de ROI', instruction: 'Calcule ROI de cada canal e priorize investimentos.' }
            ],
            globalInput: 'Produto/Serviço: [DESCREVA]\nMétricas Atuais: [CAC, LTV, Churn, etc]\nObjetivo: [META DE CRESCIMENTO]'
        },

        // 7. COMPLIANCE E ADEQUAÇÃO LEGAL
        'compliance-legal': {
            name: '⚖️ Compliance e Adequação Legal',
            description: 'Conformidade legal e gestão de riscos',
            category: 'Jurídico',
            agents: [
                { key: 'analistaCompliance', name: 'Analista de Compliance', instruction: 'Avalie conformidade com regulamentações aplicáveis.' },
                { key: 'especialistaLgpd', name: 'Especialista em LGPD', instruction: 'Analise adequação à LGPD e sugira melhorias.' },
                { key: 'analistaContratos', name: 'Analista de Contratos', instruction: 'Revise contratos e identifique riscos jurídicos.' },
                { key: 'gestorRiscos', name: 'Gestor de Riscos', instruction: 'Mapeie riscos legais e operacionais.' },
                { key: 'auditorInterno', name: 'Auditor Interno', instruction: 'Realize auditoria de processos e controles internos.' },
                { key: 'consultorTrabalhista', name: 'Consultor Trabalhista', instruction: 'Verifique conformidade trabalhista e sugira ajustes.' }
            ],
            globalInput: 'Empresa: [NOME E SEGMENTO]\nDocumentos: [LISTE DOCUMENTOS DISPONÍVEIS]\nPreocupações: [ÁREAS DE PREOCUPAÇÃO]'
        },

        // 8. TREINAMENTO CORPORATIVO
        'treinamento-corporativo': {
            name: '🎓 Desenvolvimento de Treinamento',
            description: 'Criação de programa de treinamento completo',
            category: 'Educação',
            agents: [
                { key: 'designerInstrucional', name: 'Designer Instrucional', instruction: 'Projete estrutura do treinamento com objetivos.' },
                { key: 'especialistaEad', name: 'Especialista em EAD', instruction: 'Adapte conteúdo para formato online.' },
                { key: 'criadorQuizzes', name: 'Criador de Quizzes', instruction: 'Crie avaliações para medir aprendizado.' },
                { key: 'especialistaGamificacao', name: 'Especialista em Gamificação', instruction: 'Adicione elementos de gamificação.' },
                { key: 'criadorCertificacoes', name: 'Criador de Certificações', instruction: 'Desenvolva programa de certificação.' },
                { key: 'avaliadorCompetencias', name: 'Avaliador de Competências', instruction: 'Defina competências e métricas de sucesso.' }
            ],
            globalInput: 'Tema do Treinamento: [TEMA]\nPúblico: [PERFIL DOS PARTICIPANTES]\nDuração: [DURAÇÃO ESTIMADA]'
        },

        // 9. BRANDING E IDENTIDADE
        'branding-identidade': {
            name: '🎨 Branding e Identidade Visual',
            description: 'Criação de marca e identidade visual completa',
            category: 'Design',
            agents: [
                { key: 'especialistaBranding', name: 'Especialista em Branding', instruction: 'Defina posicionamento, propósito e personalidade da marca.' },
                { key: 'criadorIdentidadeVisual', name: 'Criador de Identidade Visual', instruction: 'Crie conceito visual, paleta de cores e tipografia.' },
                { key: 'designerGrafico', name: 'Designer Gráfico', instruction: 'Desenvolva logo, materiais gráficos e aplicações.' },
                { key: 'diretorArte', name: 'Diretor de Arte', instruction: 'Defina direção criativa e estilo visual da marca.' },
                { key: 'especialistaStorytelling', name: 'Especialista em Storytelling', instruction: 'Crie narrativa e história da marca.' },
                { key: 'redatorBlog', name: 'Redator de Blog', instruction: 'Escreva manifesto da marca e textos institucionais.' }
            ],
            globalInput: 'Marca: [NOME DA MARCA]\nSegmento: [ÁREA DE ATUAÇÃO]\nValores: [VALORES DA MARCA]'
        },

        // 10. E-COMMERCE COMPLETO
        'ecommerce-setup': {
            name: '🛒 Setup de E-commerce',
            description: 'Estruturação completa de loja virtual',
            category: 'E-commerce',
            agents: [
                { key: 'especialistaEcommerce', name: 'Especialista em E-commerce', instruction: 'Defina estratégia, plataforma e funcionalidades.' },
                { key: 'especialistaUxUi', name: 'Especialista em UX/UI', instruction: 'Projete experiência de compra otimizada.' },
                { key: 'consultorPrecificacao', name: 'Consultor de Precificação', instruction: 'Defina estratégia de precificação e margens.' },
                { key: 'analistaLogistica', name: 'Analista de Logística', instruction: 'Planeje logística, estoque e fulfillment.' },
                { key: 'especialistaSeo', name: 'Especialista em SEO', instruction: 'Otimize produtos e categorias para SEO.' },
                { key: 'analistaTrafegoPago', name: 'Analista de Tráfego Pago', instruction: 'Crie estratégia de aquisição com Google e Meta Ads.' }
            ],
            globalInput: 'Produtos: [TIPO DE PRODUTOS]\nPúblico: [PÚBLICO-ALVO]\nOrçamento: [ORÇAMENTO INICIAL]'
        }
    },

    getAllTemplates() {
        return Object.entries(this.templates).map(([key, template]) => ({ key, ...template }));
    },

    getTemplate(key) {
        if (!key || typeof key !== 'string') {
            console.warn('Chave de template inválida:', key);
            return null;
        }
        return this.templates[key] || null;
    },

    getTemplatesByCategory(category) {
        if (!category || typeof category !== 'string') {
            console.warn('Categoria inválida:', category);
            return [];
        }
        return this.getAllTemplates().filter(t => t.category === category);
    },

    applyTemplate(templateKey, customInput = null) {
        const template = this.getTemplate(templateKey);
        if (!template) {
            console.error('Template não encontrado:', templateKey);
            return null;
        }

        const hasAgentRoles = typeof AgentRoles !== 'undefined' && 
                             AgentRoles && 
                             typeof AgentRoles.getRoleConfig === 'function';

        return {
            name: template.name,
            description: template.description,
            agents: template.agents.map(agent => ({
                ...agent,
                roleConfig: hasAgentRoles ? AgentRoles.getRoleConfig(agent.key) : null
            })),
            globalInput: customInput || template.globalInput
        };
    }
};

window.WorkflowTemplates = WorkflowTemplates;
console.log('✅ Workflow Templates carregados:', Object.keys(WorkflowTemplates.templates).length, 'templates');
