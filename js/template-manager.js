// Template Manager - Sistema de Templates de Prompts Personalizáveis

class TemplateManager {
    constructor() {
        this.templates = this.getDefaultTemplates();
        this.customTemplates = [];
        this.loadCustomTemplates();
    }
    
    // Templates padrão
    getDefaultTemplates() {
        return {
            // Templates de Análise
            analise_swot: {
                name: 'Análise SWOT',
                category: 'Análise',
                description: 'Análise de Forças, Fraquezas, Oportunidades e Ameaças',
                systemPrompt: 'Você é um analista estratégico especializado em análise SWOT.',
                userPrompt: `Realize uma análise SWOT completa sobre:

{input}

{context}

Estruture sua resposta em:
- Forças (Strengths)
- Fraquezas (Weaknesses)
- Oportunidades (Opportunities)
- Ameaças (Threats)

Seja específico e forneça insights acionáveis.`,
                variables: ['input', 'context']
            },
            
            analise_competitiva: {
                name: 'Análise Competitiva',
                category: 'Análise',
                description: 'Análise de mercado e concorrentes',
                systemPrompt: 'Você é um especialista em análise de mercado e inteligência competitiva.',
                userPrompt: `Analise o cenário competitivo de:

{input}

{context}

Inclua:
1. Principais concorrentes
2. Diferenciais competitivos
3. Posicionamento de mercado
4. Tendências do setor
5. Recomendações estratégicas`,
                variables: ['input', 'context']
            },
            
            // Templates de Criação
            blog_post: {
                name: 'Post de Blog',
                category: 'Criação',
                description: 'Artigo completo para blog',
                systemPrompt: 'Você é um escritor de conteúdo especializado em blogs engajadores e otimizados para SEO.',
                userPrompt: `Escreva um post de blog completo sobre:

Tópico: {input}
Tom: {tone}
Palavras-chave: {keywords}

{context}

Estrutura:
- Título atraente
- Introdução cativante
- 3-5 seções principais
- Conclusão com call-to-action
- Meta descrição (150-160 caracteres)

Extensão: {length} palavras`,
                variables: ['input', 'tone', 'keywords', 'context', 'length']
            },
            
            social_media: {
                name: 'Post para Redes Sociais',
                category: 'Criação',
                description: 'Conteúdo otimizado para redes sociais',
                systemPrompt: 'Você é um especialista em marketing de redes sociais.',
                userPrompt: `Crie posts para redes sociais sobre:

{input}

Plataforma: {platform}
Objetivo: {objective}

{context}

Forneça:
- Texto principal (adaptado à plataforma)
- Hashtags relevantes
- Call-to-action
- Sugestões de imagem/vídeo
- Melhor horário para postar`,
                variables: ['input', 'platform', 'objective', 'context']
            },
            
            // Templates de Planejamento
            plano_projeto: {
                name: 'Plano de Projeto',
                category: 'Planejamento',
                description: 'Plano detalhado de projeto',
                systemPrompt: 'Você é um gerente de projetos experiente certificado PMP.',
                userPrompt: `Crie um plano de projeto detalhado para:

{input}

Prazo: {deadline}
Orçamento: {budget}

{context}

Inclua:
1. Objetivos SMART
2. Escopo do projeto
3. Cronograma (fases e marcos)
4. Recursos necessários
5. Riscos e mitigações
6. Critérios de sucesso
7. Stakeholders`,
                variables: ['input', 'deadline', 'budget', 'context']
            },
            
            roadmap: {
                name: 'Roadmap Estratégico',
                category: 'Planejamento',
                description: 'Roadmap de produto ou projeto',
                systemPrompt: 'Você é um product manager estratégico.',
                userPrompt: `Desenvolva um roadmap estratégico para:

{input}

Horizonte: {timeframe}

{context}

Estruture em:
- Visão e objetivos
- Trimestre 1: Prioridades e entregas
- Trimestre 2: Prioridades e entregas
- Trimestre 3: Prioridades e entregas
- Trimestre 4: Prioridades e entregas
- Métricas de sucesso
- Dependências críticas`,
                variables: ['input', 'timeframe', 'context']
            },
            
            // Templates de Código
            code_review: {
                name: 'Code Review',
                category: 'Desenvolvimento',
                description: 'Revisão detalhada de código',
                systemPrompt: 'Você é um desenvolvedor sênior especializado em code review e melhores práticas.',
                userPrompt: `Revise o seguinte código:

\`\`\`{language}
{code}
\`\`\`

{context}

Analise:
1. Qualidade do código
2. Boas práticas
3. Performance
4. Segurança
5. Manutenibilidade
6. Testes
7. Documentação

Forneça sugestões específicas de melhoria.`,
                variables: ['language', 'code', 'context']
            },
            
            arquitetura: {
                name: 'Arquitetura de Software',
                category: 'Desenvolvimento',
                description: 'Design de arquitetura de sistema',
                systemPrompt: 'Você é um arquiteto de software experiente.',
                userPrompt: `Projete a arquitetura para:

{input}

Requisitos:
- Escalabilidade: {scalability}
- Usuários esperados: {users}
- Stack preferida: {stack}

{context}

Forneça:
1. Diagrama de arquitetura (descrição)
2. Componentes principais
3. Tecnologias recomendadas
4. Padrões de design
5. Estratégia de dados
6. Segurança
7. Deploy e infraestrutura`,
                variables: ['input', 'scalability', 'users', 'stack', 'context']
            },
            
            // Templates de Marketing
            email_marketing: {
                name: 'Email Marketing',
                category: 'Marketing',
                description: 'Email de marketing persuasivo',
                systemPrompt: 'Você é um copywriter especializado em email marketing com alta taxa de conversão.',
                userPrompt: `Crie um email de marketing para:

Produto/Serviço: {input}
Público-alvo: {audience}
Objetivo: {goal}

{context}

Inclua:
- Assunto (3 opções)
- Preview text
- Corpo do email
- Call-to-action claro
- P.S. persuasivo

Foco em conversão e urgência.`,
                variables: ['input', 'audience', 'goal', 'context']
            },
            
            landing_page: {
                name: 'Landing Page',
                category: 'Marketing',
                description: 'Copy completo para landing page',
                systemPrompt: 'Você é um especialista em copywriting para landing pages de alta conversão.',
                userPrompt: `Crie o copy completo para uma landing page de:

{input}

Público-alvo: {audience}
Proposta de valor: {value_proposition}

{context}

Estrutura:
1. Headline impactante
2. Subheadline
3. Benefícios (3-5)
4. Prova social
5. Features principais
6. FAQ (5 perguntas)
7. CTA principal
8. CTA secundário`,
                variables: ['input', 'audience', 'value_proposition', 'context']
            },
            
            // Templates de Pesquisa
            pesquisa_mercado: {
                name: 'Pesquisa de Mercado',
                category: 'Pesquisa',
                description: 'Pesquisa abrangente de mercado',
                systemPrompt: 'Você é um pesquisador de mercado experiente.',
                userPrompt: `Realize uma pesquisa de mercado sobre:

{input}

Região: {region}
Segmento: {segment}

{context}

Investigue:
1. Tamanho do mercado
2. Taxa de crescimento
3. Principais players
4. Tendências
5. Barreiras de entrada
6. Oportunidades
7. Dados demográficos
8. Comportamento do consumidor`,
                variables: ['input', 'region', 'segment', 'context']
            },
            
            // Templates Fiscais
            analise_nota_fiscal: {
                name: 'Análise de Nota Fiscal',
                category: 'Fiscal',
                description: 'Análise completa de nota fiscal eletrônica',
                systemPrompt: 'Você é um analista fiscal especializado em notas fiscais eletrônicas e legislação tributária brasileira.',
                userPrompt: `Analise a seguinte nota fiscal:

{input}

Tipo de Nota: {tipo_nota}
Operação: {operacao}

{context}

Realize análise completa:

1. **DADOS CADASTRAIS**
   - Validar CNPJ/CPF emitente e destinatário
   - Verificar Inscrição Estadual
   - Conferir endereços e dados de contato

2. **PRODUTOS/SERVIÇOS**
   - Conferir descrições e códigos NCM/CEST
   - Validar quantidades e valores
   - Verificar unidades de medida

3. **TRIBUTAÇÃO**
   - Calcular e validar ICMS
   - Verificar IPI (se aplicável)
   - Conferir PIS e COFINS
   - Validar ISS (para serviços)
   - Verificar CST/CSOSN
   - Conferir CFOP

4. **CONFORMIDADE**
   - Validar chave de acesso
   - Verificar protocolo de autorização
   - Conferir data de emissão e validade
   - Validar assinatura digital

5. **IRREGULARIDADES**
   - Identificar inconsistências
   - Detectar possíveis erros
   - Alertar sobre divergências
   - Sugerir correções

Forneça relatório detalhado com status: APROVADA, APROVADA COM RESSALVAS ou REJEITADA.`,
                variables: ['input', 'tipo_nota', 'operacao', 'context']
            },
            
            validacao_xml_nfe: {
                name: 'Validação XML NF-e',
                category: 'Fiscal',
                description: 'Validação técnica de arquivo XML de NF-e',
                systemPrompt: 'Você é um especialista em validação de arquivos XML de Notas Fiscais Eletrônicas.',
                userPrompt: `Valide o seguinte XML de NF-e:

{input}

{context}

Verificar:

1. **ESTRUTURA XML**
   - Schema XSD correto
   - Tags obrigatórias presentes
   - Hierarquia correta
   - Encoding UTF-8

2. **ASSINATURA DIGITAL**
   - Certificado digital válido
   - Assinatura íntegra
   - Cadeia de certificação

3. **CHAVE DE ACESSO**
   - Formato correto (44 dígitos)
   - Dígito verificador válido
   - Coerência com dados da nota

4. **DADOS TÉCNICOS**
   - Versão do layout
   - Código UF correto
   - Série e número
   - Modelo da nota

5. **CONSISTÊNCIA**
   - Totalizadores corretos
   - Somas conferem
   - Datas válidas
   - Códigos existentes

Retorne: VÁLIDO ou INVÁLIDO com detalhes dos erros encontrados.`,
                variables: ['input', 'context']
            },
            
            conferencia_impostos: {
                name: 'Conferência de Impostos',
                category: 'Fiscal',
                description: 'Conferência detalhada de cálculos tributários',
                systemPrompt: 'Você é um contador especializado em cálculos tributários e impostos brasileiros.',
                userPrompt: `Confira os impostos da seguinte operação:

{input}

Estado: {estado}
Regime Tributário: {regime}

{context}

Conferir:

1. **ICMS**
   - Base de cálculo
   - Alíquota aplicada
   - Valor do imposto
   - ICMS ST (se aplicável)
   - Redução de base (se aplicável)

2. **IPI**
   - Base de cálculo
   - Alíquota
   - Valor do imposto
   - Enquadramento legal

3. **PIS/COFINS**
   - Regime (cumulativo/não-cumulativo)
   - Base de cálculo
   - Alíquotas
   - Valores

4. **ISS** (para serviços)
   - Base de cálculo
   - Alíquota municipal
   - Retenção (se aplicável)

5. **OUTROS**
   - Substituição tributária
   - Diferencial de alíquota
   - FCP (Fundo de Combate à Pobreza)

Apresente cálculos detalhados e identifique divergências.`,
                variables: ['input', 'estado', 'regime', 'context']
            },
            
            // Template Genérico Personalizável
            custom: {
                name: 'Template Personalizado',
                category: 'Personalizado',
                description: 'Template totalmente personalizável',
                systemPrompt: 'Você é um assistente versátil e adaptável.',
                userPrompt: `{input}

{context}`,
                variables: ['input', 'context']
            }
        };
    }
    
