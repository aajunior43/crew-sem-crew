// Workflow Manager - Sistema de Pipeline de Agentes

class WorkflowManager {
    constructor() {
        this.workflows = [];
        this.currentWorkflow = null;
        this.executionMode = 'sequential'; // sequential, parallel, conditional
    }
    
    // Cria um novo workflow
    createWorkflow(name, description = '') {
        const workflow = {
            id: Date.now(),
            name,
            description,
            agents: [],
            connections: [],
            mode: 'sequential',
            createdAt: new Date()
        };
        
        this.workflows.push(workflow);
        return workflow;
    }
    
    // Adiciona agente ao workflow
    addAgentToWorkflow(workflowId, agentData, position = null) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow) return null;
        
        const agent = {
            id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...agentData,
            position: position || workflow.agents.length,
            status: 'pending',
            result: null,
            error: null
        };
        
        workflow.agents.push(agent);
        return agent;
    }
    
    // Define conexão entre agentes (para modo condicional)
    connectAgents(workflowId, fromAgentId, toAgentId, condition = null) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow) return false;
        
        const connection = {
            id: `conn_${Date.now()}`,
            from: fromAgentId,
            to: toAgentId,
            condition: condition, // função ou string de condição
            active: true
        };
        
        workflow.connections.push(connection);
        return connection;
    }
    
    // Define modo de execução
    setExecutionMode(workflowId, mode) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow) return false;
        
        if (['sequential', 'parallel', 'conditional'].includes(mode)) {
            workflow.mode = mode;
            return true;
        }
        return false;
    }
    
    // Executa workflow sequencial
    async executeSequential(workflow, apiManager, contextManager) {
        const results = [];
        
        for (let i = 0; i < workflow.agents.length; i++) {
            const agent = workflow.agents[i];
            agent.status = 'running';
            
            try {
                const context = contextManager.getContextForNextAgent(5);
                const userPrompt = AgentRoles.buildPrompt(
                    agent.role,
                    agent.userInput,
                    context
                );
                const systemPrompt = AgentRoles.getSystemPrompt(agent.role);
                
                const response = await apiManager.sendMessageWithSystem(
                    userPrompt,
                    systemPrompt
                );
                
                agent.status = 'completed';
                agent.result = response;
                
                contextManager.addAgentResponse(
                    agent.name,
                    agent.roleConfig.name,
                    agent.userInput,
                    response,
                    this.estimateTokens(response)
                );
                
                results.push({
                    agentId: agent.id,
                    success: true,
                    result: response
                });
                
            } catch (error) {
                agent.status = 'error';
                agent.error = error.message;
                
                results.push({
                    agentId: agent.id,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    // Executa workflow paralelo
    async executeParallel(workflow, apiManager, contextManager) {
        const promises = workflow.agents.map(async (agent) => {
            agent.status = 'running';
            
            try {
                const context = contextManager.getContextForNextAgent(5);
                const userPrompt = AgentRoles.buildPrompt(
                    agent.role,
                    agent.userInput,
                    context
                );
                const systemPrompt = AgentRoles.getSystemPrompt(agent.role);
                
                const response = await apiManager.sendMessageWithSystem(
                    userPrompt,
                    systemPrompt
                );
                
                agent.status = 'completed';
                agent.result = response;
                
                contextManager.addAgentResponse(
                    agent.name,
                    agent.roleConfig.name,
                    agent.userInput,
                    response,
                    this.estimateTokens(response)
                );
                
                return {
                    agentId: agent.id,
                    success: true,
                    result: response
                };
                
            } catch (error) {
                agent.status = 'error';
                agent.error = error.message;
                
                return {
                    agentId: agent.id,
                    success: false,
                    error: error.message
                };
            }
        });
        
        return await Promise.all(promises);
    }
    
    // Executa workflow condicional
    async executeConditional(workflow, apiManager, contextManager) {
        const results = [];
        const executed = new Set();
        const queue = workflow.agents.filter(a => 
            !workflow.connections.some(c => c.to === a.id)
        );
        
        while (queue.length > 0) {
            const agent = queue.shift();
            if (executed.has(agent.id)) continue;
            
            agent.status = 'running';
            
            try {
                const context = contextManager.getContextForNextAgent(5);
                const userPrompt = AgentRoles.buildPrompt(
                    agent.role,
                    agent.userInput,
                    context
                );
                const systemPrompt = AgentRoles.getSystemPrompt(agent.role);
                
                const response = await apiManager.sendMessageWithSystem(
                    userPrompt,
                    systemPrompt
                );
                
                agent.status = 'completed';
                agent.result = response;
                executed.add(agent.id);
                
                contextManager.addAgentResponse(
                    agent.name,
                    agent.roleConfig.name,
                    agent.userInput,
                    response,
                    this.estimateTokens(response)
                );
                
                results.push({
                    agentId: agent.id,
                    success: true,
                    result: response
                });
                
                // Verifica conexões e adiciona próximos agentes
                const nextConnections = workflow.connections.filter(c => 
                    c.from === agent.id && c.active
                );
                
                for (const conn of nextConnections) {
                    if (this.evaluateCondition(conn.condition, response)) {
                        const nextAgent = workflow.agents.find(a => a.id === conn.to);
                        if (nextAgent && !executed.has(nextAgent.id)) {
                            queue.push(nextAgent);
                        }
                    }
                }
                
            } catch (error) {
                agent.status = 'error';
                agent.error = error.message;
                
                results.push({
                    agentId: agent.id,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    // Avalia condição
    evaluateCondition(condition, response) {
        if (!condition) return true;
        
        if (typeof condition === 'function') {
            return condition(response);
        }
        
        if (typeof condition === 'string') {
            // Condições simples baseadas em palavras-chave
            return response.toLowerCase().includes(condition.toLowerCase());
        }
        
        return true;
    }
    
    // Executa workflow
    async execute(workflowId, apiManager, contextManager) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow) throw new Error('Workflow não encontrado');
        
        this.currentWorkflow = workflow;
        contextManager.startNewExecution();
        
        let results;
        
        switch (workflow.mode) {
            case 'parallel':
                results = await this.executeParallel(workflow, apiManager, contextManager);
                break;
            case 'conditional':
                results = await this.executeConditional(workflow, apiManager, contextManager);
                break;
            default:
                results = await this.executeSequential(workflow, apiManager, contextManager);
        }
        
        contextManager.finishExecution();
        return results;
    }
    
    // Estima tokens
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }
    
    // Salva workflows
    saveWorkflows() {
        try {
            localStorage.setItem('workflows', JSON.stringify(this.workflows));
            return true;
        } catch (error) {
            console.error('Erro ao salvar workflows:', error);
            return false;
        }
    }
    
    // Carrega workflows
    loadWorkflows() {
        try {
            const saved = localStorage.getItem('workflows');
            if (saved) {
                this.workflows = JSON.parse(saved);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao carregar workflows:', error);
            return false;
        }
    }
    
    // Deleta workflow
    deleteWorkflow(workflowId) {
        const index = this.workflows.findIndex(w => w.id === workflowId);
        if (index !== -1) {
            this.workflows.splice(index, 1);
            this.saveWorkflows();
            return true;
        }
        return false;
    }
    
    // Obtém workflow
    getWorkflow(workflowId) {
        return this.workflows.find(w => w.id === workflowId);
    }
    
    // Lista todos os workflows
    getAllWorkflows() {
        return this.workflows;
    }
}

// Exportar para uso global
window.WorkflowManager = WorkflowManager;
