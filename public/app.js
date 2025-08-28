document.addEventListener('DOMContentLoaded', () => {
    const updateButton = document.getElementById('updateButton');
    const messageElement = document.getElementById('message');

    updateButton.addEventListener('click', () => {
        const timestamp = new Date().toLocaleTimeString();
        messageElement.textContent = `Mensagem atualizada às: ${timestamp}`;
    });
});
