import * as Blockly from "blockly";

export const CalendarStaticBlocks = [
  {
    name: "calendar_at",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("At");
        this.appendValueInput("TIME").setCheck([
          "specific_hour",
          "specific_day",
          "specific_month",
        ]);
        this.appendDummyInput().appendField("do");
        this.appendStatementInput("STATEMENT").setCheck(null);
        this.setInputsInline(true);
        this.setColour(195);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_time = Blockly.JavaScript.valueToCode(
          block,
          "TIME",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statement = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENT"
        );

        let strBuilder = "";
        strBuilder += "setTimeout(function () {";
        strBuilder += "alert('hi');";
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          ")));";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "calendar_at_top_bottom",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("At");
        this.appendValueInput("TIME").setCheck([
          "specific_hour",
          "specific_day",
          "specific_month",
        ]);
        this.appendDummyInput().appendField("do");
        this.appendStatementInput("STATEMENT").setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(195);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_time = Blockly.JavaScript.valueToCode(
          block,
          "TIME",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statement = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENT"
        );

        let strBuilder = "";
        strBuilder += "setTimeout(function () {";
        strBuilder += "alert('hi');";
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          ")));";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "calendar_every",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("Every");
        this.appendValueInput("TIME").setCheck([
          "specific_day",
          "specific_month",
          "every_seconds",
          "every_minutes",
          "every_hours",
          "every_days",
          "every_months",
        ]);
        this.appendDummyInput().appendField("do");
        this.appendStatementInput("STATEMENT").setCheck(null);
        this.setInputsInline(true);
        this.setColour(290);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_time = Blockly.JavaScript.valueToCode(
          block,
          "TIME",
          Blockly.JavaScript.ORDER_ATOMIC
        );
        var statements_statement = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENT"
        );

        // (function () {
        //   let index = arrayIntervals.length;
        //   let f = () => {
        //     setTimeout(() => {
        //       alert("hi");
        //       arrayIntervals[index]();
        //     }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time)));
        //   };
        //   arrayIntervals.push(f);
        //   arrayIntervals[index]();
        // })();

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let index = arrayIntervals.length;";
        strBuilder += "let f = () => {";
        strBuilder += "setTimeout(() => {";
        strBuilder += 'alert("hi");';
        strBuilder += statements_statement;
        strBuilder += "arrayIntervals[index]();";
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          ")));";
        strBuilder += "};";
        strBuilder += "arrayIntervals.push(f);";
        strBuilder += "arrayIntervals[index]();";
        strBuilder += "})();";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "calendar_every_top_bottom",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("Every");
        this.appendValueInput("TIME").setCheck([
          "specific_day",
          "specific_month",
          "every_seconds",
          "every_minutes",
          "every_hours",
          "every_days",
          "every_months",
        ]);
        this.appendDummyInput().appendField("do");
        this.appendStatementInput("STATEMENT").setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_time = Blockly.JavaScript.valueToCode(
          block,
          "TIME",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statement = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENT"
        );

        // (function () {
        //   let index = arrayIntervals.length;
        //   let f = () => {
        //     setTimeout(() => {
        //       alert("hi");
        //       arrayIntervals[index]();
        //     }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time)));
        //   };
        //   arrayIntervals.push(f);
        //   arrayIntervals[index]();
        // })();

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let index = arrayIntervals.length;";
        strBuilder += "let f = () => {";
        strBuilder += "setTimeout(() => {";
        strBuilder += 'alert("hi");';
        strBuilder += statements_statement;
        strBuilder += "arrayIntervals[index]();";
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          ")));";
        strBuilder += "};";
        strBuilder += "arrayIntervals.push(f);";
        strBuilder += "arrayIntervals[index]();";
        strBuilder += "})();";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "calendar_wait_then",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("Wait");
        this.appendValueInput("TIME").setCheck([
          "every_seconds",
          "every_minutes",
          "every_hours",
          "every_days",
          "every_months",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENT").setCheck(null);
        this.setInputsInline(true);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_time = Blockly.JavaScript.valueToCode(
          block,
          "TIME",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statement = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENT"
        );

        // setTimeout(() => {
        //   alert("hi");
        // }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time)));

        let strBuilder = "";
        strBuilder += "setTimeout(() => {";
        strBuilder += 'alert("hi");';
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          ")));";

        var code = strBuilder + "\n";
        return code;
      },
  },
  {
    name: "calendar_wait_then_top_bottom",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField("Wait");
        this.appendValueInput("TIME").setCheck([
          "every_seconds",
          "every_minutes",
          "every_hours",
          "every_days",
          "every_months",
        ]);
        this.appendDummyInput().appendField("then");
        this.appendStatementInput("STATEMENT").setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var value_time = Blockly.JavaScript.valueToCode(
          block,
          "TIME",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        var statements_statement = Blockly.JavaScript.statementToCode(
          block,
          "STATEMENT"
        );

        // setTimeout(() => {
        //   alert("hi");
        // }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time)));

        let strBuilder = "";
        strBuilder += "setTimeout(() => {";
        strBuilder += 'alert("hi");';
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          ")));";

        var code = strBuilder + "\n";
        return code;
      },
  },
];
