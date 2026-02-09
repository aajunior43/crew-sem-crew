// Agentes AI - Script principal

// Instâncias dos gerenciadores
let apiManager = null;
let contextManager = null;
let workflowManager = null;
let templateManager = null;

// Elementos DOM
const menu = document.getElementById('menu');
const menuItems = document.getElementById('menuItems');
const mainArea = document.getElementById('mainArea');
const droppedItems = document.getElementById('droppedItems');
const itemDetails = document.getElementById('itemDetails');
const agentRoleBadge = document.getElementById('agentRoleBadge');
const detailsEmptyState = document.getElementById('detailsEmptyState');
const detailsContent = document.getElementById('detailsContent');
const editButton = document.getElementById('editButton');
const editForm = document.getElementById('editForm');
const editInput = document.getElementById('editInput');
const renameButton = document.getElementById('renameButton');
const renameForm = document.getElementById('renameForm');
const renameInput = document.getElementById('renameInput');
const playButton = document.getElementById('playButton');
const playArea = document.getElementById('playArea');
const resultsSection = document.getElementById('resultsSection');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const workflowModeBtn = document.getElementById('workflowModeBtn');
const templatesBtn = document.getElementById('templatesBtn');
const globalInput = document.getElementById('globalInput');
const fileInput = document.getElementById('fileInput');
const clearInputBtn = document.getElementById('clearInputBtn');

// Estatísticas
const statExecutions = document.getElementById('statExecutions');
const statAgents = document.getElementById('statAgents');
const statTokens = document.getElementById('statTokens');

// Variáveis globais
let selectedItem = null;
let dragSrcEl = null;
let isLoading = false;
let debounceTimers = new Map();
let currentWorkflowMode = 'sequential'; // sequential, parallel, conditional
let globalInputText = ''; // Texto de entrada global

// Configurações de erro
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
    API_KEY_INVALID: 'Chave da API inválida. Verifique sua API key.',
    RATE_LIMIT: 'Muitas requisições. Aguarde um momento e tente novamente.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente em alguns minutos.',
    TIMEOUT: 'Tempo limite excedido. Tente novamente.',
    QUOTA_EXCEEDED: 'Cota da API excedida. Verifique seu plano.',
    GENERIC: 'Ocorreu um erro inesperado. Tente novamente.'
};

// Função de debounce
function debounce(func, delay, key = 'default') {
    if (debounceTimers.has(key)) {
        clearTimeout(debounceTimers.get(key));
    }
    
    const timer = setTimeout(() => {
        func();
        debounceTimers.delete(key);
    }, delay);
    
    debounceTimers.set(key, timer);
}

// Função para mostrar loading state
function showLoadingState(element, message = 'Carregando...') {
    if (element) {
        element.classList.add('loading');
        element.setAttribute('data-original-text', element.textContent);
        element.textContent = message;
        element.disabled = true;
    }
}

// Função para esconder loading state
function hideLoadingState(element) {
    if (element) {
        element.classList.remove('loading');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
        element.disabled = false;
    }
}

// Função para mostrar notificação de erro
function showErrorNotification(message, duration = 5000) {
    const existingNotification = document.querySelector('.neo-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'neo-notification neo-notification--error';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 1.5rem;">⚠️</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--neo-text-secondary); cursor: pointer; font-size: 1.25rem;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// Função para mostrar notificação de sucesso
function showSuccessNotification(message, duration = 3000) {
    const existingNotification = document.querySelector('.neo-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'neo-notification neo-notification--success';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 1.5rem;">✅</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--neo-text-secondary); cursor: pointer; font-size: 1.25rem;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// Função para analisar erro da API
function parseApiError(error, response) {
    if (!navigator.onLine) {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (response) {
        switch (response.status) {
            case 401:
                return ERROR_MESSAGES.API_KEY_INVALID;
            case 429:
                return ERROR_MESSAGES.RATE_LIMIT;
            case 500:
            case 502:
            case 503:
            case 504:
                return ERROR_MESSAGES.SERVER_ERROR;
            case 413:
                return ERROR_MESSAGES.QUOTA_EXCEEDED;
            default:
                if (response.status >= 400 && response.status < 500) {
                    return `Erro do cliente (${response.status}): ${error.message}`;
                }
                if (response.status >= 500) {
                    return ERROR_MESSAGES.SERVER_ERROR;
                }
        }
    }
    
    if (error.name === 'AbortError') {
        return ERROR_MESSAGES.TIMEOUT;
    }
    
    if (error.message.includes('fetch')) {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    return ERROR_MESSAGES.GENERIC;
}

// Função para criar item do menu
function createMenuItem(roleKey, customName = null) {
    try {
        if (!window.AgentRoles) {
            console.error('AgentRoles não está disponível!');
            return null;
        }
        
        const roleConfig = AgentRoles.getRoleConfig(roleKey);
        if (!roleConfig) {
            console.error('Role config não encontrado para:', roleKey);
            return null;
        }
        
        const agentName = customName || roleConfig.name;
        
        const newItem = document.createElement('div');
        newItem.className = 'neo-menu-item';
        newItem.draggable = true;
        newItem.setAttribute('data-role', roleKey);
        
        const icon = document.createElement('span');
        icon.className = 'neo-menu-item-icon';
        icon.textContent = roleConfig.icon;
        icon.style.color = roleConfig.color;
        
        const textSpan = document.createElement('span');
        textSpan.className = 'neo-menu-item-text';
        textSpan.textContent = agentName;
        
        newItem.appendChild(icon);
        newItem.appendChild(textSpan);
        
        newItem.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                name: agentName,
                role: roleKey
            }));
            newItem.classList.add('dragging');
        });
        
        newItem.addEventListener('dragend', function() {
            newItem.classList.remove('dragging');
        });
        
        return newItem;
    } catch (error) {
        console.error('Erro em createMenuItem:', error);
        return null;
    }
}

// Função para retry de requisição
window.retryAgent = async function(agentIndex) {
    showErrorNotification('Função de retry em desenvolvimento. Por favor, execute novamente todos os agentes.');
};

// Event listener para adicionar novo item
// REMOVIDO - Agentes são apenas arrastados do menu padrão

// Debounce para input de novo item
// REMOVIDO - não é mais necessário

// Event listeners para drag and drop na área principal
mainArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    const dropZone = droppedItems;
    if (dropZone && !dropZone.classList.contains('drag-over')) {
        dropZone.classList.add('drag-over');
    }
});

