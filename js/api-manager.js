// API Manager - Gerencia múltiplas APIs (OpenAI, Gemini, OpenRouter)

class APIManager {
    constructor() {
        this.provider = '';
        this.apiKey = '';
        this.selectedModel = '';
        this.models = [];
        
        console.log('APIManager: Inicializando...');
        
        // Elementos DOM
        this.providerSelect = document.getElementById('apiProvider');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.loadModelsButton = document.getElementById('loadModelsButton');
        this.modelSelect = document.getElementById('modelSelect');
        this.modelSelectionContainer = document.getElementById('modelSelectionContainer');
        this.apiStatus = document.getElementById('apiStatus');
        this.modelInfo = document.getElementById('modelInfo');
        
        // Verificar se elementos existem
        console.log('APIManager: Elementos DOM:', {
            providerSelect: !!this.providerSelect,
            apiKeyInput: !!this.apiKeyInput,
            loadModelsButton: !!this.loadModelsButton,
            modelSelect: !!this.modelSelect
        });
        
        if (!this.loadModelsButton) {
            console.error('APIManager: Botão loadModelsButton não encontrado!');
            return;
        }
        
        this.initializeEventListeners();
        this.loadSavedConfig();
        
        console.log('APIManager: Inicializado com sucesso');
    }
    
    initializeEventListeners() {
        console.log('APIManager: Inicializando event listeners...');
        
        if (!this.providerSelect || !this.apiKeyInput || !this.loadModelsButton || !this.modelSelect) {
            console.error('APIManager: Elementos DOM faltando, não é possível inicializar listeners');
            return;
        }
        
        // Quando o provedor muda
        this.providerSelect.addEventListener('change', () => {
            console.log('APIManager: Provedor mudou para:', this.providerSelect.value);
            this.provider = this.providerSelect.value;
            this.updateUIForProvider();
            this.saveConfig();
        });
        
        // Quando a API key muda
        this.apiKeyInput.addEventListener('input', () => {
            this.apiKey = this.apiKeyInput.value.trim();
            console.log('APIManager: API Key atualizada, length:', this.apiKey.length);
            this.updateLoadModelsButton();
        });
        
        // Quando clica para buscar modelos
        this.loadModelsButton.addEventListener('click', () => {
            console.log('APIManager: Botão Buscar Modelos clicado!');
            console.log('APIManager: Provider:', this.provider, 'API Key length:', this.apiKey.length);
            this.loadAvailableModels();
        });
        
        // Quando seleciona um modelo
        this.modelSelect.addEventListener('change', () => {
            this.selectedModel = this.modelSelect.value;
            console.log('APIManager: Modelo selecionado:', this.selectedModel);
            this.updateModelInfo();
            this.saveConfig();
        });
        
        console.log('APIManager: Event listeners inicializados');
    }
    
    updateUIForProvider() {
        if (this.provider) {
            this.apiKeyInput.disabled = false;
            this.apiKeyInput.placeholder = this.getPlaceholderForProvider();
            this.updateLoadModelsButton();
        } else {
            this.apiKeyInput.disabled = true;
            this.loadModelsButton.disabled = true;
            this.modelSelectionContainer.style.display = 'none';
        }
    }
    
    getPlaceholderForProvider() {
        switch(this.provider) {
            case 'openai':
                return 'sk-...';
            case 'gemini':
                return 'AIza...';
            case 'openrouter':
                return 'sk-or-v1-...';
            default:
                return 'Cole sua API Key aqui';
        }
    }
    
    updateLoadModelsButton() {
        this.loadModelsButton.disabled = !this.provider || !this.apiKey;
    }
    
    async loadAvailableModels() {
        console.log('APIManager: loadAvailableModels chamado');
        console.log('APIManager: Provider:', this.provider, 'API Key:', this.apiKey ? 'Presente' : 'Ausente');
        
        if (!this.provider || !this.apiKey) {
            this.showStatus('error', 'Selecione um provedor e insira a API key');
            console.error('APIManager: Provider ou API key faltando');
            return;
        }
        
        this.showStatus('loading', 'Buscando modelos disponíveis...');
        this.loadModelsButton.disabled = true;
        
        console.log('APIManager: Iniciando busca de modelos para:', this.provider);
        
        try {
            let models = [];
            
            switch(this.provider) {
                case 'openai':
                    console.log('APIManager: Buscando modelos OpenAI...');
                    models = await this.fetchOpenAIModels();
                    break;
                case 'gemini':
                    console.log('APIManager: Buscando modelos Gemini...');
                    models = await this.fetchGeminiModels();
                    break;
                case 'openrouter':
                    console.log('APIManager: Buscando modelos OpenRouter...');
                    models = await this.fetchOpenRouterModels();
                    break;
                default:
                    throw new Error('Provedor não suportado: ' + this.provider);
            }
            
            console.log('APIManager: Modelos encontrados:', models.length);
            
            this.models = models;
            this.populateModelSelect(models);
            this.showStatus('success', `${models.length} modelos encontrados`);
            this.modelSelectionContainer.style.display = 'block';
            
        } catch (error) {
            console.error('APIManager: Erro ao buscar modelos:', error);
            this.showStatus('error', error.message || 'Erro ao buscar modelos');
        } finally {
            this.loadModelsButton.disabled = false;
        }
    }
    
