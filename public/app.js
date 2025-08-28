document.addEventListener('DOMContentLoaded', () => {
    // Lógica do botão "Atualizar Mensagem"
    const updateButton = document.getElementById('updateButton');
    const messageElement = document.getElementById('message');

    updateButton.addEventListener('click', () => {
        const timestamp = new Date().toLocaleTimeString();
        messageElement.textContent = `Mensagem atualizada às: ${timestamp}`;
    });

    // Initialize Blockly
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: '<xml id="toolbox" style="display: none;">' +
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
});