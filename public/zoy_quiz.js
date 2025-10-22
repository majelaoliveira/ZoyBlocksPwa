/**
 * Lógica de inicialização do Blockly e definição dos blocos para o jogo de Labirinto.
 * Versão final limpa, focada em ambiente Browser/PWA (sem lógica Electron).
 */

let workspaceMaze = null;


// --- 1. DEFINIÇÃO DOS BLOCOS CUSTOMIZADOS E GERADORES ---

function defineMazeBlocksAndGenerators() {
    if (typeof Blockly === 'undefined' || typeof Blockly.Python === 'undefined') {
        console.error("Blockly ou Blockly.Python não está carregado.");
        return; 
    }
    
    Blockly.Python.addReservedWords('moveForward,turn,isPathForward,isPathGoal');

    // --- BLOCO: Mover para frente ---
    Blockly.Blocks['maze_moveForward'] = {
        init: function() {
            this.appendDummyInput().appendField("mover para frente");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Move o personagem uma casa para frente.");
            this.setHelpUrl("");
        }
    };
    Blockly.Python['maze_moveForward'] = function(block) {
        return 'moveForward()\n';
    };

    // --- BLOCO: Girar ---
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
            this.setTooltip("Gira o personagem 90 graus para a direção escolhida.");
            this.setHelpUrl("");
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
            this.setTooltip("Retorna verdadeiro se houver caminho livre para a frente.");
            this.setHelpUrl("");
        }
    };
    Blockly.Python['maze_isPathForward'] = function(block) {
        const code = 'isPathForward()';
        return [code, Blockly.Python.ORDER_FUNCTION_CALL];
    };
    
    // --- BLOCO: Chegou ao Destino (Condição) ---
    Blockly.Blocks['maze_isPathGoal'] = {
        init: function() {
            this.appendDummyInput().appendField("chegou ao destino");
            this.setOutput(true, "Boolean");
            this.setColour(210);
            this.setTooltip("Retorna verdadeiro se o personagem estiver na casa final.");
            this.setHelpUrl("");
        }
    };
    Blockly.Python['maze_isPathGoal'] = function(block) {
        const code = 'isPathGoal()';
        return [code, Blockly.Python.ORDER_FUNCTION_CALL];
    };
}


// --- 2. INICIALIZAÇÃO DO WORKSPACE ---

function initBlocklyMaze() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    if (!blocklyDiv || typeof Blockly.inject === 'undefined') {
        window.updateStatus("Erro: Dependências do Blockly não carregadas.", 'bg-red-500', 'text-white');
        return;
    }
    
    const toolboxXml = `
        <xml id="toolbox" style="display: none">
            <category name="Ações" colour="#5C81A6">
                <block type="maze_moveForward"></block>
                <block type="maze_turn"></block>
            </category>
            <category name="Controle" colour="#5CA699">
                <block type="controls_repeat_ext">
                    <value name="TIMES">
                        <shadow type="math_number">
                            <field name="NUM">5</field>
                        </shadow>
                    </value>
                </block>
                <block type="controls_whileUntil"></block>
                <block type="controls_if"></block>
                <block type="controls_if">
                    <mutation else="1"></mutation>
                </block>
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
        media: 'static/lib/blockly/media/', // Caminho correto para mídia do Blockly
        renderer: 'zelos'
    });
    
    window.workspaceMaze = workspaceMaze;
    window.updateStatus("Área de programação carregada. Construa seu programa!");
    
    // Garante que o estado inicial do jogo seja desenhado
    window.resetGame();
}


// --- 3. EXECUÇÃO DO CÓDIGO ---

window.executeProgram = function() {
    const runBtn = document.getElementById('btnExecutarPrograma');
    const stopBtn = document.getElementById('btnPararPrograma');
    
    if (!window.workspaceMaze) return;
    
    let code = Blockly.Python.workspaceToCode(window.workspaceMaze);

    if (!code.trim()) {
        window.updateStatus("Nenhum bloco no workspace para executar.", 'bg-yellow-500', 'text-white');
        return;
    }

    // Limpa o estado e prepara para execução
    window.resetGame(); 
    
    const stepDelay = 300; 
    const commands = code.split('\n').filter(line => line.trim().length > 0);
    let commandIndex = 0;

    function executeNextCommand() {
        if (!window.isRunning || commandIndex >= commands.length || window.isPathGoal()) {
            window.stopProgram();
            if (window.isPathGoal()) {
                 window.updateStatus("Programa concluído! Sucesso!", 'bg-green-500', 'text-white');
            } else if (window.isRunning) {
                 window.updateStatus("Programa concluído, mas o destino não foi alcançado.", 'bg-orange-500', 'text-white');
            }
            return;
        }

        const command = commands[commandIndex].trim();
        
        try {
            // Executa o comando gerado (ex: window.moveForward())
            eval('window.' + command); 
        } catch (e) {
            console.error("Erro na execução do comando:", command, e);
            window.updateStatus(`Erro na execução: ${e.message}`, 'bg-red-500', 'text-white');
            window.stopProgram();
            return;
        }
        
        commandIndex++;
        setTimeout(executeNextCommand, stepDelay);
    }

    // Inicia a simulação
    window.updateStatus("Iniciando execução...", 'bg-blue-500', 'text-white');
    window.isRunning = true;
    runBtn.disabled = true;
    stopBtn.disabled = false;
    executeNextCommand();
};

window.stopProgram = function() {
    window.isRunning = false; 
    window.updateStatus("Execução interrompida pelo usuário.", 'bg-gray-200', 'text-gray-700');
    document.getElementById('btnExecutarPrograma').disabled = false;
    document.getElementById('btnPararPrograma').disabled = true;
};


// --- 4. EXECUÇÃO DA INICIALIZAÇÃO (Ponto de entrada) ---

document.addEventListener("DOMContentLoaded", () => {
    // 1. Define os blocos customizados
    defineMazeBlocksAndGenerators(); 
    
    // 2. Inicializa o Workspace
    initBlocklyMaze();
});