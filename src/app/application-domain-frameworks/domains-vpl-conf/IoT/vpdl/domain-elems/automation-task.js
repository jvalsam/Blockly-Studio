import * as Blockly from "blockly";

export const AutomationTask = {
  name: "ec-automation-task",
  blocklyElems: [
    {
      name: "invoke_task",
      blockDef: (data) => ({
        init: function () {
          this.appendDummyInput()
            .appendField(
              new Blockly.FieldImage(
                "https://img.icons8.com/plasticine/2x/play.png",
                20,
                20,
                { alt: "*", flipRtl: "FALSE" }
              )
            )
            .appendField("Invoke:")
            .appendField(
              new Blockly.FieldImage(data.img, 20, 20, {
                alt: "*",
                flipRtl: "FALSE",
              })
            )
            .appendField(data.title);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(230);
          this.setTooltip("");
          this.setHelpUrl("");
          this.pitemData = data;
        },
      }),
      codeGen: (block) => {
        var code =
          "runTimeData.execData.project.AutomationTasks.find(e => e.id === '" +
          block.pitemData.pitemId +
          "').editorsData[0].generated";
        return code;
      },
    },
  ],
  signals: [
    {
      action: "onCreate",
      name: "create-pi-blockly-automation-task",
      mission: "ec-automation-task",
      provider: "BlocklyVPL",
    },
    {
      action: "onDelete",
      name: "delete-pi-blockly-automation-task",
      mission: "ec-automation-task",
      provider: "BlocklyVPL",
    },
    {
      action: "onEdit",
      name: "rename-pi-blockly-automation-task",
      mission: "ec-automation-task",
      provider: "BlocklyVPL",
    },
  ],
};
