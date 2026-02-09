// 🔥 CARREGAMENTO FORÇADO DOS 100 AGENTES JSON
// Este script força o carregamento síncrono de todos os agentes

console.log('🔥 FORÇA DE CARREGAMENTO ATIVADA!');

// Lista completa de todos os 100 agentes
const ALL_AGENTS = [
    // Negócios & Gestão (15)
    { category: 'negocios-gestao', file: 'analista-viabilidade' },
    { category: 'negocios-gestao', file: 'planejador-estrategico' },
    { category: 'negocios-gestao', file: 'analista-mercado' },
    { category: 'negocios-gestao', file: 'gestor-riscos' },
    { category: 'negocios-gestao', file: 'consultor-precificacao' },
    { category: 'negocios-gestao', file: 'analista-roi' },
    { category: 'negocios-gestao', file: 'especialista-kpis' },
    { category: 'negocios-gestao', file: 'auditor-interno' },
    { category: 'negocios-gestao', file: 'analista-custos' },
    { category: 'negocios-gestao', file: 'gestor-projetos' },
    { category: 'negocios-gestao', file: 'analista-processos' },
    { category: 'negocios-gestao', file: 'especialista-franchising' },
    { category: 'negocios-gestao', file: 'analista-fusoes' },
    { category: 'negocios-gestao', file: 'gestor-mudancas' },
    { category: 'negocios-gestao', file: 'analista-benchmarking' },
    
    // Financeiro & Contábil (12)
    { category: 'financeiro-contabil', file: 'contador-virtual' },
    { category: 'financeiro-contabil', file: 'analista-fluxo-caixa' },
    { category: 'financeiro-contabil', file: 'planejador-tributario' },
    { category: 'financeiro-contabil', file: 'analista-credito' },
    { category: 'financeiro-contabil', file: 'gestor-investimentos' },
    { category: 'financeiro-contabil', file: 'analista-balanco' },
    { category: 'financeiro-contabil', file: 'especialista-ifrs' },
    { category: 'financeiro-contabil', file: 'auditor-fiscal' },
    { category: 'financeiro-contabil', file: 'analista-inadimplencia' },
    { category: 'financeiro-contabil', file: 'planejador-financeiro-pessoal' },
    { category: 'financeiro-contabil', file: 'analista-valuation' },
    { category: 'financeiro-contabil', file: 'especialista-criptomoedas' },
    
    // Marketing & Vendas (15)
    { category: 'marketing-vendas', file: 'estrategista-marketing' },
    { category: 'marketing-vendas', file: 'copywriter' },
    { category: 'marketing-vendas', file: 'especialista-seo' },
    { category: 'marketing-vendas', file: 'gestor-redes-sociais' },
    { category: 'marketing-vendas', file: 'analista-funil-vendas' },
    { category: 'marketing-vendas', file: 'especialista-email-marketing' },
    { category: 'marketing-vendas', file: 'criador-landing-pages' },
    { category: 'marketing-vendas', file: 'analista-trafego-pago' },
    { category: 'marketing-vendas', file: 'especialista-branding' },
    { category: 'marketing-vendas', file: 'gestor-influenciadores' },
    { category: 'marketing-vendas', file: 'analista-crm' },
    { category: 'marketing-vendas', file: 'especialista-growth-hacking' },
    { category: 'marketing-vendas', file: 'criador-webinars' },
    { category: 'marketing-vendas', file: 'analista-concorrencia' },
    { category: 'marketing-vendas', file: 'especialista-storytelling' },
    
    // Tecnologia & Desenvolvimento (12)
    { category: 'tecnologia-desenvolvimento', file: 'arquiteto-software' },
    { category: 'tecnologia-desenvolvimento', file: 'revisor-codigo' },
    { category: 'tecnologia-desenvolvimento', file: 'especialista-apis' },
    { category: 'tecnologia-desenvolvimento', file: 'analista-seguranca' },
    { category: 'tecnologia-desenvolvimento', file: 'especialista-devops' },
    { category: 'tecnologia-desenvolvimento', file: 'analista-banco-dados' },
    { category: 'tecnologia-desenvolvimento', file: 'especialista-cloud' },
    { category: 'tecnologia-desenvolvimento', file: 'desenvolvedor-frontend' },
    { category: 'tecnologia-desenvolvimento', file: 'desenvolvedor-backend' },
    { category: 'tecnologia-desenvolvimento', file: 'especialista-mobile' },
    { category: 'tecnologia-desenvolvimento', file: 'analista-performance' },
    { category: 'tecnologia-desenvolvimento', file: 'especialista-ia-ml' },
    
    // Conteúdo & Comunicação (10)
    { category: 'conteudo-comunicacao', file: 'redator-blog' },
    { category: 'conteudo-comunicacao', file: 'criador-roteiros' },
    { category: 'conteudo-comunicacao', file: 'tradutor-tecnico' },
    { category: 'conteudo-comunicacao', file: 'editor-conteudo' },
    { category: 'conteudo-comunicacao', file: 'ghostwriter' },
    { category: 'conteudo-comunicacao', file: 'criador-newsletters' },
    { category: 'conteudo-comunicacao', file: 'especialista-pr' },
    { category: 'conteudo-comunicacao', file: 'redator-juridico' },
    { category: 'conteudo-comunicacao', file: 'criador-apresentacoes' },
    { category: 'conteudo-comunicacao', file: 'especialista-comunicacao-interna' },
    
    // Educação & Treinamento (8)
    { category: 'educacao-treinamento', file: 'designer-instrucional' },
    { category: 'educacao-treinamento', file: 'tutor-virtual' },
    { category: 'educacao-treinamento', file: 'criador-quizzes' },
    { category: 'educacao-treinamento', file: 'especialista-ead' },
    { category: 'educacao-treinamento', file: 'mentor-carreira' },
    { category: 'educacao-treinamento', file: 'criador-certificacoes' },
    { category: 'educacao-treinamento', file: 'especialista-gamificacao' },
    { category: 'educacao-treinamento', file: 'avaliador-competencias' },
    
    // RH & Pessoas (10)
    { category: 'rh-pessoas', file: 'recrutador-virtual' },
    { category: 'rh-pessoas', file: 'analista-clima' },
    { category: 'rh-pessoas', file: 'especialista-onboarding' },
    { category: 'rh-pessoas', file: 'gestor-performance' },
    { category: 'rh-pessoas', file: 'especialista-remuneracao' },
    { category: 'rh-pessoas', file: 'mediador-conflitos' },
    { category: 'rh-pessoas', file: 'especialista-cultura' },
    { category: 'rh-pessoas', file: 'analista-turnover' },
    { category: 'rh-pessoas', file: 'especialista-beneficios' },
    { category: 'rh-pessoas', file: 'coach-lideranca' },
    
    // Jurídico & Compliance (8)
    { category: 'juridico-compliance', file: 'analista-contratos' },
    { category: 'juridico-compliance', file: 'especialista-lgpd' },
    { category: 'juridico-compliance', file: 'consultor-trabalhista' },
    { category: 'juridico-compliance', file: 'especialista-propriedade-intelectual' },
    { category: 'juridico-compliance', file: 'analista-compliance' },
    { category: 'juridico-compliance', file: 'especialista-licitacoes' },
    { category: 'juridico-compliance', file: 'consultor-societario' },
    { category: 'juridico-compliance', file: 'especialista-recuperacao-judicial' },
    
    // Criatividade & Design (5)
    { category: 'criatividade-design', file: 'designer-grafico' },
    { category: 'criatividade-design', file: 'especialista-ux-ui' },
    { category: 'criatividade-design', file: 'criador-identidade-visual' },
    { category: 'criatividade-design', file: 'especialista-design-thinking' },
    { category: 'criatividade-design', file: 'diretor-arte' },
    
    // Especialidades Diversas (5)
    { category: 'especialidades-diversas', file: 'analista-sustentabilidade' },
    { category: 'especialidades-diversas', file: 'especialista-ecommerce' },
    { category: 'especialidades-diversas', file: 'analista-logistica' },
    { category: 'especialidades-diversas', file: 'especialista-atendimento' },
    { category: 'especialidades-diversas', file: 'analista-dados' }
];

