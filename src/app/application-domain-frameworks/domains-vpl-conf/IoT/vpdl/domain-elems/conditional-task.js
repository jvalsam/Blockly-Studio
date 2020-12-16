import * as Blockly from "blockly";

export const ConditionalTask = {
  name: "ec-blockly-conditional-event",
  blocklyElems: [
    {
      name: "invoke_conditional_task",
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
            .appendField("Invoke Conditional:")
            .appendField(
              new Blockly.FieldImage(data.img, 20, 20, {
                alt: "*",
                flipRtl: "FALSE",
              })
            )
            .appendField(data.title);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(300);
          this.setTooltip("");
          this.setHelpUrl("");
          this.pitemData = data;
        },
      }),
      codeGen: (block) => {
        var code =
          "runTimeData.execData.project.ConditionalEvents.find(e => e.id === " +
          JSON.stringify(block.pitemData.pitemId) +
          ").editorsData[0].generated";
        return code;
      },
    },
  ],
  signals: [
    {
      action: "onCreate",
      name: "create-pi-blockly-conditional-event",
      mission: "ec-blockly-conditional-event",
      provider: "BlocklyVPL",
    },
    {
      action: "onDelete",
      name: "delete-pi-blockly-conditional-event",
      mission: "ec-blockly-conditional-event",
      provider: "BlocklyVPL",
    },
    {
      action: "onEdit",
      name: "rename-pi-blockly-conditional-event",
      mission: "ec-blockly-conditional-event",
      provider: "BlocklyVPL",
    },
  ],
};
