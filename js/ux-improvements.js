// ✨ MELHORIAS DE UX/UI - Sistema de Agentes AI

// ============================================
// EXPORTAR RESULTADOS
// ============================================

class ExportManager {
    static formats = {
        markdown: {
            name: 'Markdown',
            icon: '📝',
            extension: 'md',
            mimeType: 'text/markdown'
        },
        json: {
            name: 'JSON',
            icon: '📊',
            extension: 'json',
            mimeType: 'application/json'
        },
        txt: {
            name: 'Texto',
            icon: '📄',
            extension: 'txt',
            mimeType: 'text/plain'
        },
        html: {
            name: 'HTML',
            icon: '🌐',
            extension: 'html',
            mimeType: 'text/html'
        }
    };
    
    static exportToMarkdown(execution) {
        if (!execution || !execution.agents || execution.agents.length === 0) {
            return null;
        }
        
        let markdown = `# 🤖 Resultados da Execução de Agentes AI\n\n`;
        markdown += `**Data:** ${new Date(execution.startTime).toLocaleString('pt-BR')}\n`;
        markdown += `**Duração:** ${(execution.duration / 1000).toFixed(1)}s\n`;
        markdown += `**Agentes Executados:** ${execution.agents.length}\n`;
        markdown += `**Tokens Estimados:** ${execution.totalTokensEstimate.toLocaleString()}\n\n`;
        markdown += `---\n\n`;
        
        execution.agents.forEach((agent, index) => {
            markdown += `## ${index + 1}. ${agent.agentName}\n\n`;
            markdown += `**Role:** ${agent.role}\n`;
            markdown += `**Timestamp:** ${new Date(agent.timestamp).toLocaleString('pt-BR')}\n\n`;
            markdown += `### 📥 Entrada\n\n`;
            markdown += `${agent.userInput}\n\n`;
            markdown += `### 📤 Resposta\n\n`;
            markdown += `${agent.response}\n\n`;
            markdown += `---\n\n`;
        });
        
        markdown += `\n*Gerado por Sistema de Agentes AI v2.1*\n`;
        
        return markdown;
    }
    
