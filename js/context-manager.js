// Gerenciador de Contexto Compartilhado Inteligente

class ContextManager {
    constructor() {
        this.contexts = []; // Array de contextos de execução
        this.currentContext = null;
        this.maxContextLength = 8000; // Máximo de caracteres no contexto
    }
    
    // Inicia uma nova execução
    startNewExecution() {
        this.currentContext = {
            id: Date.now(),
            startTime: new Date(),
            agents: [],
            totalTokensEstimate: 0
        };
        return this.currentContext.id;
    }
    
    // Adiciona resposta de um agente ao contexto
    addAgentResponse(agentName, role, userInput, response, tokensUsed = 0) {
        if (!this.currentContext) {
            this.startNewExecution();
        }
        
        const agentData = {
            agentName,
            role,
            userInput,
            response,
            timestamp: new Date(),
            tokensUsed,
            order: this.currentContext.agents.length + 1
        };
        
        this.currentContext.agents.push(agentData);
        this.currentContext.totalTokensEstimate += tokensUsed;
        
        return agentData;
    }
    
    // Obtém contexto para o próximo agente
    getContextForNextAgent(maxAgents = 5) {
        if (!this.currentContext || this.currentContext.agents.length === 0) {
            return [];
        }
        
        // Pega os últimos N agentes
        const recentAgents = this.currentContext.agents.slice(-maxAgents);
        
        // Verifica se o contexto está muito grande
        const contextText = this.formatContextPreview(recentAgents);
        
        if (contextText.length > this.maxContextLength) {
            // Se muito grande, resume o contexto
            return this.summarizeContext(recentAgents);
        }
        
        return recentAgents;
    }
    
    // Formata contexto para preview
    formatContextPreview(agents) {
        return agents.map(agent => 
            `[${agent.agentName}]: ${agent.response}`
        ).join('\n\n');
    }
    
    // Resume contexto quando fica muito grande
    summarizeContext(agents) {
        // Mantém primeiro e último agente completos
        if (agents.length <= 2) return agents;
        
        const first = agents[0];
        const last = agents[agents.length - 1];
        const middle = agents.slice(1, -1);
        
        // Resume os agentes do meio
        const summarized = middle.map(agent => ({
            ...agent,
            response: this.truncateText(agent.response, 200),
            summarized: true
        }));
        
        return [first, ...summarized, last];
    }
    
    // Trunca texto mantendo início e fim
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        
        const halfLength = Math.floor(maxLength / 2) - 10;
        const start = text.substring(0, halfLength);
        const end = text.substring(text.length - halfLength);
        
        return `${start}... [resumido] ...${end}`;
    }
    
    // Finaliza execução atual
    finishExecution() {
        if (this.currentContext) {
            this.currentContext.endTime = new Date();
            this.currentContext.duration = 
                this.currentContext.endTime - this.currentContext.startTime;
            
            this.contexts.push(this.currentContext);
            
            // Mantém apenas últimas 10 execuções
            if (this.contexts.length > 10) {
                this.contexts.shift();
            }
            
            const finished = this.currentContext;
            this.currentContext = null;
            
            return finished;
        }
        return null;
    }
    
    // Obtém histórico de execuções
    getExecutionHistory() {
        return this.contexts;
    }
    
    // Obtém execução atual
    getCurrentExecution() {
        return this.currentContext;
    }
    
    // Busca por palavra-chave no histórico
    searchInHistory(keyword) {
        const results = [];
        
        this.contexts.forEach(context => {
            context.agents.forEach(agent => {
                if (agent.response.toLowerCase().includes(keyword.toLowerCase()) ||
                    agent.userInput.toLowerCase().includes(keyword.toLowerCase())) {
                    results.push({
                        executionId: context.id,
                        executionDate: context.startTime,
                        agent: agent.agentName,
                        role: agent.role,
                        match: agent.response
                    });
                }
            });
        });
        
        return results;
    }
    
    // Obtém estatísticas
    getStats() {
        const totalExecutions = this.contexts.length;
        const totalAgents = this.contexts.reduce((sum, ctx) => sum + ctx.agents.length, 0);
        const totalTokens = this.contexts.reduce((sum, ctx) => sum + ctx.totalTokensEstimate, 0);
        
        const roleUsage = {};
        this.contexts.forEach(context => {
            context.agents.forEach(agent => {
                roleUsage[agent.role] = (roleUsage[agent.role] || 0) + 1;
            });
        });
        
        return {
            totalExecutions,
            totalAgents,
            totalTokens,
            averageAgentsPerExecution: totalExecutions > 0 ? 
                (totalAgents / totalExecutions).toFixed(1) : 0,
            roleUsage,
            mostUsedRole: Object.entries(roleUsage)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
        };
    }
    
    // Exporta contexto como JSON
    exportContext(executionId = null) {
        if (executionId) {
            const context = this.contexts.find(ctx => ctx.id === executionId);
            return context ? JSON.stringify(context, null, 2) : null;
        }
        return JSON.stringify(this.contexts, null, 2);
    }
    
    // Importa contexto de JSON
    importContext(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data)) {
                this.contexts = data;
            } else {
                this.contexts.push(data);
            }
            return true;
        } catch (error) {
            console.error('Erro ao importar contexto:', error);
            return false;
        }
    }
    
    // Limpa histórico
    clearHistory() {
        this.contexts = [];
        this.currentContext = null;
    }
    
    // Salva no localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('agentContextHistory', this.exportContext());
            return true;
        } catch (error) {
            console.error('Erro ao salvar contexto:', error);
            return false;
        }
    }
    
    // Carrega do localStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('agentContextHistory');
            if (saved) {
                return this.importContext(saved);
            }
            return false;
        } catch (error) {
            console.error('Erro ao carregar contexto:', error);
            return false;
        }
    }
}

// Exportar para uso global
window.ContextManager = ContextManager;
