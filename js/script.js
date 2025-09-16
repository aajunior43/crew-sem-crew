// Agentes IMG² - Script principal

// Elementos DOM
const menu = document.getElementById('menu');
const menuItems = document.getElementById('menuItems');
const mainArea = document.getElementById('mainArea');
const droppedItems = document.getElementById('droppedItems');
const itemDetails = document.getElementById('itemDetails');
const newItemForm = document.getElementById('newItemForm');
const newItemInput = document.getElementById('newItemInput');
const editButton = document.getElementById('editButton');
const editForm = document.getElementById('editForm');
const editInput = document.getElementById('editInput');
const renameButton = document.getElementById('renameButton');
const renameForm = document.getElementById('renameForm');
const renameInput = document.getElementById('renameInput');
const playButton = document.getElementById('playButton');
const playArea = document.getElementById('playArea');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const apiKeyInput = document.getElementById('apiKeyInput');
const themeToggle = document.getElementById('themeToggle');

// Variáveis globais
let selectedItem = null;
let dragSrcEl = null;
let apiKey = '';
let isLoading = false;
let debounceTimers = new Map();

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
    // Remove notificação existente se houver
    const existingNotification = document.querySelector('.error-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove após o tempo especificado
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// Função para mostrar notificação de sucesso
function showSuccessNotification(message, duration = 3000) {
    const existingNotification = document.querySelector('.success-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <span class="success-icon">✅</span>
        <span class="success-message">${message}</span>
        <button class="success-close" onclick="this.parentElement.remove()">×</button>
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
function createMenuItem(text) {
    const newItem = document.createElement('div');
    newItem.className = 'menu-item';
    newItem.draggable = true;
    newItem.textContent = text;
    newItem.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', text);
    });
    return newItem;
}

// Função para retry de requisição GPT
window.retryGptRequest = async function(button, prompt) {
    const gptResponse = button.closest('.gpt-response');
    if (!gptResponse) return;
    
    gptResponse.className = 'gpt-response loading-response';
    gptResponse.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Tentando novamente...</span>
    `;
    
    try {
        const response = await fetchGPT4Response(prompt);
        gptResponse.className = 'gpt-response success-response';
        gptResponse.innerHTML = `<div class="response-content">${response}</div>`;
        showSuccessNotification('Consulta realizada com sucesso!');
    } catch (error) {
        console.error('Erro no retry:', error);
        const errorMessage = parseApiError(error, error.response);
        
        gptResponse.className = 'gpt-response error-response';
        gptResponse.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${errorMessage}</span>
                <button class="retry-btn" onclick="retryGptRequest(this, '${prompt.replace(/'/g, "\\'")}')">
                    Tentar Novamente
                </button>
            </div>
        `;
    }
};

// Event listener para adicionar novo item com debounce
newItemForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newItemName = newItemInput.value.trim();
    if (newItemName) {
        const newItem = createMenuItem(newItemName);
        menuItems.appendChild(newItem);
        newItemInput.value = '';
        showSuccessNotification('Item adicionado com sucesso!');
    }
});

// Debounce para input de novo item
newItemInput.addEventListener('input', function() {
    debounce(() => {
        const value = this.value.trim();
        if (value.length > 0) {
            this.classList.add('has-content');
        } else {
            this.classList.remove('has-content');
        }
    }, 300, 'newItemInput');
});

// Event listeners para drag and drop na área principal
mainArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    if (dropZone && !dropZone.classList.contains('drag-over')) {
        dropZone.classList.add('drag-over');
    }
});

mainArea.addEventListener('drop', function(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const newItem = createDroppedItem(data);
    droppedItems.appendChild(newItem);
});

