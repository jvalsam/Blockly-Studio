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
        this.setCommentText("At Block");
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
        strBuilder +=
          "arrayIntervals.push({type: 'calendar_at', time: setTimeout(async function () {";
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          "),'" +
          block.getCommentText() +
          "'))";
        strBuilder += "});";

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
        this.setCommentText("At Statement Block");
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
        strBuilder +=
          "arrayIntervals.push({type: 'calendar_at_top_bottom', time: setTimeout(async function () {";
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          "),'" +
          block.getCommentText() +
          "'))";
        strBuilder += "});";

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
        this.setCommentText("Every Block");
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
        //   arrayIntervals.push({ type: "calendar_every" });
        //   let f = function () {
        //     arrayIntervals[index].time = setTimeout(async () => {
        //       alert(index);
        //       arrayIntervals[index].func();
        //     }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time)));
        //   };
        //   arrayIntervals[index].func = f;
        //   arrayIntervals[index].func();
        // })();

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let index = arrayIntervals.length;";
        strBuilder += "arrayIntervals.push({type: 'calendar_every'});";
        strBuilder += "let f = function () {";
        strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
        strBuilder += statements_statement;
        strBuilder += "arrayIntervals[index].func();";
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          "), '" +
          block.getCommentText() +
          "'));";
        strBuilder += "};";
        strBuilder += "arrayIntervals[index].func = f;";
        strBuilder += "arrayIntervals[index].func();";
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
        this.setCommentText("Every Statement Block");
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
        //   arrayIntervals.push({type: 'calendar_every_top_bottom'});
        //   let f = function () {
        //     arrayIntervals[index].time = setTimeout(() => {
        //       alert(index);
        //       arrayIntervals[index].func();
        //     }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time)));
        //   };
        //   arrayIntervals[index].func = f;
        //   arrayIntervals[index].func();
        // })();

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let index = arrayIntervals.length;";
        strBuilder +=
          "arrayIntervals.push({type: 'calendar_every_top_bottom'});";
        strBuilder += "let f = function () {";
        strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
        strBuilder += statements_statement;
        strBuilder += "arrayIntervals[index].func();";
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          "), '" +
          block.getCommentText() +
          "'));";
        strBuilder += "};";
        strBuilder += "arrayIntervals[index].func = f;";
        strBuilder += "arrayIntervals[index].func();";
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
        this.setCommentText("Wait Block");
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

        // arrayIntervals.push({
        //   type: 'calendar_wait_then',
        //   time: setTimeout(() => {
        //     alert("hi");
        //   }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time))),
        // });

        let strBuilder = "";
        strBuilder +=
          "arrayIntervals.push({type: 'calendar_wait_then', time: setTimeout(async () => {";
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          "),'" +
          block.getCommentText() +
          "'))";
        strBuilder += "});";

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
        this.setCommentText("Wait Statement Block");
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

        // arrayIntervals.push({
        //   type: "calendar_wait_then_top_bottom",
        //   time: setTimeout(() => {
        //     alert("hi");
        //   }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time), block.getCommentText())),
        // });

        let strBuilder = "";
        strBuilder +=
          "arrayIntervals.push({type: 'calendar_wait_then_top_bottom', time: setTimeout(async () => {";
        strBuilder += statements_statement;
        strBuilder +=
          "}, timeDispatch[JSON.parse(" +
          value_time +
          ").type](JSON.parse(" +
          value_time +
          "), '" +
          block.getCommentText() +
          "'))";
        strBuilder += "});";

        var code = strBuilder + "\n";
        return code;
      },
  },
];