    static exportToJSON(execution) {
        if (!execution) return null;
        
        const exportData = {
            metadata: {
                version: '2.1',
                exportDate: new Date().toISOString(),
                executionDate: execution.startTime,
                duration: execution.duration,
                totalTokens: execution.totalTokensEstimate
            },
            execution: {
                id: execution.id,
                agents: execution.agents.map(agent => ({
                    name: agent.agentName,
                    role: agent.role,
                    input: agent.userInput,
                    response: agent.response,
                    timestamp: agent.timestamp,
                    tokens: agent.tokensUsed
                }))
            }
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    static exportToText(execution) {
        if (!execution || !execution.agents || execution.agents.length === 0) {
            return null;
        }
        
        let text = `RESULTADOS DA EXECUÇÃO DE AGENTES AI\n`;
        text += `${'='.repeat(60)}\n\n`;
        text += `Data: ${new Date(execution.startTime).toLocaleString('pt-BR')}\n`;
        text += `Duração: ${(execution.duration / 1000).toFixed(1)}s\n`;
        text += `Agentes: ${execution.agents.length}\n`;
        text += `Tokens: ${execution.totalTokensEstimate.toLocaleString()}\n\n`;
        text += `${'='.repeat(60)}\n\n`;
        
        execution.agents.forEach((agent, index) => {
            text += `${index + 1}. ${agent.agentName.toUpperCase()}\n`;
            text += `${'-'.repeat(60)}\n`;
            text += `Role: ${agent.role}\n`;
            text += `Timestamp: ${new Date(agent.timestamp).toLocaleString('pt-BR')}\n\n`;
            text += `ENTRADA:\n${agent.userInput}\n\n`;
            text += `RESPOSTA:\n${agent.response}\n\n`;
            text += `${'='.repeat(60)}\n\n`;
        });
        
        return text;
    }
    
    static exportToHTML(execution) {
        if (!execution || !execution.agents || execution.agents.length === 0) {
            return null;
        }
        
        let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados - Agentes AI</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background: #1a1a2e;
            color: #e4e4e7;
            line-height: 1.6;
        }
        h1 { color: #00d4ff; }
        h2 { color: #7b2cbf; margin-top: 2rem; }
        .metadata {
            background: #16213e;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
        .agent {
            background: #16213e;
            padding: 1.5rem;
            border-radius: 12px;
            margin: 1.5rem 0;
            border-left: 4px solid #00d4ff;
        }
        .input, .response {
            background: #0f1419;
            padding: 1rem;
            border-radius: 8px;
            margin: 0.5rem 0;
        }
        .label {
            color: #a1a1aa;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <h1>🤖 Resultados da Execução de Agentes AI</h1>
    <div class="metadata">
        <p><strong>Data:</strong> ${new Date(execution.startTime).toLocaleString('pt-BR')}</p>
        <p><strong>Duração:</strong> ${(execution.duration / 1000).toFixed(1)}s</p>
        <p><strong>Agentes:</strong> ${execution.agents.length}</p>
        <p><strong>Tokens:</strong> ${execution.totalTokensEstimate.toLocaleString()}</p>
    </div>
`;
        
        execution.agents.forEach((agent, index) => {
            html += `
    <div class="agent">
        <h2>${index + 1}. ${agent.agentName}</h2>
        <p><strong>Role:</strong> ${agent.role}</p>
        <p><strong>Timestamp:</strong> ${new Date(agent.timestamp).toLocaleString('pt-BR')}</p>
        
        <div class="label">Entrada</div>
        <div class="input">${agent.userInput.replace(/\n/g, '<br>')}</div>
        
        <div class="label">Resposta</div>
        <div class="response">${agent.response.replace(/\n/g, '<br>')}</div>
    </div>
`;
        });
        
        html += `
    <footer style="text-align: center; margin-top: 3rem; color: #71717a;">
        <p>Gerado por Sistema de Agentes AI v2.1</p>
    </footer>
</body>
</html>`;
        
        return html;
    }
    
    static download(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    static export(format, execution) {
        if (!execution) {
            showErrorNotification('Nenhuma execução para exportar.');
            return;
        }
        
        const formatConfig = this.formats[format];
        if (!formatConfig) {
            showErrorNotification('Formato de exportação inválido.');
            return;
        }
        
        let content;
        switch (format) {
            case 'markdown':
                content = this.exportToMarkdown(execution);
                break;
            case 'json':
                content = this.exportToJSON(execution);
                break;
            case 'txt':
                content = this.exportToText(execution);
                break;
            case 'html':
                content = this.exportToHTML(execution);
                break;
            default:
                showErrorNotification('Formato não suportado.');
                return;
        }
        
        if (!content) {
            showErrorNotification('Erro ao gerar conteúdo para exportação.');
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `agentes-ai-${timestamp}.${formatConfig.extension}`;
        
        this.download(content, filename, formatConfig.mimeType);
        showSuccessNotification(`Exportado como ${formatConfig.name}!`);
    }
}

// ============================================
// HISTÓRICO DE EXECUÇÕES
// ============================================

class HistoryManager {
    static showHistory() {
        const history = contextManager.getExecutionHistory();
        
        if (!history || history.length === 0) {
            showErrorNotification('Nenhuma execução no histórico.');
            return;
        }
        
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'neo-modal';
        modal.innerHTML = `
            <div class="neo-modal-overlay"></div>
            <div class="neo-modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="neo-modal-header">
                    <h2 style="margin: 0; color: var(--neo-accent-primary); display: flex; align-items: center; gap: 0.75rem;">
                        <span>📜</span>
                        <span>Histórico de Execuções</span>
                    </h2>
                    <button class="neo-modal-close" onclick="this.closest('.neo-modal').remove()">×</button>
                </div>
                <div class="neo-modal-body">
                    <p style="color: var(--neo-text-secondary); margin-bottom: 1.5rem;">
                        ${history.length} execuções encontradas
                    </p>
                    <div class="neo-history-container" id="historyContainer">
                        <!-- Histórico será inserido aqui -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const historyContainer = modal.querySelector('#historyContainer');
        
        // Ordenar por data (mais recente primeiro)
        const sortedHistory = [...history].reverse();
        
        sortedHistory.forEach((execution, index) => {
            const historyItem = this.createHistoryItem(execution, index);
            historyContainer.appendChild(historyItem);
        });
        
        // Animar entrada
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    static createHistoryItem(execution, index) {
        const item = document.createElement('div');
        item.className = 'neo-history-item neo-fade-in';
        item.style.animationDelay = `${index * 0.05}s`;
        
        const date = new Date(execution.startTime);
        const duration = (execution.duration / 1000).toFixed(1);
        const agentCount = execution.agents.length;
        const tokens = execution.totalTokensEstimate.toLocaleString();
        
        // Calcular tempo relativo
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        let timeAgo;
        if (days > 0) {
            timeAgo = `Há ${days} dia${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            timeAgo = `Há ${hours} hora${hours > 1 ? 's' : ''}`;
        } else {
            const minutes = Math.floor(diff / (1000 * 60));
            timeAgo = minutes > 0 ? `Há ${minutes} min` : 'Agora mesmo';
        }
        
        item.innerHTML = `
            <div class="neo-history-header">
                <div class="neo-history-title">
                    <span class="neo-history-icon">🤖</span>
                    <span>Execução #${execution.id}</span>
                </div>
                <span class="neo-badge neo-badge--primary">${timeAgo}</span>
            </div>
            <div class="neo-history-meta">
                <span class="neo-history-meta-item">
                    <span>👥</span>
                    <span>${agentCount} agentes</span>
                </span>
                <span class="neo-history-meta-item">
                    <span>⏱️</span>
                    <span>${duration}s</span>
                </span>
                <span class="neo-history-meta-item">
                    <span>🎯</span>
                    <span>${tokens} tokens</span>
                </span>
                <span class="neo-history-meta-item">
                    <span>📅</span>
                    <span>${date.toLocaleString('pt-BR')}</span>
                </span>
            </div>
            <div class="neo-history-actions">
                <button class="neo-history-btn" onclick="HistoryManager.viewExecution(${execution.id})">
                    <span>👁️</span>
                    <span>Ver Detalhes</span>
                </button>
                <button class="neo-history-btn" onclick="ExportManager.export('markdown', contextManager.getExecutionHistory().find(e => e.id === ${execution.id}))">
                    <span>📥</span>
                    <span>Exportar</span>
                </button>
                <button class="neo-history-btn" onclick="HistoryManager.deleteExecution(${execution.id})">
                    <span>🗑️</span>
                    <span>Excluir</span>
                </button>
            </div>
        `;
        
        return item;
    }
    
    static viewExecution(executionId) {
        const execution = contextManager.getExecutionHistory().find(e => e.id === executionId);
        if (!execution) {
            showErrorNotification('Execução não encontrada.');
            return;
        }
        
        // Fechar modal de histórico
        document.querySelector('.neo-modal')?.remove();
        
        // Mostrar resultados na área principal
        playArea.innerHTML = '';
        resultsSection.style.display = 'block';
        
        execution.agents.forEach((agent, index) => {
            const playItem = document.createElement('div');
            playItem.className = 'play-item neo-fade-in';
            playItem.style.animationDelay = `${index * 0.1}s`;
            
            playItem.innerHTML = `
                <div class="neo-result-header">
                    <span style="font-size: 1.75rem;">🤖</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--neo-text-primary);">${agent.agentName}</div>
                        <div style="font-size: 0.75rem; color: var(--neo-text-secondary);">${agent.role}</div>
                    </div>
                    <div class="neo-badge neo-badge--primary">${index + 1}/${execution.agents.length}</div>
                </div>
                <div class="neo-result-content">
                    <div style="color: var(--neo-text-primary); line-height: 1.7;">${formatResponse(agent.response)}</div>
                </div>
            `;
            
            playArea.appendChild(playItem);
        });
        
        showSuccessNotification('Execução carregada do histórico!');
    }
    
    static deleteExecution(executionId) {
        if (!confirm('Tem certeza que deseja excluir esta execução?')) {
            return;
        }
        
        const history = contextManager.getExecutionHistory();
        const index = history.findIndex(e => e.id === executionId);
        
        if (index !== -1) {
            history.splice(index, 1);
            contextManager.saveToLocalStorage();
            
            // Recarregar histórico
            document.querySelector('.neo-modal')?.remove();
            this.showHistory();
            
            showSuccessNotification('Execução excluída do histórico!');
        }
    }
}

// ============================================
// TEMA CLARO/ESCURO
// ============================================

class ThemeManager {
    static currentTheme = 'dark';
    
    static init() {
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme, false);
        
        // Event listener
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    static toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);
    }
    
    static setTheme(theme, save = true) {
        this.currentTheme = theme;
        const body = document.body;
        const toggle = document.getElementById('themeToggle');
        const slider = toggle?.querySelector('.neo-theme-toggle-slider');
        
        if (theme === 'light') {
            body.classList.add('light-theme');
            toggle?.classList.add('light');
            if (slider) slider.textContent = '☀️';
        } else {
            body.classList.remove('light-theme');
            toggle?.classList.remove('light');
            if (slider) slider.textContent = '🌙';
        }
        
        if (save) {
            localStorage.setItem('theme', theme);
            showSuccessNotification(`Tema ${theme === 'light' ? 'claro' : 'escuro'} ativado!`);
        }
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

// Exportar para uso global
window.ExportManager = ExportManager;
window.HistoryManager = HistoryManager;
window.ThemeManager = ThemeManager;

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        setupExportButton();
        setupHistoryButton();
    });
} else {
    ThemeManager.init();
    setupExportButton();
    setupHistoryButton();
}

// Configurar botão de exportar
function setupExportButton() {
    const exportButton = document.getElementById('exportButton');
    const exportMenu = document.getElementById('exportMenu');
    
    if (!exportButton || !exportMenu) return;
    
    // Criar menu de exportação
    Object.entries(ExportManager.formats).forEach(([key, format]) => {
        const option = document.createElement('div');
        option.className = 'neo-export-option';
        option.innerHTML = `
            <span class="neo-export-option-icon">${format.icon}</span>
            <span class="neo-export-option-text">${format.name}</span>
            <span class="neo-export-option-format">.${format.extension}</span>
        `;
        option.onclick = () => {
            const execution = contextManager.getCurrentExecution() || 
                            contextManager.getExecutionHistory()[contextManager.getExecutionHistory().length - 1];
            ExportManager.export(key, execution);
            exportMenu.style.display = 'none';
        };
        exportMenu.appendChild(option);
    });
    
    // Toggle menu
    exportButton.addEventListener('click', (e) => {
        e.stopPropagation();
        exportMenu.style.display = exportMenu.style.display === 'none' ? 'block' : 'none';
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', () => {
        exportMenu.style.display = 'none';
    });
}

// Configurar botão de histórico
function setupHistoryButton() {
    const historyButton = document.getElementById('historyButton');
    if (historyButton) {
        historyButton.addEventListener('click', () => {
            HistoryManager.showHistory();
        });
    }
}

console.log('✅ Melhorias de UX/UI carregadas');
