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
            .appendField("Start Conditional:")
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
        // Build eval for the main eval in run-app.js
        var code =
          'eval( "(async () => { let projectElementId = " + JSON.stringify(' +
          JSON.stringify(block.pitemData.pitemId) +
          ") + runTimeData.execData.project.ConditionalEvents.find(e => e.id === " +
          JSON.stringify(block.pitemData.pitemId) +
          ').editorsData[0].generated + "})()" );';
        return code;
      },
      debugGen: (block) => {
        // Build eval for the main eval in run-app.js
        var code =
          'eval( "(async () => { let projectElementId = " + JSON.stringify(' 
          +JSON.stringify(block.pitemData.pitemId) +
          "+ ';') + 'let debuggerScopeId = ' + JSON.stringify(" 
          + JSON.stringify("debugger_" + block.pitemData.pitemId) 
          + " + ';') + runTimeData.execData.project.ConditionalEvents.find(e => e.id === " +
          JSON.stringify(block.pitemData.pitemId) +
          ').editorsData[0].generated.src + variablesWatches_code + "})()" );';
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
