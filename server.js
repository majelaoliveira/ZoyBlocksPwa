const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 1. Rota EXPLÍCITA para o arquivo principal (index.html)
// ESSA ROTA FORÇA O SERVIDOR A ESTABILIZAR NA RAIZ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Rota EXPLÍCITA para o novo jogo (zoy_jogos.html)
app.get('/zoy_jogos.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'zoy_jogos.html'));
});

// 3. Serve todos os outros recursos estáticos (CSS, JS, Imagens, etc.)
// A pasta 'public' é o ponto de partida, e a subpasta 'static' é acessada diretamente.
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
  console.log(`Servidor PWA rodando em http://localhost:${port}`);
});