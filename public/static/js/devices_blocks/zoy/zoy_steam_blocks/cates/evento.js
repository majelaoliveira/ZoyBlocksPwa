// Defini a cor da categoria e blocos
const COR_BLOCOS = "#A55B80";

const eventos = () => {
  Blockly.defineBlocksWithJsonArray([
    {
        "type": "iniciar_zoy_steam",
        "message0": "Iniciar Zoy STEAM",
        "args0": [],
        "nextStatement": null,
        "tooltip": "Bloco de início do programa ZOY STEAM",
        "helpUrl": "",
        "style": "hat_blocks",   // (alternativo, se você usa theme)
        "hat": "true" // ESSENCIAL para evento
    }
  ]);

  // Geração de código Python
  Blockly.Python["iniciar_zoy_steam"] = () =>
    `iniciar_zoy( "ZOY", "ZOY")\n`;
  
};

const categoriaEventos = {
  kind: "category",
  name: "Iniciar Zoy STEAM",
  colour: COR_BLOCOS,
  contents: [
    { kind: "block", type: "iniciar_zoy_steam" }
  ],
};

// Exporta os blocos de eventos e sua categoria toolbox como módulo duplo
export { eventos, categoriaEventos };