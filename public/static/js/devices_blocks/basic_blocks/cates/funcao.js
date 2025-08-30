const funcao = () => {
  // Blockly.defineBlocksWithJsonArray([
  //   {
  //     // Local para criar blocos personalizados
  //     // "type": "blocoPersonalizado",
  //   },
  // ]);

  // Geração de código Python
  //   Blockly.Python['blocoPersonalizado'] = () =>
  //     'função()\n';
};

const categoriaFuncao = {
  kind: "category",
  name: "Funções",
  custom: "PROCEDURE",
  colour: "290",
};

// Exporta os blocos de funções e sua categoria toolbox como módulo duplo
export { funcao, categoriaFuncao };
