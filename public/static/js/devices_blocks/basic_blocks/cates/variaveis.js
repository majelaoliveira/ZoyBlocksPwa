const variaveis = () => {
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

const categoriaVariaveis = {
  kind: "category",
  name: "Variáveis",
  custom: "VARIABLE",
  colour: "330",
};

// Exporta os blocos de variaveis e sua categoria toolbox como módulo duplo
export { variaveis, categoriaVariaveis };