mainArea.addEventListener('drop', function(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    
    try {
        const agentData = JSON.parse(data);
        const newItem = createDroppedItem(agentData.name, agentData.role);
        
        // Remove empty state se existir
        const emptyState = droppedItems.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        droppedItems.appendChild(newItem);
        droppedItems.classList.remove('drag-over');
    } catch (error) {
        console.error('Erro ao processar drop:', error);
    }
});

mainArea.addEventListener('dragleave', function(e) {
    // Só remove se realmente saiu da área (não de um filho)
    if (!mainArea.contains(e.relatedTarget)) {
        droppedItems.classList.remove('drag-over');
    }
});

// Adicionar event listeners para limpar estado de drag
document.addEventListener('dragend', function(e) {
    // Remover classe dragging de todos os elementos
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
    
    // Remover classes de feedback visual
    document.querySelectorAll('.drop-zone').forEach(el => {
        el.classList.remove('drop-zone', 'drag-over');
    });
    
    // Remover drag-over da área principal
    droppedItems.classList.remove('drag-over');
});

// Função para criar item dropado
function createDroppedItem(agentName, roleKey) {
    const roleConfig = AgentRoles.getRoleConfig(roleKey);
    
    const newItem = document.createElement('div');
    newItem.className = 'neo-dropped-item';
    newItem.setAttribute('data-role', roleKey);
    newItem.setAttribute('data-agent-name', agentName);
    
    // Criar conteúdo do item
    const itemContent = document.createElement('div');
    itemContent.className = 'neo-dropped-item-content';
    
    const itemIcon = document.createElement('span');
    itemIcon.className = 'neo-dropped-item-icon';
    itemIcon.textContent = roleConfig.icon;
    itemIcon.style.color = roleConfig.color;
    
    const itemInfo = document.createElement('div');
    itemInfo.className = 'neo-dropped-item-info';
    
    const itemName = document.createElement('div');
    itemName.className = 'neo-dropped-item-name';
    itemName.textContent = agentName;
    
    const itemRole = document.createElement('div');
    itemRole.className = 'neo-dropped-item-role';
    itemRole.textContent = roleConfig.name;
    
    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemRole);
    
    itemContent.appendChild(itemIcon);
    itemContent.appendChild(itemInfo);
    
    newItem.appendChild(itemContent);
    
    // Armazenar dados do agente
    newItem.agentData = {
        name: agentName,
        role: roleKey,
        roleConfig: roleConfig,
        userInput: `Trabalhe em sua especialidade como ${roleConfig.name}.`
    };
    
    newItem.draggable = true;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'neo-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = function(event) {
        event.stopPropagation();
        droppedItems.removeChild(newItem);
        
        // Mostra empty state se não houver mais itens
        if (droppedItems.children.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'neo-empty-state';
            emptyState.innerHTML = `
                <div class="neo-empty-state-icon">📦</div>
                <p class="neo-empty-state-text">Arraste agentes do menu lateral para começar</p>
            `;
            droppedItems.appendChild(emptyState);
        }
        
        // Limpa detalhes
        detailsEmptyState.style.display = 'block';
        detailsContent.style.display = 'none';
        selectedItem = null;
    };
    
    newItem.appendChild(removeBtn);
    
    newItem.onclick = function() {
        // Remove seleção de outros itens
        document.querySelectorAll('.neo-dropped-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        selectedItem = newItem;
        newItem.classList.add('selected');
        
        // Mostra detalhes
        detailsEmptyState.style.display = 'none';
        detailsContent.style.display = 'block';
        
        // Atualiza badge do role
        agentRoleBadge.innerHTML = `
            <span style="font-size: 1.25rem;">${roleConfig.icon}</span>
            <strong>${roleConfig.name}</strong>
        `;
        agentRoleBadge.style.display = 'inline-flex';
        
        itemDetails.textContent = newItem.agentData.userInput;
        editButton.style.display = 'flex';
        renameButton.style.display = 'flex';
        editForm.style.display = 'none';
        renameForm.style.display = 'none';
    };

    newItem.addEventListener('dragstart', dragStart);
    newItem.addEventListener('dragover', dragOver);
    newItem.addEventListener('drop', drop);
    newItem.addEventListener('dragend', dragEnd);
    
    return newItem;
}

// Funções de drag and drop para reordenação
function dragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    e.target.classList.add('dragging');
    
    // Adicionar feedback visual à área de drop
    const dropZone = document.getElementById('droppedItems');
    if (dropZone) {
        dropZone.classList.add('drop-zone');
    }
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        let tempDetails = dragSrcEl.details;
        let tempOriginalDetails = dragSrcEl.originalDetails;
        dragSrcEl.details = this.details;
        dragSrcEl.originalDetails = this.originalDetails;
        this.details = tempDetails;
        this.originalDetails = tempOriginalDetails;
        
        updateEventListeners(dragSrcEl);
        updateEventListeners(this);
        
        if (selectedItem === dragSrcEl) {
            selectedItem = this;
            itemDetails.textContent = this.details;
        } else if (selectedItem === this) {
            selectedItem = dragSrcEl;
            itemDetails.textContent = dragSrcEl.details;
        }
    }
    
    return false;
}

function dragEnd() {
    this.style.opacity = '1';
}

