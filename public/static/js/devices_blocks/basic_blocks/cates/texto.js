const texto = () => {
  // Blockly.defineBlocksWithJsonArray([

  // ]);

  // Geração de código Python

};

const categoriaTexto = {
  kind: "category",
  name: "Texto",
  colour: "160",
  contents: [
    { kind: "block", type: "text" },
    { kind: "block", type: "text_join" },
  ],
};

// Exporta os blocos de textos e sua categoria toolbox como módulo duplo
export { texto, categoriaTexto };


// modo 2 geradores:
// Define e registra blocos da categoria Texto
// const texto = () => {
//   // Geração de código para Arduino
//   Blockly.Arduino['text'] = function (block) {
//     const code = Blockly.Arduino.quote_(block.getFieldValue('TEXT'));
//     return [code, Blockly.Arduino.ORDER_ATOMIC];
//   };

//   Blockly.Arduino['text_join'] = function (block) {
//     const itemCount = block.itemCount_;
//     let code = '';
//     if (itemCount === 0) {
//       code = '""';
//     } else {
//       const elements = [];
//       for (let i = 0; i < itemCount; i++) {
//         const element = Blockly.Arduino.valueToCode(block, 'ADD' + i, Blockly.Arduino.ORDER_NONE) || '""';
//         elements.push(element);
//       }
//       code = elements.join(' + ');
//     }
//     return [code, Blockly.Arduino.ORDER_ADDITION];
//   };

//   Blockly.Arduino['text_length'] = function (block) {
//     const text = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_FUNCTION_CALL) || '""';
//     return [`String(${text}).length()`, Blockly.Arduino.ORDER_FUNCTION_CALL];
//   };

//   Blockly.Arduino['text_print'] = function (block) {
//     const msg = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_NONE) || '""';
//     return `Serial.println(${msg});\n`;
//   };

//   // Python: não é necessário implementar — já existe no python_compressed.js
// };

// // Categoria "Texto" para a toolbox
// const categoriaTexto = {
//   kind: "category",
//   name: "Texto",
//   colour: "160",
//   contents: [
//     { kind: "block", type: "text" },
//     { kind: "block", type: "text_join" },
//     { kind: "block", type: "text_length" },
//     { kind: "block", type: "text_print" },
//   ],
// };

// // Exporta os blocos e a categoria
// export { texto, categoriaTexto };
