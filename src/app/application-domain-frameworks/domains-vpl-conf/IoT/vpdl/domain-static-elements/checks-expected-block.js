import * as Blockly from "blockly";

export const ChecksExpectedValuesBlocks = [
  {
    name: "warns_checks",
    blockDef: () => ({
      init: function () {
        this.appendValueInput("CONDITION")
          .setCheck([
            "relational_operators",
            "logical_operators",
            "changes",
            "Boolean",
          ])
          .appendField("Warn me in case of");
        this.appendDummyInput()
          .appendField("warning message:")
          .appendField(
            new Blockly.FieldTextInput("default"),
            "WARNING_MESSAGE"
          );
        this.setInputsInline(false);
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

      // (function () {
      //   if (value_condition) {
      //     RenderWarningForExpectedValueCheck(
      //       titleForExpectedValueTest,
      //       idForExpectedValueTest,
      //       text_warning_message
      //     );
      //   }
      // })();

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "if (" + value_condition + ") {";
      strBuilder += "RenderWarningForExpectedValueCheck(";
      strBuilder += "titleForExpectedValueTest,";
      strBuilder += "idForExpectedValueTest,";
      strBuilder += JSON.stringify(text_warning_message);
      strBuilder += ");";
      strBuilder += "}";
      strBuilder += "})();";

      return strBuilder;
    },
  },
  {
    name: "pause_checks",
    blockDef: () => ({
      init: function () {
        this.appendValueInput("CONDITION")
          .setCheck([
            "relational_operators",
            "logical_operators",
            "changes",
            "Boolean",
          ])
          .appendField("Pause running automations in case of");
        this.setInputsInline(true);
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

      // return value_condition

      let strBuilder = "";
      strBuilder += value_condition;

      return strBuilder;
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