    async fetchOpenAIModels() {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error('API key inválida ou erro na conexão');
        }
        
        const data = await response.json();
        
        // Filtrar apenas modelos de chat
        return data.data
            .filter(model => model.id.includes('gpt'))
            .map(model => ({
                id: model.id,
                name: model.id,
                description: `OpenAI ${model.id}`
            }))
            .sort((a, b) => b.id.localeCompare(a.id));
    }
    
    async fetchGeminiModels() {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
        
        if (!response.ok) {
            throw new Error('API key inválida ou erro na conexão');
        }
        
        const data = await response.json();
        
        // Filtrar apenas modelos que suportam generateContent
        return data.models
            .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
            .map(model => ({
                id: model.name.replace('models/', ''),
                name: model.displayName || model.name,
                description: model.description || model.displayName
            }));
    }
    
    async fetchOpenRouterModels() {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error('API key inválida ou erro na conexão');
        }
        
        const data = await response.json();
        
        return data.data.map(model => ({
            id: model.id,
            name: model.name || model.id,
            description: model.description || model.name,
            pricing: model.pricing
        }));
    }
    
    populateModelSelect(models) {
        this.modelSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            option.dataset.description = model.description;
            this.modelSelect.appendChild(option);
        });
        
        // Se havia um modelo selecionado anteriormente, tenta restaurar
        if (this.selectedModel) {
            const exists = models.find(m => m.id === this.selectedModel);
            if (exists) {
                this.modelSelect.value = this.selectedModel;
                this.updateModelInfo();
            }
        }
    }
    
    updateModelInfo() {
        const selectedOption = this.modelSelect.options[this.modelSelect.selectedIndex];
        if (this.modelInfo && selectedOption && selectedOption.dataset.description) {
            this.modelInfo.textContent = selectedOption.dataset.description;
        } else if (this.modelInfo) {
            this.modelInfo.textContent = '';
        }
    }
    
    showStatus(type, message) {
        if (!this.apiStatus) {
            console.warn('APIManager: apiStatus element não encontrado');
            return;
        }
        
        this.apiStatus.style.display = 'block';
        this.apiStatus.className = `neo-notification neo-notification--${type}`;
        
        const icons = {
            loading: '⏳',
            success: '✅',
            error: '⚠️'
        };
        
        this.apiStatus.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 1.5rem;">${icons[type]}</span>
                <span style="flex: 1;">${message}</span>
            </div>
        `;
        
        if (type === 'success') {
            setTimeout(() => {
                if (this.apiStatus) {
                    this.apiStatus.style.display = 'none';
                }
            }, 3000);
        }
    }
    
    async sendMessage(prompt) {
        if (!this.provider || !this.apiKey || !this.selectedModel) {
            throw new Error('Configure o provedor, API key e modelo antes de enviar mensagens');
        }
        
        switch(this.provider) {
            case 'openai':
                return await this.sendOpenAIMessage(prompt);
            case 'gemini':
                return await this.sendGeminiMessage(prompt);
            case 'openrouter':
                return await this.sendOpenRouterMessage(prompt);
            default:
                throw new Error('Provedor não suportado');
        }
    }
    
    async sendMessageWithSystem(prompt, systemPrompt = null) {
        if (!this.provider || !this.apiKey || !this.selectedModel) {
            throw new Error('Configure o provedor, API key e modelo antes de enviar mensagens');
        }
        
        switch(this.provider) {
            case 'openai':
                return await this.sendOpenAIMessage(prompt, systemPrompt);
            case 'gemini':
                return await this.sendGeminiMessage(prompt, systemPrompt);
            case 'openrouter':
                return await this.sendOpenRouterMessage(prompt, systemPrompt);
            default:
                throw new Error('Provedor não suportado');
        }
    }
    
    async sendOpenAIMessage(prompt, systemPrompt = null) {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({role: "system", content: systemPrompt});
        } else {
            messages.push({role: "system", content: "Você é um assistente útil que responde perguntas sobre ambientes e objetos."});
        }
        
        messages.push({role: "user", content: prompt});
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.selectedModel,
                messages: messages,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erro na requisição');
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
    
    async sendGeminiMessage(prompt, systemPrompt = null) {
        // Gemini não tem system prompt separado, então concatenamos
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erro na requisição');
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }
    
    async sendOpenRouterMessage(prompt, systemPrompt = null) {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({role: "system", content: systemPrompt});
        } else {
            messages.push({role: "system", content: "Você é um assistente útil que responde perguntas sobre ambientes e objetos."});
        }
        
        messages.push({role: "user", content: prompt});
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Agentes AI'
            },
            body: JSON.stringify({
                model: this.selectedModel,
                messages: messages
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erro na requisição');
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
    
    saveConfig() {
        const config = {
            provider: this.provider,
            apiKey: this.apiKey,
            selectedModel: this.selectedModel
        };
        localStorage.setItem('apiConfig', JSON.stringify(config));
    }
    
    loadSavedConfig() {
        const saved = localStorage.getItem('apiConfig');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                this.provider = config.provider || '';
                this.apiKey = config.apiKey || '';
                this.selectedModel = config.selectedModel || '';
                
                if (this.provider) {
                    this.providerSelect.value = this.provider;
                    this.updateUIForProvider();
                }
                
                if (this.apiKey) {
                    this.apiKeyInput.value = this.apiKey;
                    this.updateLoadModelsButton();
                }
            } catch (error) {
                console.error('Erro ao carregar configuração salva:', error);
            }
        }
    }
    
    isConfigured() {
        return this.provider && this.apiKey && this.selectedModel;
    }
}

// Exportar para uso global
window.APIManager = APIManager;

// ✨ MELHORIA: Retry Manager para maior resiliência
class APIRetryManager {
    /**
     * Envia mensagem com retry automático e exponential backoff
     * @param {APIManager} apiManager - Instância do APIManager
     * @param {string} prompt - Prompt do usuário
     * @param {string} systemPrompt - Prompt do sistema
     * @param {number} maxRetries - Número máximo de tentativas (padrão: 3)
     * @returns {Promise<string>} Resposta da API
     */
    static async sendWithRetry(apiManager, prompt, systemPrompt, maxRetries = 3) {
        let lastError = null;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`🔄 Tentativa ${i + 1}/${maxRetries} de envio para API...`);
                
                const response = await apiManager.sendMessageWithSystem(prompt, systemPrompt);
                
                if (i > 0) {
                    console.log(`✅ Sucesso na tentativa ${i + 1}!`);
                }
                
                return response;
                
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Tentativa ${i + 1}/${maxRetries} falhou:`, error.message);
                
                // Se é a última tentativa, propagar o erro
                if (i === maxRetries - 1) {
                    console.error(`❌ Todas as ${maxRetries} tentativas falharam`);
                    throw error;
                }
                
                // Exponential backoff: 1s, 2s, 4s, 8s...
                const delay = Math.pow(2, i) * 1000;
                console.log(`⏳ Aguardando ${delay}ms antes de tentar novamente...`);
                
                // Mostrar notificação ao usuário
                if (i === 0) {
                    showErrorNotification(
                        `Erro na conexão. Tentando novamente... (${i + 1}/${maxRetries})`,
                        2000
                    );
                }
                
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        // Fallback (nunca deve chegar aqui, mas por segurança)
        throw lastError || new Error('Falha desconhecida no retry');
    }
    
    /**
     * Verifica se o erro é recuperável (vale a pena tentar novamente)
     * @param {Error} error - Erro capturado
     * @returns {boolean} True se vale a pena retry
     */
    static isRetryableError(error) {
        const retryableMessages = [
            'network',
            'timeout',
            'ECONNREFUSED',
            'ETIMEDOUT',
            '429', // Rate limit
            '500', // Server error
            '502', // Bad gateway
            '503', // Service unavailable
            '504'  // Gateway timeout
        ];
        
        const errorMessage = error.message?.toLowerCase() || '';
        return retryableMessages.some(msg => errorMessage.includes(msg.toLowerCase()));
    }
}

// Exportar para uso global
window.APIRetryManager = APIRetryManager;
