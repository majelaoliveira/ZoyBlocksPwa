document.addEventListener('DOMContentLoaded', () => {

    // Variáveis para a Web Serial API
    let port = null;
    let writer = null;
    let reader = null;
    const baudrateDefault = 115200;

    const connectUsbButton = document.getElementById('btnConectar');
    const runCodeButton = document.getElementById('executarCodigoBtn');
    const terminalElement = document.getElementById('terminal');

    // === INJEÇÃO DO BLOCKLY ===
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: '<xml id="toolbox" style="display: none">' +
            '<category name="Lógica" colour="#5C81A6">' +
            '<block type="controls_if"></block>' +
            '<block type="logic_compare"></block>' +
            '</category>' +
            '<category name="Loops" colour="#5CA699">' +
            '<block type="controls_repeat_ext"></block>' +
            '<block type="controls_whileUntil"></block>' +
            '</category>' +
            '<category name="Matemática" colour="#5CB35C">' +
            '<block type="math_number"></block>' +
            '<block type="math_arithmetic"></block>' +
            '<block type="math_random_int"></block>' +
            '</category>' +
            '<category name="Texto" colour="#5C9AAD">' +
            '<block type="text"></block>' +
            '<block type="text_print"></block>' +
            '</category>' +
            '<category name="Listas" colour="#745CA6">' +
            '<block type="lists_create_with"></block>' +
            '</category>' +
            '<category name="Variáveis" colour="#A65C81" custom="VARIABLE"></category>' +
            '<category name="Funções" colour="#995CA6" custom="PROCEDURE"></category>' +
            
            // Novos blocos ZoyBLocks
            '<category name="ZoyBlocks - Motores" colour="#FF6F00">' +
            '<block type="zoy_motor_on_off">' +
            '<field name="MOTOR_STATE">ON</field>' +
            '</block>' +
            '<block type="zoy_motor_speed">' +
            '<field name="MOTOR_SPEED">100</field>' +
            '</block>' +
            '</category>' +
            '<category name="ZoyBlocks - Sensores" colour="#4CAF50">' +
            '<block type="zoy_sensor_ultrassonico">' +
            '<field name="PIN_TRIGGER">TRIGGER</field>' +
            '<field name="PIN_ECHO">ECHO</field>' +
            '</block>' +
            '<block type="zoy_sensor_infravermelho">' +
            '<field name="PIN">PIN</field>' +
            '</block>' +
            '</category>' +
            '</xml>'
    });
    
    // === FUNÇÕES DO PWA ===
    function logToTerminal(message, isError = false) {
        if (!terminalElement) return;

        const hora = new Date().toLocaleTimeString();
        const logDiv = document.createElement('div');
        logDiv.textContent = `[${hora}] ${message}`;
        if (isError) {
            logDiv.style.color = 'red';
        }
        terminalElement.appendChild(logDiv);
        terminalElement.scrollTop = terminalElement.scrollHeight;
    }

    async function readSerialData() {
        if (!terminalElement) return;

        try {
            while (port && port.readable) {
                const {
                    value,
                    done
                } = await reader.read();
                if (value) {
                    const hora = new Date().toLocaleTimeString();
                    const cleanData = value.replace(/\r/g, '').trim();
                    if (cleanData) {
                        terminalElement.innerHTML += `<div>[${hora}] ${cleanData}</div>`;
                    }
                }
                if (done) {
                    console.log('Leitor de serial finalizado.');
                    break;
                }
                terminalElement.scrollTop = terminalElement.scrollHeight;
            }
        } catch (error) {
            console.error("Erro na leitura da porta serial:", error);
            logToTerminal(`[ERRO] Erro na leitura: ${error.message}`, true);
        }
    }

    // === FUNÇÕES DA WEB SERIAL API ===
    if (connectUsbButton) {
        connectUsbButton.addEventListener('click', async () => {
            if (!('serial' in navigator)) {
                logToTerminal('Seu navegador não suporta a Web Serial API. Use Chrome ou Edge.', true);
                return;
            }
            try {
                if (port) {
                    // Se já estiver conectado, desconectar
                    await writer.close();
                    await reader.cancel();
                    await port.close();
                    port = null;
                    writer = null;
                    reader = null;
                    connectUsbButton.textContent = 'Conectar Dispositivo USB';
                    logToTerminal('Dispositivo desconectado.');
                    return;
                }
                // Se não estiver conectado, pedir a porta
                port = await navigator.serial.requestPort();
                await port.open({
                    baudRate: baudrateDefault
                });

                writer = port.writable.getWriter();
                const decoder = new TextDecoderStream();
                port.readable.pipeTo(decoder.writable);
                reader = decoder.readable.getReader();

                readSerialData();

                connectUsbButton.textContent = 'Desconectar Dispositivo USB';
                logToTerminal('Conectado com sucesso ao dispositivo via Serial!');
            } catch (error) {
                console.error('Falha ao conectar:', error);
                logToTerminal(`Falha ao conectar: ${error.message}`, true);
                port = null;
                writer = null;
                reader = null;
                connectUsbButton.textContent = 'Conectar Dispositivo USB';
            }
        });
    }

    async function sendSerialData(data) {
        if (!writer) {
            logToTerminal('Nenhum dispositivo conectado.', true);
            return;
        }
        try {
            await writer.write(new TextEncoder().encode(data + '\n'));
            logToTerminal(`Dados enviados: ${data}`);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            logToTerminal(`Erro ao enviar dados: ${error.message}`, true);
        }
    }

    if (runCodeButton) {
        runCodeButton.addEventListener('click', () => {
            const code = Blockly.JavaScript.workspaceToCode(workspace);
            if (code) {
                sendSerialData(code);
            } else {
                logToTerminal('Nenhum bloco no workspace para rodar.', true);
            }
        });
    }

    // Funções de Terminal (mantidas para compatibilidade)
    document.getElementById('abrirTerminalCompletoBtn').addEventListener('click', () => {
        logToTerminal("A funcionalidade 'Terminal Completo' não é suportada em PWAs de navegador.", true);
    });

    document.getElementById('limparTerminalBtn').addEventListener('click', () => {
        if (terminalElement) {
            terminalElement.innerHTML = '';
        }
    });
});