// Função para carregar todos os agentes de forma síncrona
async function forceLoadAllAgents() {
    console.log(`🚀 Iniciando carregamento forçado de ${ALL_AGENTS.length} agentes...`);
    
    let loaded = 0;
    let errors = 0;
    
    for (const agent of ALL_AGENTS) {
        try {
            const path = `./agents/${agent.category}/${agent.file}.json`;
            const response = await fetch(path);
            
            if (!response.ok) {
                console.error(`❌ Erro ${response.status}: ${path}`);
                errors++;
                continue;
            }
            
            const data = await response.json();
            
            // Adicionar ao AgentRoles
            if (!AgentRoles.roles[data.key]) {
                AgentRoles.roles[data.key] = {
                    name: data.name,
                    icon: data.icon,
                    color: data.color,
                    category: data.category,
                    systemPrompt: data.systemPrompt,
                    userPromptTemplate: data.userPromptTemplate
                };
                loaded++;
                console.log(`✅ ${data.name} (${data.category})`);
            }
            
        } catch (error) {
            console.error(`❌ Erro ao carregar ${agent.file}:`, error);
            errors++;
        }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ CARREGAMENTO FORÇADO CONCLUÍDO!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📥 Carregados: ${loaded}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total: ${Object.keys(AgentRoles.roles).length} agentes`);
    
    // Disparar evento
    window.dispatchEvent(new CustomEvent('agentsLoaded', {
        detail: { loaded, errors, total: Object.keys(AgentRoles.roles).length }
    }));
    
    return { loaded, errors };
}

// Executar imediatamente
console.log('🔍 Verificando disponibilidade do AgentRoles...');

if (typeof AgentRoles !== 'undefined') {
    console.log('✅ AgentRoles encontrado, iniciando carregamento...');
    forceLoadAllAgents().then(result => {
        console.log('🎉 Carregamento concluído:', result);
    }).catch(error => {
        console.error('❌ Erro no carregamento:', error);
    });
} else {
    console.warn('⚠️ AgentRoles não encontrado! Aguardando 1 segundo...');
    setTimeout(() => {
        if (typeof AgentRoles !== 'undefined') {
            console.log('✅ AgentRoles encontrado após espera, iniciando carregamento...');
            forceLoadAllAgents().then(result => {
                console.log('🎉 Carregamento concluído:', result);
            }).catch(error => {
                console.error('❌ Erro no carregamento:', error);
            });
        } else {
            console.error('❌ AgentRoles ainda não está disponível após 1 segundo!');
            console.error('❌ Verifique se agent-roles.js está sendo carregado corretamente');
        }
    }, 1000);
}
