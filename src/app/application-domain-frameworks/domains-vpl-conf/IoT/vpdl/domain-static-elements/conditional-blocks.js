import * as Blockly from "blockly";

export const ConditionalStaticBlocks = [
  {
    name: "conditional_when",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("When");
        this.appendValueInput("condition").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          //   "getter_boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("statements").setCheck(null);
        this.setInputsInline(true);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_condition = Blockly.JavaScript.valueToCode(
          block,
          "condition",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "statements"
        );
        // TODO: Assemble JavaScript into code variable.
        var code = "...;\n";
        return code;
      },
  },
  {
    name: "conditional_when_top_bottom",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("When");
        this.appendValueInput("condition").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          //   "getter_boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("statements").setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_condition = Blockly.JavaScript.valueToCode(
          block,
          "condition",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "statements"
        );
        // TODO: Assemble JavaScript into code variable.
        var code = "...;\n";
        return code;
      },
  },
  {
    name: "logical_operators",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendValueInput("LEFT").setCheck([
          "relational_operators",
          "logical_operators",
        ]);
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["and", "AND"],
            ["or", "OR"],
          ]),
          "OPERATORS"
        );
        this.appendValueInput("RIGHT").setCheck([
          "relational_operators",
          "logical_operators",
          //   "getter_boolean",
        ]);
        this.setInputsInline(true);
        this.setOutput(true, "logical_operators");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_left = Blockly.JavaScript.valueToCode(
          block,
          "LEFT",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        var dropdown_operators = block.getFieldValue("OPERATORS");
        var value_right = Blockly.JavaScript.valueToCode(
          block,
          "RIGHT",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "relational_operators",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendValueInput("left_value").setCheck([
          "getter",
          "getter_boolean",
        ]);
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["=", "EQUAL"],
            ["≠", "NOTEQUAL"],
            [">", "GREATER"],
            ["<", "LESS"],
            ["≥", "GREATERTHAN"],
            ["≤", "LESSTHAN"],
          ]),
          "OPERATORS"
        );
        this.appendValueInput("right_value").setCheck([
          "String",
          "Boolean",
          "Number",
          "getter",
          "getter_boolean",
        ]);
        this.setInputsInline(true);
        this.setOutput(true, "relational_operators");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_left_value = Blockly.JavaScript.valueToCode(
          block,
          "left_value",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        var dropdown_operators = block.getFieldValue("OPERATORS");
        var value_right_value = Blockly.JavaScript.valueToCode(
          block,
          "right_value",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "changes",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendValueInput("NAME").setCheck(["getter", "getter_boolean"]);
        this.appendDummyInput().appendField("changes");
        this.setInputsInline(true);
        this.setOutput(true, "changes");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_name = Blockly.JavaScript.valueToCode(
          block,
          "NAME",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
];