// Função para atualizar event listeners
function updateEventListeners(item) {
    item.onclick = function() {
        // Remove seleção de outros itens
        document.querySelectorAll('.neo-dropped-item').forEach(i => {
            i.classList.remove('selected');
        });
        
        selectedItem = item;
        item.classList.add('selected');
        
        detailsEmptyState.style.display = 'none';
        detailsContent.style.display = 'flex';
        itemDetails.textContent = item.details;
        editButton.style.display = 'block';
        renameButton.style.display = 'block';
        editForm.style.display = 'none';
        renameForm.style.display = 'none';
    };
    
    item.querySelector('.remove-btn').onclick = function(event) {
        event.stopPropagation();
        droppedItems.removeChild(item);
        
        // Mostra empty state se não houver mais itens
        if (droppedItems.children.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <span class="empty-state-icon">📦</span>
                <p class="empty-state-text">Arraste agentes do menu lateral para começar</p>
            `;
            droppedItems.appendChild(emptyState);
        }
        
        detailsEmptyState.style.display = 'block';
        detailsContent.style.display = 'none';
        itemDetails.textContent = '';
        editButton.style.display = 'none';
        editForm.style.display = 'none';
        renameButton.style.display = 'none';
        renameForm.style.display = 'none';
        selectedItem = null;
    };
}

// Event listeners para edição
editButton.addEventListener('click', function() {
    if (selectedItem && selectedItem.agentData) {
        editInput.value = selectedItem.agentData.userInput;
        editForm.style.display = 'block';
        renameForm.style.display = 'none';
        editButton.style.display = 'none';
        renameButton.style.display = 'none';
    }
});

editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedItem && selectedItem.agentData) {
        selectedItem.agentData.userInput = editInput.value;
        itemDetails.textContent = selectedItem.agentData.userInput;
        editForm.style.display = 'none';
        editButton.style.display = 'block';
        renameButton.style.display = 'block';
        showSuccessNotification('Instruções atualizadas com sucesso!');
    }
});

// Debounce para input de edição
editInput.addEventListener('input', function() {
    debounce(() => {
        const value = this.value.trim();
        if (value.length > 0) {
            this.classList.add('has-content');
        } else {
            this.classList.remove('has-content');
        }
    }, 300, 'editInput');
});

// Event listeners para renomeação
renameButton.addEventListener('click', function() {
    if (selectedItem && selectedItem.agentData) {
        renameInput.value = selectedItem.agentData.name;
        renameForm.style.display = 'block';
        editForm.style.display = 'none';
        editButton.style.display = 'none';
        renameButton.style.display = 'none';
    }
});

renameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedItem && selectedItem.agentData) {
        const newName = renameInput.value.trim();
        if (newName) {
            selectedItem.agentData.name = newName;
            selectedItem.querySelector('.neo-dropped-item-name').textContent = newName;
            renameForm.style.display = 'none';
            editButton.style.display = 'block';
            renameButton.style.display = 'block';
            showSuccessNotification('Agente renomeado com sucesso!');
        }
    }
});

// Debounce para input de renomeação
renameInput.addEventListener('input', function() {
    debounce(() => {
        const value = this.value.trim();
        if (value.length > 0) {
            this.classList.add('has-content');
        } else {
            this.classList.remove('has-content');
        }
    }, 300, 'renameInput');
});

// Event listener para o botão Play
playButton.addEventListener('click', async function() {
    console.log('Botão Executar Agentes clicado!');
    
    // Prevenir múltiplas execuções simultâneas
    if (isLoading) {
        console.log('Já está executando, abortando...');
        showErrorNotification('Uma consulta já está em andamento. Aguarde a conclusão.');
        return;
    }
    
    const items = droppedItems.querySelectorAll('.neo-dropped-item');
    console.log('Agentes encontrados:', items.length);
    
    if (items.length === 0) {
        console.log('Nenhum agente na área de trabalho');
        showErrorNotification('Adicione agentes à área de trabalho antes de executar.');
        return;
    }
    
    // Validar configuração da API
    console.log('Verificando configuração da API...');
    console.log('apiManager existe?', !!apiManager);
    console.log('apiManager.isConfigured?', apiManager ? apiManager.isConfigured() : false);
    
    if (!apiManager || !apiManager.isConfigured()) {
        console.log('API não configurada');
        showErrorNotification('Configure o provedor, API key e modelo antes de executar.');
        return;
    }
    
    console.log('Iniciando execução...');
    isLoading = true;
    playArea.innerHTML = '';
    resultsSection.style.display = 'block';
    showLoadingState(playButton, 'Processando...');
    
    // ✨ MELHORIA: Validar inputs antes de executar
    const validation = validateAgentsBeforeExecution(items, globalInputText);
    
    // Mostrar erros se houver
    if (validation.errors.length > 0) {
        isLoading = false;
        hideLoadingState(playButton);
        
        const errorList = validation.errors.map(err => `• ${err}`).join('\n');
        showErrorNotification(
            `Erros de validação encontrados:\n\n${errorList}`,
            8000
        );
        
        console.error('Erros de validação:', validation.errors);
        return;
    }
    
    // Mostrar avisos se houver
    if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
            console.warn('⚠️', warning);
        });
        
        // Mostrar notificação de aviso (não bloqueia execução)
        showErrorNotification(
            `⚠️ Avisos: ${validation.warnings[0]}`,
            5000
        );
    }
    
    // ✨ MELHORIA: Criar progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'neo-progress-container neo-fade-in';
    progressContainer.innerHTML = `
        <div class="neo-progress-bar">
            <div class="neo-progress-fill" style="width: 0%"></div>
        </div>
        <div class="neo-progress-text">
            <span class="progress-label">
                <span class="neo-loading-spinner"></span>
                <span>Iniciando execução...</span>
            </span>
            <span class="progress-percentage">0%</span>
        </div>
        <div class="neo-progress-stats">
            <div class="neo-progress-stat">
                <span class="neo-progress-stat-value" id="progressCompleted">0</span>
                <span class="neo-progress-stat-label">Concluídos</span>
            </div>
            <div class="neo-progress-stat">
                <span class="neo-progress-stat-value" id="progressCurrent">-</span>
                <span class="neo-progress-stat-label">Atual</span>
            </div>
            <div class="neo-progress-stat">
                <span class="neo-progress-stat-value" id="progressRemaining">${items.length}</span>
                <span class="neo-progress-stat-label">Restantes</span>
            </div>
        </div>
    `;
    playArea.appendChild(progressContainer);
    
    const progressFill = progressContainer.querySelector('.neo-progress-fill');
    const progressLabel = progressContainer.querySelector('.progress-label span:last-child');
    const progressPercentage = progressContainer.querySelector('.progress-percentage');
    const progressCompleted = document.getElementById('progressCompleted');
    const progressCurrent = document.getElementById('progressCurrent');
    const progressRemaining = document.getElementById('progressRemaining');
    
    // Iniciar nova execução no contexto
    contextManager.startNewExecution();
    
    let successCount = 0;
    let errorCount = 0;

    try {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const agentData = item.agentData;
            
            // ✨ MELHORIA: Atualizar progress bar
            const progress = ((i) / items.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressLabel.textContent = `Executando ${agentData.name}...`;
            progressPercentage.textContent = `${Math.round(progress)}%`;
            progressCompleted.textContent = i;
            progressCurrent.textContent = agentData.name;
            progressRemaining.textContent = items.length - i;
            
            console.log(`Executando agente ${i + 1}/${items.length}:`, agentData.name);
            
            const playItem = document.createElement('div');
            playItem.className = 'play-item';
            
            // Cabeçalho do agente
            const agentHeader = document.createElement('div');
            agentHeader.className = 'neo-result-header';
            agentHeader.innerHTML = `
                <span style="font-size: 1.75rem; color: ${agentData.roleConfig.color};">
                    ${agentData.roleConfig.icon}
                </span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--neo-text-primary);">${agentData.name}</div>
                    <div style="font-size: 0.75rem; color: var(--neo-text-secondary);">${agentData.roleConfig.name}</div>
                </div>
                <div class="neo-badge neo-badge--primary" style="font-size: 0.75rem;">
                    ${i + 1}/${items.length}
                </div>
            `;
            playItem.appendChild(agentHeader);
            
            // Obter contexto dos agentes anteriores
            const context = contextManager.getContextForNextAgent(5);
            
            // Usar input global se disponível, senão usar instrução do agente
            const inputText = globalInputText || agentData.userInput;
            
            // Construir prompt usando o sistema de roles
            const userPrompt = AgentRoles.buildPrompt(
                agentData.role,
                inputText,
                context
            );
            
            const systemPrompt = AgentRoles.getSystemPrompt(agentData.role);
            
            const gptResponse = document.createElement('div');
            gptResponse.className = 'neo-result-content';
            gptResponse.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--neo-text-secondary);">
                    <div class="neo-loading"></div>
                    <span>Processando com ${agentData.roleConfig.name}...</span>
                </div>
            `;
            playItem.appendChild(gptResponse);
            
            playArea.appendChild(playItem);
            
            try {
                // ✨ MELHORIA: Enviar mensagem com retry automático
                const response = await APIRetryManager.sendWithRetry(
                    apiManager,
                    userPrompt,
                    systemPrompt,
                    3 // 3 tentativas com exponential backoff
                );
                
                gptResponse.innerHTML = `<div style="color: var(--neo-text-primary); line-height: 1.7;">${formatResponse(response)}</div>`;
                
                // Adicionar resposta ao contexto
                contextManager.addAgentResponse(
                    agentData.name,
                    agentData.roleConfig.name,
                    agentData.userInput,
                    response,
                    estimateTokens(response)
                );
                
                successCount++;
                
                // Pequena pausa entre requisições
                if (i < items.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                console.error('Erro na consulta IA:', error);
                const errorMessage = error.message || 'Erro desconhecido';
                
                gptResponse.innerHTML = `
                    <div style="padding: 1rem; background: rgba(255, 0, 110, 0.1); border-radius: var(--neo-radius-md); border-left: 4px solid var(--neo-accent-error);">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.25rem;">⚠️</span>
                            <strong style="color: var(--neo-accent-error);">Erro na Execução</strong>
                        </div>
                        <p style="color: var(--neo-text-secondary); margin-bottom: 0.75rem;">${errorMessage}</p>
                        <button class="neo-btn neo-btn--secondary" onclick="retryAgent(${i})">
                            <span>🔄</span>
                            <span>Tentar Novamente</span>
                        </button>
                    </div>
                `;
                errorCount++;
            }
        }
        
        // Finalizar execução
        const execution = contextManager.finishExecution();
        contextManager.saveToLocalStorage();
        
        // ✨ MELHORIA: Atualizar progress bar para 100%
        progressFill.style.width = '100%';
        progressLabel.textContent = 'Execução concluída!';
        progressPercentage.textContent = '100%';
        progressCompleted.textContent = items.length;
        progressCurrent.textContent = '✓ Completo';
        progressRemaining.textContent = '0';
        
        // Remover progress bar após 2 segundos
        setTimeout(() => {
            progressContainer.style.opacity = '0';
            progressContainer.style.transform = 'translateY(-10px)';
            progressContainer.style.transition = 'all 0.3s ease';
            setTimeout(() => progressContainer.remove(), 300);
        }, 2000);
        
        // Atualizar estatísticas
        updateStats();
        
        // Mostrar resumo
        const summary = document.createElement('div');
        summary.className = 'neo-result-item';
        summary.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(123, 44, 191, 0.1))';
        summary.style.borderLeft = '4px solid var(--neo-accent-primary)';
        summary.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: var(--neo-accent-primary);">📊 Resumo da Execução</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                    <div style="color: var(--neo-text-secondary); font-size: 0.875rem;">Agentes Executados</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: var(--neo-accent-primary);">${items.length}</div>
                </div>
                <div>
                    <div style="color: var(--neo-text-secondary); font-size: 0.875rem;">Taxa de Sucesso</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: var(--neo-accent-success);">${Math.round((successCount / items.length) * 100)}%</div>
                </div>
                <div>
                    <div style="color: var(--neo-text-secondary); font-size: 0.875rem;">Tokens Estimados</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: var(--neo-accent-warning);">~${execution.totalTokensEstimate.toLocaleString()}</div>
                </div>
                <div>
                    <div style="color: var(--neo-text-secondary); font-size: 0.875rem;">Duração</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: var(--neo-text-primary);">${(execution.duration / 1000).toFixed(1)}s</div>
                </div>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="color: var(--neo-text-secondary); font-size: 0.875rem;">Modo de Execução</div>
                <div style="font-weight: 600; color: var(--neo-text-primary); margin-top: 0.25rem;">${currentWorkflowMode === 'sequential' ? '⚡ Sequencial' : currentWorkflowMode === 'parallel' ? '🔀 Paralelo' : '🔄 Condicional'}</div>
            </div>
        `;
        playArea.appendChild(summary);
        
        // ✨ MELHORIA: Mostrar botão de exportar
        const exportButton = document.getElementById('exportButton');
        if (exportButton) {
            exportButton.style.display = 'flex';
        }
        
        // Mostrar notificação
        if (successCount > 0 && errorCount === 0) {
            showSuccessNotification(`Todas as ${successCount} consultas foram processadas com sucesso!`);
        } else if (successCount > 0 && errorCount > 0) {
            showErrorNotification(`${successCount} consultas bem-sucedidas, ${errorCount} com erro.`);
        } else if (errorCount > 0) {
            showErrorNotification(`Todas as ${errorCount} consultas falharam. Verifique sua configuração.`);
        }
        
    } catch (error) {
        console.error('Erro geral no processamento:', error);
        showErrorNotification('Erro inesperado durante o processamento. Tente novamente.');
    } finally {
        isLoading = false;
        hideLoadingState(playButton);
    }
});

// Função auxiliar para formatar resposta
function formatResponse(text) {
    // Converte markdown básico para HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Função auxiliar para estimar tokens
function estimateTokens(text) {
    // Estimativa aproximada: 1 token ≈ 4 caracteres
    return Math.ceil(text.length / 4);
}

// ✨ MELHORIA: Validação de input do usuário
function validateInput(text, maxTokens = 4000) {
    // Verificar se há texto
    if (!text || text.trim().length === 0) {
        return {
            valid: false,
            error: 'Por favor, adicione algum texto de entrada.'
        };
    }
    
    // Verificar tamanho mínimo
    if (text.trim().length < 10) {
        return {
            valid: false,
            error: 'Texto muito curto. Por favor, forneça mais contexto (mínimo 10 caracteres).'
        };
    }
    
    // Estimar tokens
    const estimatedTokens = estimateTokens(text);
    
    // Verificar limite de tokens
    if (estimatedTokens > maxTokens) {
        return {
            valid: false,
            error: `Texto muito longo! Estimado: ${estimatedTokens.toLocaleString()} tokens. ` +
                   `Máximo recomendado: ${maxTokens.toLocaleString()} tokens. ` +
                   `Por favor, reduza o texto em aproximadamente ${Math.ceil((estimatedTokens - maxTokens) * 4).toLocaleString()} caracteres.`
        };
    }
    
    // Aviso se estiver próximo do limite (80%)
    if (estimatedTokens > maxTokens * 0.8) {
        return {
            valid: true,
            warning: `Atenção: Texto próximo do limite (${estimatedTokens.toLocaleString()}/${maxTokens.toLocaleString()} tokens). ` +
                    `Considere reduzir para melhor performance.`
        };
    }
    
    // Tudo OK
    return {
        valid: true,
        tokens: estimatedTokens
    };
}

// Função para validar agentes antes da execução
function validateAgentsBeforeExecution(items, globalInputText) {
    const errors = [];
    const warnings = [];
    
    // Validar input global se existir
    if (globalInputText) {
        const validation = validateInput(globalInputText, 4000);
        
        if (!validation.valid) {
            errors.push(`Input Global: ${validation.error}`);
        } else if (validation.warning) {
            warnings.push(`Input Global: ${validation.warning}`);
        }
    }
    
    // Validar cada agente
    items.forEach((item, index) => {
        const agentData = item.agentData;
        if (!agentData) {
            errors.push(`Agente ${index + 1}: Dados do agente não encontrados.`);
            return;
        }
        
        // Se não há input global, validar input do agente
        if (!globalInputText && agentData.userInput) {
            const validation = validateInput(agentData.userInput, 2000);
            
            if (!validation.valid) {
                errors.push(`${agentData.name}: ${validation.error}`);
            } else if (validation.warning) {
                warnings.push(`${agentData.name}: ${validation.warning}`);
            }
        }
    });
    
    return { errors, warnings };
}

// Event listeners para salvar e carregar configuração
saveButton.addEventListener('click', saveConfiguration);
loadButton.addEventListener('click', loadConfiguration);

// Função para salvar configuração
function saveConfiguration() {
    const items = Array.from(droppedItems.querySelectorAll('.neo-dropped-item')).map(item => ({
        name: item.agentData.name,
        role: item.agentData.role,
        userInput: item.agentData.userInput
    }));
    
    localStorage.setItem('savedConfiguration', JSON.stringify(items));
    showSuccessNotification('Configuração salva com sucesso!');
}

// Função para carregar configuração
function loadConfiguration() {
    const savedConfig = localStorage.getItem('savedConfiguration');
    if (savedConfig) {
        const items = JSON.parse(savedConfig);
        droppedItems.innerHTML = '';
        
        if (items.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <span class="empty-state-icon">📦</span>
                <p class="empty-state-text">Arraste agentes do menu lateral para começar</p>
            `;
            droppedItems.appendChild(emptyState);
        } else {
            items.forEach(item => {
                const newItem = createDroppedItem(item.name, item.role);
                newItem.agentData.userInput = item.userInput;
                droppedItems.appendChild(newItem);
            });
        }
        showSuccessNotification('Configuração carregada com sucesso!');
    } else {
        showErrorNotification('Nenhuma configuração salva encontrada.');
    }
}