    // Obtém template
    getTemplate(templateKey) {
        return this.templates[templateKey] || this.customTemplates.find(t => t.key === templateKey);
    }
    
    // Lista templates por categoria
    getTemplatesByCategory(category) {
        const allTemplates = { ...this.templates };
        this.customTemplates.forEach(t => {
            allTemplates[t.key] = t;
        });
        
        return Object.entries(allTemplates)
            .filter(([key, template]) => template.category === category)
            .map(([key, template]) => ({ key, ...template }));
    }
    
    // Lista todas as categorias
    getCategories() {
        const categories = new Set();
        
        Object.values(this.templates).forEach(t => categories.add(t.category));
        this.customTemplates.forEach(t => categories.add(t.category));
        
        return Array.from(categories).sort();
    }
    
    // Lista todos os templates
    getAllTemplates() {
        const allTemplates = { ...this.templates };
        this.customTemplates.forEach(t => {
            allTemplates[t.key] = t;
        });
        
        return Object.entries(allTemplates).map(([key, template]) => ({
            key,
            ...template
        }));
    }
    
    // Cria template personalizado
    createCustomTemplate(name, category, description, systemPrompt, userPrompt, variables) {
        const key = `custom_${Date.now()}`;
        
        const template = {
            key,
            name,
            category,
            description,
            systemPrompt,
            userPrompt,
            variables,
            custom: true,
            createdAt: new Date()
        };
        
        this.customTemplates.push(template);
        this.saveCustomTemplates();
        
        return template;
    }
    
