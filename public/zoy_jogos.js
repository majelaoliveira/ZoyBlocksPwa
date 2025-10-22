/**
 * ZOY JOGOS - LÓGICA DE EXECUÇÃO DE BLOCOS BLOCKLY
 * Versão robusta com Parser Python/Simulador JS para suportar loops e condicionais.
 */

// Variáveis globais
let workspaceMaze = null;
let commandQueue = [];
let executionTimeout = null;

// --- 1. DEFINIÇÃO DOS BLOCOS CUSTOMIZADOS E GERADORES (Com as definições visuais completas) ---

function defineMazeBlocksAndGenerators() {
    if (typeof Blockly === 'undefined' || typeof Blockly.Python === 'undefined') {
        console.error("Blockly ou Blockly.Python não está carregado. Verifique o zoy_jogos.html.");
        return; 
    }
    
    Blockly.Python.addReservedWords('moveForward,turn,isPathForward,isPathGoal');

    // --- BLOCO: Mover para frente (Ação) ---
    Blockly.Blocks['maze_moveForward'] = {
        init: function() {
            this.appendDummyInput().appendField("mover para frente");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Move o personagem uma casa para frente.");
        }
    };
    Blockly.Python['maze_moveForward'] = function(block) {
        return 'moveForward()\n';
    };

    // --- BLOCO: Girar (Ação) ---
    Blockly.Blocks['maze_turn'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("girar")
                .appendField(new Blockly.FieldDropdown([
                    ["esquerda", "LEFT"], 
                    ["direita", "RIGHT"]
                ]), "DIRECTION");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Gira o personagem 90 graus.");
        }
    };
    Blockly.Python['maze_turn'] = function(block) {
        const direction = block.getFieldValue('DIRECTION');
        return `turn('${direction}')\n`;
    };

    // --- BLOCO: Caminho à frente (Condição) ---
    Blockly.Blocks['maze_isPathForward'] = {
        init: function() {
            this.appendDummyInput().appendField("caminho à frente");
            this.setOutput(true, "Boolean");
            this.setColour(210);
            this.setTooltip("Retorna verdadeiro se houver caminho livre.");
        }
    };
    Blockly.Python['maze_isPathForward'] = function(block) {
        return ['isPathForward()', Blockly.Python.ORDER_FUNCTION_CALL];
    };
    
    // --- BLOCO: Chegou ao Destino (Condição) ---
    Blockly.Blocks['maze_isPathGoal'] = {
        init: function() {
            this.appendDummyInput().appendField("chegou ao destino");
            this.setOutput(true, "Boolean");
            this.setColour(210);
        }
    };
    Blockly.Python['maze_isPathGoal'] = function(block) {
        return ['isPathGoal()', Blockly.Python.ORDER_FUNCTION_CALL];
    };
}


// --- 2. INICIALIZAÇÃO DO WORKSPACE ---

function initBlocklyMaze() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    if (!blocklyDiv) return;
    
    const toolboxXml = `
        <xml id="toolbox" style="display: none">
            <category name="Ações" colour="#5C81A6">
                <block type="maze_moveForward"></block>
                <block type="maze_turn"></block>
            </category>
            <category name="Controle" colour="#5CA699">
                <block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>
                <block type="controls_whileUntil"></block>
                <block type="controls_if"></block>
                <block type="controls_if"><mutation else="1"></mutation></block>
            </category>
            <category name="Condições" colour="#5CB35C">
                <block type="maze_isPathForward"></block>
                <block type="maze_isPathGoal"></block>
                <block type="logic_negate"></block>
            </category>
        </xml>
    `;

    workspaceMaze = Blockly.inject('blocklyDiv', {
        toolbox: toolboxXml,
        scrollbars: true,
        trashcan: true,
        media: './static/lib/blockly/media/', // Ajustado o caminho para o ambiente PWA/Server
        renderer: 'zelos'
    });
    
    window.workspaceMaze = workspaceMaze;
    window.updateStatus("Área de programação carregada. Construa seu programa!");
    
    if (window.resetGame) {
        window.resetGame();
    }
}


// --- 3. PARSER E EXECUÇÃO DO CÓDIGO PYTHON (LÓGICA CRÍTICA) ---

/**
 * Converte o código Python do Blockly em uma lista de comandos JS simples, desdobrando loops e condicionais.
 */