// Event listener para quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando...');
    
    // Verificar se elementos existem
    if (!menuItems) {
        console.error('Elemento menuItems não encontrado!');
        return;
    }
    
    // Inicializar gerenciadores
    apiManager = new APIManager();
    contextManager = new ContextManager();
    contextManager.loadFromLocalStorage();
    workflowManager = new WorkflowManager();
    workflowManager.loadWorkflows();
    templateManager = new TemplateManager();
    
    console.log('Gerenciadores inicializados');
    
    // Função para popular menu com todos os agentes
    function populateMenuWithAllAgents() {
        console.log('🔄 Populando menu com todos os agentes...');
        
        // Limpar menu atual
        menuItems.innerHTML = '';
        
        // Obter todos os agentes
        const allRoles = AgentRoles.getAllRoles();
        
        console.log(`📊 Total de agentes disponíveis: ${allRoles.length}`);
        
        // Agrupar por categoria
        const categorizedAgents = {};
        
        allRoles.forEach(role => {
            const category = role.category || 'Outros';
            if (!categorizedAgents[category]) {
                categorizedAgents[category] = [];
            }
            categorizedAgents[category].push(role);
        });
        
        // Ícones para cada categoria
        const categoryIcons = {
            'Negócios & Gestão': '💼',
            'Financeiro & Contábil': '💰',
            'Marketing & Vendas': '📈',
            'Tecnologia & Desenvolvimento': '💻',
            'Conteúdo & Comunicação': '✍️',
            'Educação & Treinamento': '🎓',
            'RH & Pessoas': '👥',
            'Jurídico & Compliance': '⚖️',
            'Criatividade & Design': '🎨',
            'Especialidades Diversas': '🌟'
        };
        
        // Adicionar agentes ao menu por categoria com pastas colapsáveis
        Object.entries(categorizedAgents).forEach(([category, agents]) => {
            // Container da categoria
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'neo-category-container';
            
            // Header da categoria (clicável para expandir/colapsar)
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'neo-category-header';
            categoryHeader.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">
                    <span class="neo-category-icon">${categoryIcons[category] || '📁'}</span>
                    <span class="neo-category-name">${category}</span>
                    <span class="neo-category-count">${agents.length}</span>
                </div>
                <span class="neo-category-toggle">▼</span>
            `;
            
            // Container dos agentes (inicialmente visível)
            const agentsContainer = document.createElement('div');
            agentsContainer.className = 'neo-category-agents';
            
            // Adicionar agentes da categoria
            agents.forEach(role => {
                try {
                    const menuItem = createMenuItem(role.key);
                    if (menuItem) {
                        agentsContainer.appendChild(menuItem);
                    }
                } catch (error) {
                    console.error('Erro ao criar agente', role.key, error);
                }
            });
            
            // Toggle para expandir/colapsar
            categoryHeader.addEventListener('click', function() {
                const isExpanded = categoryContainer.classList.toggle('collapsed');
                const toggle = categoryHeader.querySelector('.neo-category-toggle');
                toggle.textContent = isExpanded ? '▶' : '▼';
            });
            
            categoryContainer.appendChild(categoryHeader);
            categoryContainer.appendChild(agentsContainer);
            menuItems.appendChild(categoryContainer);
        });
        
        console.log(`✅ Menu populado com ${allRoles.length} agentes em ${Object.keys(categorizedAgents).length} categorias`);
        
        // Atualizar estatísticas
        updateStats();
    }
    
    // Aguardar carregamento dos agentes JSON
    window.addEventListener('agentsLoaded', (event) => {
        console.log('✅ Agentes JSON carregados:', event.detail);
        populateMenuWithAllAgents();
        setupAgentSearch();
    });
    
    // Função para configurar busca de agentes
    function setupAgentSearch() {
        const searchInput = document.getElementById('agentSearch');
        if (!searchInput) {
            console.warn('Campo de busca de agentes não encontrado');
            return;
        }
        
        // ✨ MELHORIA: Debounce para melhor performance
        searchInput.addEventListener('input', function() {
            const inputValue = this.value; // Capturar valor antes do debounce
            
            debounce(() => {
                const searchTerm = inputValue.toLowerCase().trim();
                const categories = document.querySelectorAll('.neo-category-container');
                
                if (!searchTerm) {
                    // Mostrar todos os agentes e categorias
                    categories.forEach(category => {
                        category.style.display = 'block';
                        const agents = category.querySelectorAll('.neo-menu-item');
                        agents.forEach(agent => agent.style.display = 'flex');
                    });
                    return;
                }
                
                // Filtrar agentes
                categories.forEach(category => {
                    const categoryName = category.querySelector('.neo-category-name')?.textContent.toLowerCase() || '';
                    const agents = category.querySelectorAll('.neo-menu-item');
                    let hasVisibleAgents = false;
                    
                    agents.forEach(agent => {
                        const agentName = agent.querySelector('.neo-menu-item-text')?.textContent.toLowerCase() || '';
                        const roleKey = agent.getAttribute('data-role') || '';
                        
                        // Busca por nome do agente, categoria ou role key
                        if (agentName.includes(searchTerm) || 
                            categoryName.includes(searchTerm) || 
                            roleKey.includes(searchTerm)) {
                            agent.style.display = 'flex';
                            hasVisibleAgents = true;
                        } else {
                            agent.style.display = 'none';
                        }
                    });
                    
                    // Mostrar/ocultar categoria baseado se tem agentes visíveis
                    category.style.display = hasVisibleAgents ? 'block' : 'none';
                    
                    // Expandir categoria se tiver resultados
                    if (hasVisibleAgents && category.classList.contains('collapsed')) {
                        category.classList.remove('collapsed');
                        const toggle = category.querySelector('.neo-category-toggle');
                        if (toggle) toggle.textContent = '▼';
                    }
                });
            }, 300, 'agentSearch'); // 300ms de delay
        });
        
        console.log('✅ Busca de agentes configurada com debounce');
    }
    
    // Popular menu inicial (com agentes padrão)
    setTimeout(() => {
        // Se os agentes JSON ainda não foram carregados, popular com os padrão
        if (menuItems.children.length === 0) {
            console.log('⏳ Aguardando carregamento dos agentes JSON...');
            populateMenuWithAllAgents();
        }
    }, 1000);
    
    console.log('Total de agentes no menu:', menuItems.children.length);
    
    // Atualizar estatísticas
    updateStats();
    
    // Event listener para modo de workflow
    workflowModeBtn.addEventListener('click', toggleWorkflowMode);
    
    // Event listener para templates
    templatesBtn.addEventListener('click', showTemplatesModal);
    
    // Event listeners para input global
    globalInput.addEventListener('input', function() {
        globalInputText = this.value;
        localStorage.setItem('globalInput', globalInputText);
    });
    
    fileInput.addEventListener('change', handleFileUpload);
    
    clearInputBtn.addEventListener('click', function() {
        globalInput.value = '';
        fileInput.value = '';
        globalInputText = '';
        localStorage.removeItem('globalInput');
        showSuccessNotification('Entrada limpa!');
    });
    
    // Carregar input salvo
    const savedInput = localStorage.getItem('globalInput');
    if (savedInput) {
        globalInput.value = savedInput;
        globalInputText = savedInput;
    }
    
    initializeMenuItems();
    initializeTooltips();
    
    // Melhorias para dispositivos touch
    optimizeForTouch();
    improveAccessibility();
    handleOrientationChange();
});

// Função para lidar com upload de arquivo
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        globalInput.value = content;
        globalInputText = content;
        localStorage.setItem('globalInput', globalInputText);
        showSuccessNotification(`Arquivo "${file.name}" carregado com sucesso!`);
    };
    
    reader.onerror = function() {
        showErrorNotification('Erro ao ler o arquivo. Tente novamente.');
    };
    
    reader.readAsText(file);
}

// Função para alternar modo de workflow
function toggleWorkflowMode() {
    const modes = ['sequential', 'parallel', 'conditional'];
    const currentIndex = modes.indexOf(currentWorkflowMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentWorkflowMode = modes[nextIndex];
    
    const modeNames = {
        sequential: 'Sequencial',
        parallel: 'Paralelo',
        conditional: 'Condicional'
    };
    
    const modeIcons = {
        sequential: '⚡',
        parallel: '🔀',
        conditional: '🔄'
    };
    
    workflowModeBtn.innerHTML = `
        <span>${modeIcons[currentWorkflowMode]}</span>
        <span>Modo: ${modeNames[currentWorkflowMode]}</span>
    `;
    
    showSuccessNotification(`Modo alterado para: ${modeNames[currentWorkflowMode]}`);
}

// Função para aplicar template de workflow
window.applyWorkflowTemplate = function(templateKey) {
    const workflow = WorkflowTemplates.applyTemplate(templateKey);
    
    if (!workflow) {
        showErrorNotification('Template não encontrado!');
        return;
    }
    
    // Limpar área de trabalho
    droppedItems.innerHTML = '';
    
    // Adicionar agentes do template
    workflow.agents.forEach(agentConfig => {
        const newItem = createDroppedItem(agentConfig.name, agentConfig.key);
        
        // Configurar instrução personalizada
        if (newItem && newItem.agentData) {
            newItem.agentData.userInput = agentConfig.instruction;
        }
        
        droppedItems.appendChild(newItem);
    });
    
    // Configurar input global
    if (workflow.globalInput) {
        globalInput.value = workflow.globalInput;
        globalInputText = workflow.globalInput;
    }
    
    // Fechar modal
    document.querySelector('.neo-modal')?.remove();
    
    // Mostrar notificação
    showSuccessNotification(`Workflow "${workflow.name}" aplicado com ${workflow.agents.length} agentes!`);
};

// Função para mostrar modal de templates
function showTemplatesModal() {
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'neo-modal';
    modal.innerHTML = `
        <div class="neo-modal-overlay"></div>
        <div class="neo-modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="neo-modal-header">
                <h2 style="margin: 0; color: var(--neo-accent-primary); display: flex; align-items: center; gap: 0.75rem;">
                    <span>🔄</span>
                    <span>Workflows Pré-Configurados</span>
                </h2>
                <button class="neo-modal-close" onclick="this.closest('.neo-modal').remove()">×</button>
            </div>
            <div class="neo-modal-body">
                <p style="color: var(--neo-text-secondary); margin-bottom: 1.5rem;">
                    Selecione um fluxo de agentes pré-configurado para começar rapidamente
                </p>
                <div id="templatesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
                    <!-- Templates serão inseridos aqui -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar templates ao grid
    const templatesGrid = modal.querySelector('#templatesGrid');
    const templates = WorkflowTemplates.getAllTemplates();
    
    templates.forEach(template => {
        const templateCard = document.createElement('div');
        templateCard.className = 'neo-template-card';
        templateCard.innerHTML = `
            <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 0.75rem;">
                <div style="font-size: 2rem;">${template.name.split(' ')[0]}</div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 0.25rem 0; color: var(--neo-text-primary); font-size: 1rem;">
                        ${template.name.substring(template.name.indexOf(' ') + 1)}
                    </h3>
                    <div style="font-size: 0.75rem; color: var(--neo-accent-primary);">
                        ${template.category}
                    </div>
                </div>
            </div>
            <p style="color: var(--neo-text-secondary); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.5;">
                ${template.description}
            </p>
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.75rem; color: var(--neo-text-tertiary); margin-bottom: 0.5rem;">
                    ${template.agents.length} agentes no fluxo:
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                    ${template.agents.slice(0, 4).map(agent => `
                        <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: rgba(0, 212, 255, 0.1); border-radius: 4px; color: var(--neo-text-secondary);">
                            ${agent.name}
                        </span>
                    `).join('')}
                    ${template.agents.length > 4 ? `<span style="font-size: 0.75rem; color: var(--neo-text-tertiary);">+${template.agents.length - 4} mais</span>` : ''}
                </div>
            </div>
            <button class="neo-btn neo-btn--primary neo-btn--block" onclick="applyWorkflowTemplate('${template.key}')">
                <span>✨</span>
                <span>Usar Este Fluxo</span>
            </button>
        `;
        
        templatesGrid.appendChild(templateCard);
    });
    
    // Animar entrada
    setTimeout(() => modal.classList.add('active'), 10);
}

// Função para atualizar estatísticas
function updateStats() {
    const stats = contextManager.getStats();
    
    if (statExecutions) statExecutions.textContent = stats.totalExecutions;
    if (statAgents) statAgents.textContent = stats.totalAgents;
    if (statTokens) statTokens.textContent = stats.totalTokens.toLocaleString();
}
let touchItem = null;
let touchOffset = { x: 0, y: 0 };
let isDragging = false;

// Detecta se é dispositivo touch
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Configuração de drag and drop para itens do menu
function setupMenuDragAndDrop() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        // Eventos de mouse (desktop)
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.classList.add('dragging');
        });
        
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        // Eventos de touch (mobile)
        if (isTouchDevice()) {
            item.addEventListener('touchstart', handleTouchStart, { passive: false });
            item.addEventListener('touchmove', handleTouchMove, { passive: false });
            item.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
    });
}

