import * as Blockly from "blockly";

let whenCondCounter = 1;
let changesIDCounter = 1;

const CreateWhenID = function () {
  return whenCondCounter++;
};

const CreateChangesID = function () {
  return changesIDCounter++;
};

/**
 * Is the given block enclosed (at any level) by an every block?
 * @param {!Blockly.BlockSVG} block Current block.
 * @return {Blockly.BlockSVG} The nearest surrounding loop, or null if none.
 */

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

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   func: () => {
        //     if (value_condition) {
        //       let removedindex = whenCondData.findIndex(
        //         (x) => x.key === whenCondID
        //       );
        //       whenCondData.splice(removedindex, 1);
        //       statements_statements;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "func: async () => {";
        strBuilder += "if (" + value_condition + ") {";
        strBuilder += "let removedindex = whenCondData.findIndex(";
        strBuilder += "(x) => x.key === " + whenCondID + "";
        strBuilder += ");";
        strBuilder += "whenCondData.splice(removedindex, 1);";
        strBuilder += statements_statements;
        strBuilder += "}";
        strBuilder += "},";
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

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   func: () => {
        //     if (value_condition) {
        //       let removedindex = whenCondData.findIndex(
        //         (x) => x.key === whenCondID
        //       );
        //       whenCondData.splice(removedindex, 1);
        //       statements_statements;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "func: async () => {";
        strBuilder += "if (" + value_condition + ") {";
        strBuilder += "let removedindex = whenCondData.findIndex(";
        strBuilder += "(x) => x.key === " + whenCondID + "";
        strBuilder += ");";
        strBuilder += "whenCondData.splice(removedindex, 1);";
        strBuilder += statements_statements;
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "when_times",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField("For")
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "TIMES")
          .appendField("times(s):")
          .appendField("When");
        this.appendValueInput("CONDITION").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          "Boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENTS").setCheck(null);
        this.setInputsInline(true);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_times = block.getFieldValue("TIMES");

        var value_condition = Blockly.JavaScript.valueToCode(
          block,
          "CONDITION",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENTS"
        );

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   triggerFlag: false,
        //   totalTimes: number_times,
        //   triggerTimes: 0,
        //   func: () => {
        //     let index = whenCondData.findIndex((x) => x.key === whenCondID);
        //     if (value_condition && !whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = true;
        //       whenCondData[index].triggerTimes++;
        //       if (
        //         whenCondData[index].triggerTimes ===
        //         whenCondData[index].totalTimes
        //       ) {
        //         whenCondData.splice(index, 1);
        //       }
        //       statements_statements;
        //     } else if (!value_condition && whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = false;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "triggerFlag: false,";
        strBuilder += "totalTimes: " + number_times + ",";
        strBuilder += "triggerTimes: 0,";
        strBuilder += "func: async () => {";
        strBuilder +=
          "let index = whenCondData.findIndex((x) => x.key === " +
          whenCondID +
          ");";
        strBuilder +=
          "if (" + value_condition + " && !whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = true;";
        strBuilder += "whenCondData[index].triggerTimes++;";
        strBuilder += "if (";
        strBuilder += "whenCondData[index].triggerTimes ===";
        strBuilder += "whenCondData[index].totalTimes";
        strBuilder += ") {";
        strBuilder += "whenCondData.splice(index, 1);";
        strBuilder += "}";
        strBuilder += statements_statements;
        strBuilder +=
          "} else if (!" +
          value_condition +
          " && whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = false;";
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "when_times_top_bottom",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField("For")
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "TIMES")
          .appendField("times(s):")
          .appendField("When");
        this.appendValueInput("CONDITION").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          "Boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENTS").setCheck(null);
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
        var number_times = block.getFieldValue("TIMES");

        var value_condition = Blockly.JavaScript.valueToCode(
          block,
          "CONDITION",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENTS"
        );

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   triggerFlag: false,
        //   totalTimes: number_times,
        //   triggerTimes: 0,
        //   func: () => {
        //     let index = whenCondData.findIndex((x) => x.key === whenCondID);
        //     if (value_condition && !whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = true;
        //       whenCondData[index].triggerTimes++;
        //       if (
        //         whenCondData[index].triggerTimes ===
        //         whenCondData[index].totalTimes
        //       ) {
        //         whenCondData.splice(index, 1);
        //       }
        //       statements_statements;
        //     } else if (!value_condition && whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = false;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "triggerFlag: false,";
        strBuilder += "totalTimes: " + number_times + ",";
        strBuilder += "triggerTimes: 0,";
        strBuilder += "func: async () => {";
        strBuilder +=
          "let index = whenCondData.findIndex((x) => x.key === " +
          whenCondID +
          ");";
        strBuilder +=
          "if (" + value_condition + " && !whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = true;";
        strBuilder += "whenCondData[index].triggerTimes++;";
        strBuilder += "if (";
        strBuilder += "whenCondData[index].triggerTimes ===";
        strBuilder += "whenCondData[index].totalTimes";
        strBuilder += ") {";
        strBuilder += "whenCondData.splice(index, 1);";
        strBuilder += "}";
        strBuilder += statements_statements;
        strBuilder +=
          "} else if (!" +
          value_condition +
          " && whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = false;";
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "when_after",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField("After")
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "TIMES")
          .appendField("times(s)")
          .appendField("that");
        this.appendValueInput("CONDITION").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          "Boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENTS").setCheck(null);
        this.setInputsInline(true);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_times = block.getFieldValue("TIMES");

        var value_condition = Blockly.JavaScript.valueToCode(
          block,
          "CONDITION",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENTS"
        );

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   triggerFlag: false,
        //   afterTimes: number_times,
        //   triggerTimes: 0,
        //   func: () => {
        //     let index = whenCondData.findIndex((x) => x.key === whenCondID);
        //     if (value_condition && !whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = true;
        //       whenCondData[index].triggerTimes++;
        //       if (
        //         whenCondData[index].triggerTimes ===
        //         whenCondData[index].afterTimes
        //       ) {
        //         whenCondData.splice(index, 1);
        //         statements_statements;
        //       }
        //     } else if (!value_condition && whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = false;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "triggerFlag: false,";
        strBuilder += "afterTimes: " + number_times + ",";
        strBuilder += "triggerTimes: 0,";
        strBuilder += "func: async () => {";
        strBuilder +=
          "let index = whenCondData.findIndex((x) => x.key === " +
          whenCondID +
          ");";
        strBuilder +=
          "if (" + value_condition + " && !whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = true;";
        strBuilder += "whenCondData[index].triggerTimes++;";
        strBuilder += "if (";
        strBuilder += "whenCondData[index].triggerTimes ===";
        strBuilder += "whenCondData[index].afterTimes";
        strBuilder += ") {";
        strBuilder += "whenCondData.splice(index, 1);";
        strBuilder += statements_statements;
        strBuilder += "}";
        strBuilder +=
          "} else if (!" +
          value_condition +
          " && whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = false;";
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "when_after_top_bottom",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField("After")
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "TIMES")
          .appendField("times(s)")
          .appendField("that");
        this.appendValueInput("CONDITION").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          "Boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENTS").setCheck(null);
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
        var number_times = block.getFieldValue("TIMES");

        var value_condition = Blockly.JavaScript.valueToCode(
          block,
          "CONDITION",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENTS"
        );

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   triggerFlag: false,
        //   afterTimes: number_times,
        //   triggerTimes: 0,
        //   func: () => {
        //     let index = whenCondData.findIndex((x) => x.key === whenCondID);
        //     if (value_condition && !whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = true;
        //       whenCondData[index].triggerTimes++;
        //       if (
        //         whenCondData[index].triggerTimes ===
        //         whenCondData[index].afterTimes
        //       ) {
        //         whenCondData.splice(index, 1);
        //         statements_statements;
        //       }
        //     } else if (!value_condition && whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = false;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "triggerFlag: false,";
        strBuilder += "afterTimes: " + number_times + ",";
        strBuilder += "triggerTimes: 0,";
        strBuilder += "func: async () => {";
        strBuilder +=
          "let index = whenCondData.findIndex((x) => x.key === " +
          whenCondID +
          ");";
        strBuilder +=
          "if (" + value_condition + " && !whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = true;";
        strBuilder += "whenCondData[index].triggerTimes++;";
        strBuilder += "if (";
        strBuilder += "whenCondData[index].triggerTimes ===";
        strBuilder += "whenCondData[index].afterTimes";
        strBuilder += ") {";
        strBuilder += "whenCondData.splice(index, 1);";
        strBuilder += statements_statements;
        strBuilder += "}";
        strBuilder +=
          "} else if (!" +
          value_condition +
          " && whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = false;";
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "when_forever",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("Forever:").appendField("When");
        this.appendValueInput("CONDITION").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          "Boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENTS").setCheck(null);
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
          "CONDITION",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENTS"
        );

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   triggerFlag: false,
        //   func: () => {
        //     let index = whenCondData.findIndex((x) => x.key === whenCondID);
        //     if (value_condition && !whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = true;
        //       statements_statements;
        //     } else if (!value_condition && whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = false;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "triggerFlag: false,";
        strBuilder += "func: async () => {";
        strBuilder +=
          "let index = whenCondData.findIndex((x) => x.key === " +
          whenCondID +
          ");";
        strBuilder +=
          "if (" + value_condition + " && !whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = true;";
        strBuilder += statements_statements;
        strBuilder +=
          "} else if (!" +
          value_condition +
          " && whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = false;";
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "when_forever_top_bottom",
    uniqueInstance: true,
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("Forever:").appendField("When");
        this.appendValueInput("CONDITION").setCheck([
          "relational_operators",
          "logical_operators",
          "changes",
          "Boolean",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENTS").setCheck(null);
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
          "CONDITION",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statements = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENTS"
        );

        let whenCondID = CreateWhenID();

        // whenCondData.push({
        //   key: whenCondID,
        //   triggerFlag: false,
        //   func: () => {
        //     let index = whenCondData.findIndex((x) => x.key === whenCondID);
        //     if (value_condition && !whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = true;
        //       statements_statements;
        //     } else if (!value_condition && whenCondData[index].triggerFlag) {
        //       whenCondData[index].triggerFlag = false;
        //     }
        //   },
        // });

        let strBuilder = "";
        strBuilder += "whenCondData.push({";
        strBuilder += "key: " + whenCondID + ",";
        strBuilder += "triggerFlag: false,";
        strBuilder += "func: async () => {";
        strBuilder +=
          "let index = whenCondData.findIndex((x) => x.key === " +
          whenCondID +
          ");";
        strBuilder +=
          "if (" + value_condition + " && !whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = true;";
        strBuilder += statements_statements;
        strBuilder +=
          "} else if (!" +
          value_condition +
          " && whenCondData[index].triggerFlag) {";
        strBuilder += "whenCondData[index].triggerFlag = false;";
        strBuilder += "}";
        strBuilder += "},";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "break_continue_when",
    uniqueInstance: true,
    blockDef: () => ({
      isSurroundWhen: function () {
        // Is the block nested in a loop?
        let blockP = this.getParent();
        while (blockP) {
          if (
            blockP.type === "conditional_when" ||
            blockP.type === "conditional_when_top_bottom" ||
            blockP.type === "when_times" ||
            blockP.type === "when_times_top_bottom" ||
            blockP.type === "when_after" ||
            blockP.type === "when_after_top_bottom" ||
            blockP.type === "when_forever" ||
            blockP.type === "when_forever_top_bottom"
          ) {
            return true;
          }
          blockP = blockP.getParent();
        }
        return false;
      },
      updateImage: function (newValue) {
        let image;
        if (newValue === "break") {
          image = new Blockly.FieldImage(
            "https://img.icons8.com/office/2x/down2.png",
            20,
            20,
            { alt: "*", flipRtl: "FALSE" }
          );
        } else if (newValue === "continue") {
          image = new Blockly.FieldImage(
            "https://img.icons8.com/office/2x/up3.png",
            20,
            20,
            { alt: "*", flipRtl: "FALSE" }
          );
        }
        // let imgField = this.getField("IMAGE");
        let input = this.getInput("IMAGE-OUTTER");
        input.removeField("IMAGE");
        input.appendField(image, "IMAGE");
      },
      validate: function (newValue) {
        this.getSourceBlock().updateImage(newValue);
        return newValue;
      },
      init: function () {
        this.appendDummyInput("IMAGE-OUTTER").appendField(
          new Blockly.FieldImage(
            "https://img.icons8.com/office/2x/down2.png",
            20,
            20,
            { alt: "*", flipRtl: "FALSE" }
          ),
          "IMAGE"
        );
        this.appendDummyInput()
          .appendField(
            new Blockly.FieldDropdown(
              [
                ["break", "break"],
                ["continue", "continue"],
              ],
              this.validate
            ),
            "ACTION"
          )
          .appendField("of  When / After");
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
        var dropdown_action = block.getFieldValue("ACTION");

        // TODO: Assemble JavaScript into code variable.
        var code = "throw '" + dropdown_action + "'";
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

        var code = "false";
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
        var code = "false";
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
        this.appendValueInput("VALUE").setCheck([
          "Boolean",
          "Number",
          "String",
        ]);
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
        var value_value = Blockly.JavaScript.valueToCode(
          block,
          "VALUE",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        let changesID = CreateWhenID();

        // (function () {
        //   let index = changesData.findIndex((data) => {
        //     data.key === changesID;
        //   });
        //   if (index === -1) {
        //     changesData.push({ key: changesID, value: value_value });
        //   } else {
        //     if (changesData[index].value !== value_value) {
        //       changesData[index].value = value_value;
        //       return true;
        //     }
        //     return false;
        //   }
        // })()

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let index = changesData.findIndex((data) => {";
        strBuilder += "data.key === " + changesID + ";";
        strBuilder += "});";
        strBuilder += "if (index === -1) {";
        strBuilder +=
          "changesData.push({ key: " +
          changesID +
          ", value: " +
          value_value +
          " });";
        strBuilder += "} else {";
        strBuilder += "if (changesData[index].value !== " + value_value + ") {";
        strBuilder += "changesData[index].value = " + value_value + ";";
        strBuilder += "return true;";
        strBuilder += "}";
        strBuilder += "return false;";
        strBuilder += "}";
        strBuilder += "})()";

        var code = strBuilder + "\n";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
];
