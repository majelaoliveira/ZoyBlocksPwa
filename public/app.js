document.addEventListener('DOMContentLoaded', () => {

    // Lógica do botão "Atualizar Mensagem"
    const updateButton = document.getElementById('updateButton');
    const messageElement = document.getElementById('message');
    updateButton.addEventListener('click', () => {
        const timestamp = new Date().toLocaleTimeString();
        messageElement.textContent = `Mensagem atualizada às: ${timestamp}`;
    });

    // Variáveis para a porta serial (novas)
    let port = null;
    let writer = null;
    const connectUsbButton = document.getElementById('connectUsbButton');

    // === Inicialização do Blockly (ÚNICA E CORRETA) ===
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: '<xml id="toolbox">' +
            '<category name="Lógica" colour="#5C81A6">' +
            '<block type="controls_if"></block>' +
            '</category>' +
            '<category name="Texto" colour="#5CA699">' +
            '<block type="text_print"></block>' +
            '</category>' +
            '<category name="Matemática" colour="#5CB35C">' +
            '<block type="math_number"></block>' +
            '</category>' +
            '<category name="Variáveis" colour="#A65C81" custom="VARIABLE"></category>' +
            '</xml>'
    });
    
    // === Lógica do Botão Conectar (AGORA COM WEB SERIAL) ===
    connectUsbButton.addEventListener('click', async () => {
        // Altera a verificação para a Web Serial API
        if (!('serial' in navigator)) {
            alert('Seu navegador não suporta a Web Serial API. Use Chrome ou Edge.');
            return;
        }

        try {
            // Lógica de desconexão da Web Serial
            if (port) {
                await writer.close();
                await port.close();
                port = null;
                writer = null;
                alert('Dispositivo desconectado.');
                return;
            }
            
            // Solicita e abre a porta serial
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            // Configura o writer para enviar dados
            const encoder = new TextEncoderStream();
            encoder.readable.pipeTo(port.writable);
            writer = encoder.writable.getWriter();

            alert('Conectado ao Arduino via Serial!');
            console.log('✅ Porta aberta:', port);

        } catch (error) {
            console.error('Falha ao conectar:', error);
            alert(`Falha ao conectar: ${error.message}`);
            port = null;
            writer = null;
        }
    });

    // === Função para enviar dados (AGORA COM WEB SERIAL) ===
    async function sendSerialData(data) {
        if (!writer) {
            console.error('Nenhum dispositivo conectado.');
            alert('Por favor, conecte o Arduino primeiro.');
            return;
        }
        try {
            // Usa o writer para enviar dados
            await writer.write(data + '\n');
            console.log(`[INFO] Dados enviados: ${data}`);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert(`Erro ao enviar dados: ${error.message}`);
        }
    }

    // === Lógica do Botão para Rodar o Código (AGORA ENVIA SEU COMANDO) ===
    const runCodeButton = document.getElementById('runCodeButton');
    runCodeButton.addEventListener('click', () => {
        // Envia a string exata que o seu firmware está esperando.
        const command = '<LED_TREZE:3>'; 
        sendSerialData(command);
    });
});