// Handlers para touch events
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    
    touchItem = e.target.cloneNode(true);
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    // Estiliza o item sendo arrastado
    touchItem.style.position = 'fixed';
    touchItem.style.zIndex = '1000';
    touchItem.style.pointerEvents = 'none';
    touchItem.style.opacity = '0.8';
    touchItem.style.transform = 'rotate(3deg) scale(0.95)';
    touchItem.style.left = (touch.clientX - touchOffset.x) + 'px';
    touchItem.style.top = (touch.clientY - touchOffset.y) + 'px';
    touchItem.style.width = rect.width + 'px';
    
    document.body.appendChild(touchItem);
    e.target.classList.add('dragging');
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging || !touchItem) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    touchItem.style.left = (touch.clientX - touchOffset.x) + 'px';
    touchItem.style.top = (touch.clientY - touchOffset.y) + 'px';
    
    // Detecta elemento sob o touch
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const mainArea = document.getElementById('mainArea');
    
    // Remove classe drag-over de todos os elementos
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    
    // Adiciona classe drag-over se estiver sobre a área principal
    if (elementBelow && (elementBelow === mainArea || mainArea.contains(elementBelow))) {
        mainArea.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    if (!isDragging || !touchItem) return;
    
    e.preventDefault();
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const mainArea = document.getElementById('mainArea');
    
    // Remove elementos temporários
    if (touchItem && touchItem.parentNode) {
        touchItem.parentNode.removeChild(touchItem);
    }
    
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
    
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    
    // Verifica se foi solto na área principal
    if (elementBelow && (elementBelow === mainArea || mainArea.contains(elementBelow))) {
        const originalItem = document.querySelector('.menu-item.dragging') || 
                           Array.from(document.querySelectorAll('.menu-item'))
                           .find(item => item.textContent === touchItem.textContent);
        
        if (originalItem) {
            const newItem = createDroppedItem(originalItem.textContent);
            droppedItems.appendChild(newItem);
            hapticFeedback();
        }
    }
    
    // Reset
    touchItem = null;
    isDragging = false;
}

