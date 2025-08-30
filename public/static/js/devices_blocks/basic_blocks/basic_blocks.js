import { controle, categoriaControle } from './cates/controle.js';
import { logica, categoriaLogica } from './cates/logica.js';
import { matematica, categoriaMatematica } from './cates/matematica.js';
import { texto, categoriaTexto } from './cates/texto.js';
// import { serial, categoriaSerial } from './cates/serial.js';
import { funcao, categoriaFuncao } from './cates/funcao.js';
import { variaveis, categoriaVariaveis } from './cates/variaveis.js';

const basicBlocks = () => {
  controle(); // inicializa os blocos de controle
  logica(); // inicializa os blocos de logica
  matematica(); // inicializa os blocos de matematica
  texto(); // inicializa os blocos de texto
  // serial(); // inicializa os blocos de serial
  funcao(); // inicializa os blocos de funções
  variaveis(); // inicializa os blocos de variáveis
};

const separador = {
  kind: "category",
  name: "_______________", 
  colour: "#dddddd",      // Cor neutra
  contents: []
};

const toolboxbasicBlocks = {
  kind: "categoryToolbox",
  contents: [
    separador,
    categoriaControle,
    categoriaLogica,
    categoriaMatematica,
    categoriaTexto,
    // categoriaSerial,
    categoriaFuncao,
    categoriaVariaveis
  ]
};

export { basicBlocks, toolboxbasicBlocks };