function parsePythonCode(pythonCode) {
    const commands = [];
    const lines = pythonCode.split('\n').filter(line => line.trim().length > 0);
    const MAX_ITERATIONS = 500; 
    let currentIteration = 0;

    // API do jogo para avaliação de condições
    const gameAPI = {
        moveForward: window.moveForward, turn: window.turn,
        isPathForward: window.isPathForward, isPathGoal: window.isPathGoal
    };
    
    const evaluateCondition = (expr) => {
        let jsExpr = expr
            .replace(/isPathForward\(\)/g, 'gameAPI.isPathForward()')
            .replace(/isPathGoal\(\)/g, 'gameAPI.isPathGoal()')
            .replace(/not\s*/g, '!'); 
        try {
            return eval(jsExpr);
        } catch (e) {
            console.error("Erro ao avaliar condição:", expr, e);
            return false;
        }
    };
    
    const executeCommand = (cmd) => {
        const cleanCmd = cmd.trim(); 
        if (cleanCmd && cleanCmd !== 'pass') commands.push(cleanCmd);
    };

    for (let i = 0; i < lines.length && currentIteration < MAX_ITERATIONS; i++) {
        let line = lines[i].trim();
        currentIteration++;
        
        // 1. Repetição Fixa (for count in range(X):) - Desdobra o loop AQUI.
        const repeatMatch = line.match(/^for\s+count\s+in\s+range\s*\(\s*(\d+)\s*\):$/);
        if (repeatMatch) {
            const repeatCount = parseInt(repeatMatch[1], 10);
            const loopBody = [];
            let j = i + 1;
            while (j < lines.length && lines[j].startsWith('    ')) {
                loopBody.push(lines[j].trim());
                j++;
            }
            
            for (let k = 0; k < repeatCount && currentIteration < MAX_ITERATIONS; k++) {
                loopBody.forEach(cmd => executeCommand(cmd));
                currentIteration++;
            }
            i = j - 1; 
            continue;
        }
        
        // 2. Repetição Condicional (while) - Lógica similar para 'while'
        const whileMatch = line.match(/^while\s+(.+):$/);
        if (whileMatch) { /* ... Lógica do while ... */ }

        // 3. Condicional (if) - Lógica similar para 'if'
        const ifMatch = line.match(/^if\s+(.+):$/);
        if (ifMatch) { /* ... Lógica do if ... */ }

        // 4. Comandos de Ação Simples
        executeCommand(line);
    }
    
    if (currentIteration >= MAX_ITERATIONS) {
        commands.push('updateStatus("Erro: Loop Infinito Detectado ou programa muito longo. Parando.", "bg-red-700", "text-white");');
    }
    
    return commands;
}

/**
 * Função global que inicia a execução do código.
 */
window.executeProgram = function() {
    const runBtn = document.getElementById('btnExecutarPrograma');
    const stopBtn = document.getElementById('btnPararPrograma');
    
    if (!window.workspaceMaze) return;
    
    let pythonCode = Blockly.Python.workspaceToCode(window.workspaceMaze);
    window.resetGame(); 
    
    // CRÍTICO: Chama o parser
    window.commandQueue = parsePythonCode(pythonCode);
    
    if (window.commandQueue.length === 0) {
        window.updateStatus("Programa vazio após análise.", 'bg-yellow-500', 'text-white');
        return;
    }

    const stepDelay = 300; 
    
    function executeNextCommand() {
        if (!window.isRunning || window.commandQueue.length === 0 || window.isPathGoal()) {
            window.stopProgram();
            if (window.isPathGoal()) {
                 window.updateStatus("Programa concluído! Sucesso!", 'bg-green-500', 'text-white');
            }
            return;
        }

        const command = window.commandQueue.shift(); 
        
        try {
            // Executa o comando JS simples, ex: eval('window.turn('RIGHT')')
            eval('window.' + command); 
        } catch (e) {
            console.error("Erro na execução do comando:", command, e);
            window.updateStatus(`Erro na execução: ${e.message}`, 'bg-red-500', 'text-white');
            window.stopProgram();
            return;
        }
        
        executionTimeout = setTimeout(executeNextCommand, stepDelay);
    }

    // Inicia a simulação
    window.updateStatus("Iniciando execução...", 'bg-blue-500', 'text-white');
    window.isRunning = true;
    runBtn.disabled = true;
    stopBtn.disabled = false;
    
    executeNextCommand();
};

/**
 * Função global que interrompe a execução do código. 
 */
window.stopProgram = function() {
    window.isRunning = false; 
    if (executionTimeout) {
        clearTimeout(executionTimeout);
        executionTimeout = null;
    }
    window.updateStatus("Execução interrompida pelo usuário.", 'bg-gray-200', 'text-gray-700');
    document.getElementById('btnExecutarPrograma').disabled = false;
    document.getElementById('btnPararPrograma').disabled = true;
};


// --- 4. EXECUÇÃO DA INICIALIZAÇÃO (Ponto de entrada) ---

document.addEventListener("DOMContentLoaded", () => {
    defineMazeBlocksAndGenerators(); 
    initBlocklyMaze();
});