// Inicialização dos event listeners para itens do menu existentes
function initializeMenuItems() {
    document.querySelectorAll('.neo-menu-item').forEach(item => {
        const textElement = item.querySelector('.neo-menu-item-text');
        const text = textElement ? textElement.textContent : item.textContent;
        const roleKey = item.getAttribute('data-role');
        
        if (!item.hasAttribute('data-initialized')) {
            item.addEventListener('dragstart', function(e) {
                const roleConfig = AgentRoles.getRoleConfig(roleKey);
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    name: text,
                    role: roleKey
                }));
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', function() {
                item.classList.remove('dragging');
            });
            
            item.setAttribute('data-initialized', 'true');
        }
    });
}

// Feedback haptic para dispositivos touch
function hapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50); // Vibração curta de 50ms
    }
}

// Melhora a responsividade em dispositivos touch
function optimizeForTouch() {
    if (isTouchDevice()) {
        // Adiciona classe para dispositivos touch
        document.body.classList.add('touch-device');
        
        // Melhora o scroll em dispositivos iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Previne zoom duplo-toque em botões
        const buttons = document.querySelectorAll('button, .neo-menu-item, .neo-dropped-item');
        buttons.forEach(button => {
            button.style.touchAction = 'manipulation';
        });
        
        // Adiciona feedback visual para touch
        document.addEventListener('touchstart', function(e) {
            if (e.target.matches('.neo-menu-item, .neo-dropped-item, button')) {
                e.target.style.transform = 'scale(0.98)';
                hapticFeedback();
            }
        });
        
        document.addEventListener('touchend', function(e) {
            if (e.target.matches('.neo-menu-item, .neo-dropped-item, button')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });
    }
}

// Melhora a acessibilidade
function improveAccessibility() {
    // Adiciona atributos ARIA para drag and drop
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Arrastar ${item.textContent} para a área principal`);
        item.setAttribute('tabindex', '0');
        
        // Suporte para teclado
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                createDroppedItem(item.textContent);
                hapticFeedback();
            }
        });
    });
    
    // Melhora o foco visual
    const style = document.createElement('style');
    style.textContent = `
        .neo-menu-item:focus, .neo-dropped-item:focus, button:focus {
            outline: 3px solid #3498db;
            outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Detecta orientação e ajusta layout
function handleOrientationChange() {
    function adjustForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const body = document.body;
        
        if (isTouchDevice()) {
            if (isLandscape && window.innerWidth <= 768) {
                body.classList.add('landscape-mobile');
            } else {
                body.classList.remove('landscape-mobile');
            }
        }
    }
    
    // Executa na inicialização
    adjustForOrientation();
    
    // Executa quando a orientação muda
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustForOrientation, 100);
    });
    
    // Executa quando a janela é redimensionada
    window.addEventListener('resize', adjustForOrientation);
}

