document.addEventListener('DOMContentLoaded', () => {

    // Lógica do botão "Atualizar Mensagem"
    const updateButton = document.getElementById('updateButton');
    const messageElement = document.getElementById('message');
    updateButton.addEventListener('click', () => {
        const timestamp = new Date().toLocaleTimeString();
        messageElement.textContent = `Mensagem atualizada às: ${timestamp}`;
    });

    // Variável para armazenar o dispositivo conectado
    let connectedDevice = null;
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
    
    // === Lógica do Botão Conectar USB ===
    connectUsbButton.addEventListener('click', async () => {
        if (!('usb' in navigator)) {
            alert('Seu navegador não suporta a WebUSB API.');
            return;
        }
        try {
            if (connectedDevice) {
                await connectedDevice.close();
                connectedDevice = null;
                alert('Desconectado com sucesso.');
                return;
            }
            const device = await navigator.usb.requestDevice({ filters: [] });
            connectedDevice = device;
            console.log('Dispositivo USB selecionado:', device);
            await device.open();
            if (device.configurations.length > 0) {
                await device.selectConfiguration(device.configurations[0].configurationValue);
            }
            const firstInterface = device.configurations[0].interfaces[0];
            const firstEndpoint = firstInterface.alternates[0].endpoints[0];
            await device.claimInterface(firstInterface.interfaceNumber);
            alert(`Conectado ao dispositivo: ${device.productName || 'Desconhecido'}`);
        } catch (error) {
            console.error('Falha ao conectar:', error);
            alert(`Falha ao conectar ao dispositivo USB: ${error.message}`);
            connectedDevice = null;
        }
    });

    // === Função para enviar dados via WebUSB ===
    async function sendUsbData(data) {
        if (!connectedDevice) {
            console.error('Nenhum dispositivo USB conectado.');
            alert('Por favor, conecte um dispositivo USB primeiro.');
            return;
        }
        try {
            const endpoint = connectedDevice.configurations[0].interfaces[0].alternates[0].endpoints.find(ep => ep.direction === 'out' && ep.type === 'bulk');
            if (!endpoint) {
                console.error('Nenhum endpoint de saída USB encontrado.');
                alert('Erro: Endpoint de saída não encontrado.');
                return;
            }
            const dataBuffer = new TextEncoder().encode(data + '\n');
            const result = await connectedDevice.transferOut(endpoint.endpointNumber, dataBuffer);
            console.log(`[INFO] Dados enviados com sucesso. Bytes enviados: ${result.bytesWritten}`);
        } catch (error) {
            console.error('Erro ao enviar dados para o dispositivo USB:', error);
            alert(`Erro ao enviar dados: ${error.message}`);
        }
    }

    // === Lógica do Botão para Rodar o Código ===
    const runCodeButton = document.getElementById('runCodeButton');
    runCodeButton.addEventListener('click', () => {
        const code = Blockly.JavaScript.workspaceToCode(workspace);
        if (code) {
            sendUsbData(code);
        } else {
            alert('Nenhum bloco no workspace para rodar.');
        }
    });
});