    // Aplica template com variáveis
    applyTemplate(templateKey, variables) {
        const template = this.getTemplate(templateKey);
        if (!template) return null;
        
        let userPrompt = template.userPrompt;
        let systemPrompt = template.systemPrompt;
        
        // Substitui variáveis
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            userPrompt = userPrompt.replace(regex, value || '');
            systemPrompt = systemPrompt.replace(regex, value || '');
        });
        
        // Remove linhas vazias de variáveis não preenchidas
        userPrompt = userPrompt.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        return {
            systemPrompt,
            userPrompt,
            template: template.name
        };
    }
    
    // Salva templates personalizados
    saveCustomTemplates() {
        try {
            localStorage.setItem('customTemplates', JSON.stringify(this.customTemplates));
            return true;
        } catch (error) {
            console.error('Erro ao salvar templates:', error);
            return false;
        }
    }
    
    // Carrega templates personalizados
    loadCustomTemplates() {
        try {
            const saved = localStorage.getItem('customTemplates');
            if (saved) {
                this.customTemplates = JSON.parse(saved);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao carregar templates:', error);
            return false;
        }
    }
    
    // Deleta template personalizado
    deleteCustomTemplate(templateKey) {
        const index = this.customTemplates.findIndex(t => t.key === templateKey);
        if (index !== -1) {
            this.customTemplates.splice(index, 1);
            this.saveCustomTemplates();
            return true;
        }
        return false;
    }
    
    // Exporta template
    exportTemplate(templateKey) {
        const template = this.getTemplate(templateKey);
        if (!template) return null;
        
        return JSON.stringify(template, null, 2);
    }
    
    // Importa template
    importTemplate(jsonString) {
        try {
            const template = JSON.parse(jsonString);
            template.key = `imported_${Date.now()}`;
            template.custom = true;
            
            this.customTemplates.push(template);
            this.saveCustomTemplates();
            
            return template;
        } catch (error) {
            console.error('Erro ao importar template:', error);
            return null;
        }
    }
}

// Exportar para uso global
window.TemplateManager = TemplateManager;
