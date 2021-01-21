import * as Blockly from "blockly";

export const ChecksExpectedValuesBlocks = [
  {
    name: "warns_checks",
    blockDef: () => ({
      init: function () {
        this.appendValueInput("CONDITION")
          .setCheck(null)
          .appendField("Warns me if");
        this.appendDummyInput()
          .appendField(",warning message:")
          .appendField(
            new Blockly.FieldTextInput("default"),
            "WARNING_MESSAGE"
          );
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var value_condition = Blockly.JavaScript.valueToCode(
        block,
        "CONDITION",
        Blockly.JavaScript.ORDER_ATOMIC
      );
      var text_warning_message = block.getFieldValue("WARNING_MESSAGE");
      // TODO: Assemble JavaScript into code variable.
      var code = "...;\n";
      return code;
    },
    debugGen: (block) => {
      var value_condition = Blockly.JavaScript.valueToCode(
        block,
        "CONDITION",
        Blockly.JavaScript.ORDER_ATOMIC
      );
      var text_warning_message = block.getFieldValue("WARNING_MESSAGE");
      // TODO: Assemble JavaScript into code variable.
      var code = "...;\n";
      return code;
    },
  },
  {
    name: "pause_checks",
    blockDef: () => ({
      init: function () {
        this.appendValueInput("CONDITION")
          .setCheck(null)
          .appendField("Pause running automations if");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var value_condition = Blockly.JavaScript.valueToCode(
        block,
        "CONDITION",
        Blockly.JavaScript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "...;\n";
      return code;
    },
    debugGen: (block) => {
      var value_condition = Blockly.JavaScript.valueToCode(
        block,
        "CONDITION",
        Blockly.JavaScript.ORDER_ATOMIC
      );
      // TODO: Assemble JavaScript into code variable.
      var code = "...;\n";
      return code;
    },
  },
];