// Dark theme is now the only theme - no toggle needed

// Função para inicializar tooltips
function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        let tooltip = null;
        let showTimeout = null;
        let hideTimeout = null;
        
        function showTooltip(e) {
            clearTimeout(hideTimeout);
            
            if (tooltip) {
                tooltip.remove();
            }
            
            showTimeout = setTimeout(() => {
                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = element.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.top - tooltipRect.height - 8;
                
                // Ajustar se sair da tela
                if (left < 8) left = 8;
                if (left + tooltipRect.width > window.innerWidth - 8) {
                    left = window.innerWidth - tooltipRect.width - 8;
                }
                if (top < 8) {
                    top = rect.bottom + 8;
                    tooltip.classList.add('tooltip-bottom');
                }
                
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                
                // Animação de entrada
                requestAnimationFrame(() => {
                    tooltip.classList.add('tooltip-visible');
                });
            }, 500);
        }
        
        function hideTooltip() {
            clearTimeout(showTimeout);
            
            if (tooltip) {
                hideTimeout = setTimeout(() => {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                }, 150);
            }
        }
        
        // Eventos para desktop
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        
        // Eventos para touch
        if (isTouchDevice()) {
            element.addEventListener('touchstart', showTooltip);
            element.addEventListener('touchend', () => {
                setTimeout(hideTooltip, 2000); // Esconde após 2s no touch
            });
        }
        
        // Esconder tooltip ao fazer scroll
        window.addEventListener('scroll', hideTooltip);
        window.addEventListener('resize', hideTooltip);
    });
}

// Event listener para quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    loadApiKey();
    initializeMenuItems();
    initializeTooltips();
    
    // Melhorias para dispositivos touch
    optimizeForTouch();
    improveAccessibility();
    handleOrientationChange();
});