mainArea.addEventListener('dragleave', function(e) {
    // Só remove se realmente saiu da área (não de um filho)
    if (!mainArea.contains(e.relatedTarget)) {
        mainArea.classList.remove('drag-over');
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
    mainArea.classList.remove('drag-over');
});

// Função para criar item dropado
function createDroppedItem(data) {
    const newItem = document.createElement('div');
    newItem.className = 'dropped-item';
    newItem.textContent = data;
    newItem.details = `Fale uma palavra sobre: "${data}". `;
    newItem.originalDetails = newItem.details;
    newItem.draggable = true;
    
    const removeBtn = document.createElement('span');
    removeBtn.textContent = ' ×';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = function(event) {
        event.stopPropagation();
        droppedItems.removeChild(newItem);
        itemDetails.textContent = '';
        editButton.style.display = 'none';
        editForm.style.display = 'none';
        renameButton.style.display = 'none';
        renameForm.style.display = 'none';
        selectedItem = null;
    };
    
    newItem.appendChild(removeBtn);
    newItem.onclick = function() {
        selectedItem = newItem;
        itemDetails.textContent = newItem.details;
        editButton.style.display = 'block';
        renameButton.style.display = 'block';
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
        selectedItem = item;
        itemDetails.textContent = item.details;
        editButton.style.display = 'block';
        renameButton.style.display = 'block';
        editForm.style.display = 'none';
        renameForm.style.display = 'none';
    };
    
    item.querySelector('.remove-btn').onclick = function(event) {
        event.stopPropagation();
        droppedItems.removeChild(item);
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
    if (selectedItem) {
        editInput.value = selectedItem.details;
        editForm.style.display = 'block';
        renameForm.style.display = 'none';
        editButton.style.display = 'none';
        renameButton.style.display = 'none';
    }
});

editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedItem) {
        selectedItem.details = editInput.value;
        selectedItem.originalDetails = editInput.value;
        itemDetails.textContent = selectedItem.details;
        editForm.style.display = 'none';
        editButton.style.display = 'block';
        renameButton.style.display = 'block';
        showSuccessNotification('Detalhes atualizados com sucesso!');
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
    if (selectedItem) {
        renameInput.value = selectedItem.textContent.replace('×', '').trim();
        renameForm.style.display = 'block';
        editForm.style.display = 'none';
        editButton.style.display = 'none';
        renameButton.style.display = 'none';
    }
});

renameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedItem) {
        const newName = renameInput.value.trim();
        if (newName) {
            selectedItem.textContent = newName;
            selectedItem.appendChild(selectedItem.querySelector('.remove-btn'));
            selectedItem.details = selectedItem.details.replace(/dentro do\(a\) "[^"]+"/,
                                                               `dentro do(a) "${newName}"`);
            selectedItem.originalDetails = selectedItem.originalDetails.replace(/dentro do\(a\) "[^"]+"/,
                                                                                `dentro do(a) "${newName}"`);
            itemDetails.textContent = selectedItem.details;
            renameForm.style.display = 'none';
            editButton.style.display = 'block';
            renameButton.style.display = 'block';
            showSuccessNotification('Item renomeado com sucesso!');
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
    // Prevenir múltiplas execuções simultâneas
    if (isLoading) {
        showErrorNotification('Uma consulta já está em andamento. Aguarde a conclusão.');
        return;
    }
    
    const items = droppedItems.querySelectorAll('.dropped-item');
    
    if (items.length === 0) {
        playArea.textContent = 'Nenhum item para reproduzir.';
        return;
    }
    
    // Validar API key
    if (!apiKey || apiKey.trim() === '') {
        showErrorNotification('Configure sua API key antes de usar o GPT-4.');
        return;
    }
    
    isLoading = true;
    playArea.innerHTML = '';
    showLoadingState(playButton, 'Processando...');
    
    let previousResponse = '';
    let successCount = 0;
    let errorCount = 0;

    try {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const playItem = document.createElement('div');
            playItem.className = 'play-item';
            
            let prompt = item.originalDetails;
            if (previousResponse) {
                prompt += ` Considere que a resposta anterior foi: "${previousResponse}".`;
            }
            
            const itemContent = document.createElement('p');
            itemContent.textContent = `${item.textContent.replace('×', '')}: ${prompt}`;
            playItem.appendChild(itemContent);
            
            const gptResponse = document.createElement('div');
            gptResponse.className = 'gpt-response loading-response';
            gptResponse.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Consultando GPT-4... (${i + 1}/${items.length})</span>
            `;
            playItem.appendChild(gptResponse);
            
            playArea.appendChild(playItem);
            
            try {
                const response = await fetchGPT4Response(prompt);
                gptResponse.className = 'gpt-response success-response';
                gptResponse.innerHTML = `<div class="response-content">${response}</div>`;
                previousResponse = response;
                successCount++;
                
                // Pequena pausa entre requisições para evitar rate limiting
                if (i < items.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                console.error('Erro na consulta GPT-4:', error);
                const errorMessage = parseApiError(error, error.response);
                
                gptResponse.className = 'gpt-response error-response';
                gptResponse.innerHTML = `
                    <div class="error-content">
                        <span class="error-icon">⚠️</span>
                        <span class="error-text">${errorMessage}</span>
                        <button class="retry-btn" onclick="retryGptRequest(this, '${prompt.replace(/'/g, "\\'")}')">
                            Tentar Novamente
                        </button>
                    </div>
                `;
                previousResponse = '';
                errorCount++;
            }
        }
        
        // Mostrar resumo dos resultados
        if (successCount > 0 && errorCount === 0) {
            showSuccessNotification(`Todas as ${successCount} consultas foram processadas com sucesso!`);
        } else if (successCount > 0 && errorCount > 0) {
            showErrorNotification(`${successCount} consultas bem-sucedidas, ${errorCount} com erro.`);
        } else if (errorCount > 0) {
            showErrorNotification(`Todas as ${errorCount} consultas falharam. Verifique sua conexão e API key.`);
        }
        
    } catch (error) {
        console.error('Erro geral no processamento:', error);
        showErrorNotification('Erro inesperado durante o processamento. Tente novamente.');
    } finally {
        isLoading = false;
        hideLoadingState(playButton);
    }
});

// Função para fazer chamada à API do GPT-4
async function fetchGPT4Response(prompt, retryCount = 0) {
    const maxRetries = 3;
    const timeoutMs = 30000; // 30 segundos
    
    // Validação da API key
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('API key não configurada');
    }
    
    // Salve a API-KEY no localStorage
    localStorage.setItem('apiKey', apiKey);
    const API_URL = 'https://api.openai.com/v1/chat/completions';

    // Criar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 1.5,
                messages: [
                    {role: "system", content: "Você é um assistente útil que responde perguntas sobre ambientes e objetos."},
                    {role: "user", content: prompt}
                ],
                max_tokens: 16_384
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Erro desconhecido');
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: { message: errorText } };
            }
            
            // Retry para erros temporários
            if ((response.status === 429 || response.status >= 500) && retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchGPT4Response(prompt, retryCount + 1);
            }
            
            const error = new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            error.response = response;
            throw error;
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Resposta da API inválida');
        }
        
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Retry para erros de rede
        if ((error.name === 'TypeError' || error.name === 'AbortError') && retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchGPT4Response(prompt, retryCount + 1);
        }
        
        // Re-throw o erro para ser tratado pela função chamadora
        throw error;
    }
}

// Event listeners para salvar e carregar configuração
saveButton.addEventListener('click', saveConfiguration);
loadButton.addEventListener('click', loadConfiguration);

// Função para salvar configuração
function saveConfiguration() {
    const items = Array.from(droppedItems.querySelectorAll('.dropped-item')).map(item => ({
        text: item.textContent.replace('×', '').trim(),
        details: item.details,
        originalDetails: item.originalDetails
    }));
    
    localStorage.setItem('savedConfiguration', JSON.stringify(items));
    //alert('Configuração salva com sucesso!');
}

// Função para carregar configuração
function loadConfiguration() {
    const savedConfig = localStorage.getItem('savedConfiguration');
    if (savedConfig) {
        const items = JSON.parse(savedConfig);
        droppedItems.innerHTML = '';
        items.forEach(item => {
            const newItem = createDroppedItem(item.text);
            newItem.details = item.details;
            newItem.originalDetails = item.originalDetails;
            droppedItems.appendChild(newItem);
        });
        //alert('Configuração carregada com sucesso!');
    } else {
        alert('Nenhuma configuração salva encontrada.');
    }
}

// Função para validar formato da API key
function validateApiKeyFormat(key) {
    // OpenAI API keys começam com 'sk-' e têm pelo menos 20 caracteres
    return key.startsWith('sk-') && key.length >= 20;
}

// Event listener para API Key
apiKeyInput.addEventListener('blur', function() {
    const newApiKey = apiKeyInput.value.trim();
    if (newApiKey && newApiKey !== apiKey) {
        if (validateApiKeyFormat(newApiKey)) {
            apiKey = newApiKey;
            localStorage.setItem('apiKey', apiKey);
            this.classList.remove('invalid');
            this.classList.add('valid');
            showSuccessNotification('API Key salva com sucesso!');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
            showErrorNotification('Formato de API Key inválido. Deve começar com "sk-" e ter pelo menos 20 caracteres.');
        }
    } else if (!newApiKey) {
        this.classList.remove('valid', 'invalid');
        alert('Por favor, insira uma API-KEY válida.');
    }
});

// Debounce para input da API key
apiKeyInput.addEventListener('input', function() {
    debounce(() => {
        const value = this.value.trim();
        if (value.length > 0) {
            this.classList.add('has-content');
            if (validateApiKeyFormat(value)) {
                this.classList.remove('invalid');
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
            }
        } else {
            this.classList.remove('has-content', 'valid', 'invalid');
        }
    }, 500, 'apiKeyInput');
});

// Função para carregar a API-KEY salva
function loadApiKey() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        apiKey = savedApiKey;
        apiKeyInput.value = savedApiKey;
    }
}

// Variáveis para touch support
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
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', item.textContent);
        });
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
        const buttons = document.querySelectorAll('button, .menu-item, .dropped-item');
        buttons.forEach(button => {
            button.style.touchAction = 'manipulation';
        });
        
        // Adiciona feedback visual para touch
        document.addEventListener('touchstart', function(e) {
            if (e.target.matches('.menu-item, .dropped-item, button')) {
                e.target.style.transform = 'scale(0.98)';
                hapticFeedback();
            }
        });
        
        document.addEventListener('touchend', function(e) {
            if (e.target.matches('.menu-item, .dropped-item, button')) {
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
        .menu-item:focus, .dropped-item:focus, button:focus {
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

// Função para alternar tema
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        if (themeToggle) {
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Ativar tema escuro');
        }
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) {
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Ativar tema claro');
        }
    }
}

// Função para carregar tema salvo
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Ativar tema claro');
        }
    } else {
        if (themeToggle) {
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Ativar tema escuro');
        }
    }
}

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

// Event listener para o botão de tema
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Event listener para quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    loadApiKey();
    loadSavedTheme();
    initializeMenuItems();
    initializeTooltips();
    
    // Melhorias para dispositivos touch
    optimizeForTouch();
    improveAccessibility();
    handleOrientationChange();
    
    // Detectar mudanças na preferência de tema do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                if (themeToggle) {
                    themeToggle.textContent = '☀️';
                    themeToggle.setAttribute('aria-label', 'Ativar tema claro');
                }
            } else {
                document.body.classList.remove('dark-theme');
                if (themeToggle) {
                    themeToggle.textContent = '🌙';
                    themeToggle.setAttribute('aria-label', 'Ativar tema escuro');
                }
            }
        }
    });
});