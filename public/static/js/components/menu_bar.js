function salvarProjeto() {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const xmlText = Blockly.Xml.domToPrettyText(xml);
  const blob = new Blob([xmlText], { type: "text/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "projeto_zoy.xml";
  a.click();
}

function carregarProjeto() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xml";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const xml = Blockly.Xml.textToDom(e.target.result);
      Blockly.Xml.domToWorkspace(xml, workspace);
    };
    reader.readAsText(file);
  };
  input.click();
}
