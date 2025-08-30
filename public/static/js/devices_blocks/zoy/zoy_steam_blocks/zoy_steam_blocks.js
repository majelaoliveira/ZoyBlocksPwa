import { motores, categoriaMotores } from "./cates/motores.js";
import { luz, categoriaLuz } from "./cates/luz.js";
import {
  motoresAvancados,
  categoriaMotoresAvancados,
} from "./cates/motoresAvancados.js";
import { sensores, categoriaSensores } from "./cates/sensores.js";
import { pinosLivres, categoriaPinosLivres } from "./cates/pinosLivres.js";
import { botao, categoriaBotao } from "./cates/botao.js";
import { eventos, categoriaEventos } from './cates/evento.js';
import { som, categoriaSom } from "./cates/som.js";
import { servo, categoriaServo } from "./cates/servo.js";
//import { infravermelho, categoriaInfravermelho } from "./cates/infravermelho.js";
//import { comunicacaoInfra, categoriaComunicacaoInfra } from "./cates/comunicacaoInfra.js"; 




const zoySteamBlocks = () => {
  eventos();              //inicializa o bloco de eventos
  luz(); // inicializa os blocos dos leds
  motores(); // inicializa os blocos motores
  motoresAvancados(); // inicializa os blocos dos leds
  sensores(); // inicializa o bloco de sensores
  pinosLivres(); //inicializa o bloco dos pinos livre
  botao(); //inicializa o bloco dos botões
  som(); // inicializa o bloco de som
  servo(); // inicializa o bloco de servo motor
//  infravermelho(); // inicializa o bloco de infravermelho
//  comunicacaoInfra(); // inicializa o bloco de comunicação infravermelho

};

const toolboxZoySteam = {
  kind: "categoryToolbox",
  contents: [
    categoriaEventos,
    categoriaLuz,
    categoriaMotores,
    categoriaMotoresAvancados,
    categoriaSensores,
    categoriaBotao,
    categoriaPinosLivres,
    categoriaSom,
    categoriaServo,
   // categoriaInfravermelho,
    //categoriaComunicacaoInfra,
    // Display
  ],
};

export { zoySteamBlocks, toolboxZoySteam };
