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
          "Boolean",
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

        // WhenCondData.push(() => {
        //   if (value_condition) {
        //     statements_statements;
        //   }
        // });

        let strBuilder = "";
        strBuilder += "WhenCondData.push(() => {";
        strBuilder += "if (" + value_condition + ") {";
        strBuilder += statements_statements;
        strBuilder += "}";
        strBuilder += "});";

        var code = strBuilder + "\n";
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
          "Boolean",
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

        // WhenCondData.push(() => {
        //   if (value_condition) {
        //     statements_statements;
        //   }
        // });

        let strBuilder = "";
        strBuilder += "WhenCondData.push(() => {";
        strBuilder += "if (" + value_condition + ") {";
        strBuilder += statements_statements;
        strBuilder += "}";
        strBuilder += "});";

        var code = strBuilder + "\n";
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
          "Boolean",
        ]);
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["and", "&&"],
            ["or", "||"],
          ]),
          "OPERATORS"
        );
        this.appendValueInput("RIGHT").setCheck([
          "relational_operators",
          "logical_operators",
          "Boolean",
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

        var code = "";
        // TODO: I don't know if it needs check
        if (value_left && value_right)
          code = "(" + value_left + dropdown_operators + value_right + ")";

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
          "String",
          "Boolean",
          "Number",
        ]);
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["=", "==="],
            ["≠", "!=="],
            [">", ">"],
            ["<", "<"],
            ["≥", ">="],
            ["≤", "<="],
          ]),
          "OPERATORS"
        );
        this.appendValueInput("right_value").setCheck([
          "String",
          "Boolean",
          "Number",
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
        var code = "";
        if (value_left_value && value_right_value)
          code = value_left_value + dropdown_operators + value_right_value;

        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "changes",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendValueInput("NAME").setCheck(["String", "Boolean", "Number"]);
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
