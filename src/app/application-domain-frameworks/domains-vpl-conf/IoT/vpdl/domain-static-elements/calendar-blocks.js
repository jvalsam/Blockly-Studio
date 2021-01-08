import * as Blockly from "blockly";

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

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
    codeGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      const id = ID();

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder +=
        "arrayIntervals.push({type: 'calendar_at', time: setTimeout(async function () {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder +=
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";

      strBuilder += statements_statement;

      strBuilder +=
        "let endTime =" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().hour()).slice(-2) +" +
        JSON.stringify(":") +
        " +" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().minute()).slice(-2) +" +
        JSON.stringify(":") +
        " + (" +
        JSON.stringify("0") +
        " + dayjs().second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").isCompleted = true;";
      strBuilder +=
        "}, timeDispatch[JSON.parse(" +
        value_time +
        ").type](JSON.parse(" +
        value_time +
        ")," +
        JSON.stringify(block.getCommentText()) +
        ", " +
        JSON.stringify(id) +
        "))";
      strBuilder += "});";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
    debugGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      // (function () {
      //   let index = arrayIntervals.length;
      //   arrayIntervals.push({
      //     type: "calendar_at",
      //     /* Specific time on timeDispatch != codeGen */
      //     realEndTime: timeDispatch[JSON.parse(value_time).type](
      //       JSON.parse(value_time),
      //       block.getCommentText(),
      //       id
      //     ),
      //   });
      //   let func = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       // if simulated time >= value_time
      //       if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {
      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isFired = true;

      //         let calculateTime = dayjs();

      //         statements_statement;

      //         let diffTime = dayjs().diff(calculateTime);

      //         let endTime = dayjs(arrayIntervals[index].realEndTime).set(
      //           "millisecond",
      //           arrayIntervals[index].realEndTime.millisecond() + diffTime
      //         );

      //         endTime =
      //           ("0" + endTime.hour()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.minute()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.second()).slice(-2);

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).endTime = endTime;

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isCompleted = true;

      //         clearTimeout(arrayIntervals[index].time);
      //         arrayIntervals.slice(index, 1);
      //         return;
      //       }
      //       arrayIntervals[index].func();
      //     }, 500);
      //   };
      //   arrayIntervals[index].func = func;
      //   arrayIntervals[index].func();
      // })();

      const id = ID();

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({";
      strBuilder += "type: 'calendar_at',";
      strBuilder +=
        "realEndTime: timeDispatch[JSON.parse(" + value_time + ").type](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += JSON.stringify(id);
      strBuilder += "),";
      strBuilder += "});";
      strBuilder += "let func = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder +=
        "if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";
      strBuilder += "let calculateTime = dayjs();";
      strBuilder += statements_statement;
      strBuilder += "let diffTime = dayjs().diff(calculateTime);";
      strBuilder +=
        "let endTime = dayjs(arrayIntervals[index].realEndTime).set(";
      strBuilder += JSON.stringify("millisecond") + ",";
      strBuilder +=
        "arrayIntervals[index].realEndTime.millisecond() + diffTime";
      strBuilder += ");";
      strBuilder += "endTime =";
      strBuilder += "(" + JSON.stringify("0") + "+ endTime.hour()).slice(-2) +";
      strBuilder += JSON.stringify(":") + "+";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.minute()).slice(-2) +";
      strBuilder += JSON.stringify(":") + " +";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").isCompleted = true;";
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "}, 500);";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = func;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

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
    codeGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      const id = ID();

      let strBuilder = "";
      strBuilder += "(function(){";
      strBuilder +=
        "arrayIntervals.push({type: 'calendar_at_top_bottom', time: setTimeout(async function () {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder +=
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";

      strBuilder += statements_statement;

      strBuilder +=
        "let endTime =" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().hour()).slice(-2) +" +
        JSON.stringify(":") +
        " +" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().minute()).slice(-2) +" +
        JSON.stringify(":") +
        " + (" +
        JSON.stringify("0") +
        " + dayjs().second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").isCompleted = true;";
      strBuilder +=
        "}, timeDispatch[JSON.parse(" +
        value_time +
        ").type](JSON.parse(" +
        value_time +
        ")," +
        JSON.stringify(block.getCommentText()) +
        ", " +
        JSON.stringify(id) +
        "))";
      strBuilder += "});";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
    debugGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      // (function () {
      //   let index = arrayIntervals.length;
      //   arrayIntervals.push({
      //     type: "calendar_at_top_bottom",
      //     /* Specific time on timeDispatch != codeGen */
      //     realEndTime: timeDispatch[JSON.parse(value_time).type](
      //       JSON.parse(value_time),
      //       block.getCommentText(),
      //       id
      //     ),
      //   });
      //   let func = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       // if simulated time >= value_time
      //       if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {
      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isFired = true;

      //         let calculateTime = dayjs();

      //         statements_statement;

      //         let diffTime = dayjs().diff(calculateTime);

      //         let endTime = dayjs(arrayIntervals[index].realEndTime).set(
      //           "millisecond",
      //           arrayIntervals[index].realEndTime.millisecond() + diffTime
      //         );

      //         endTime =
      //           ("0" + endTime.hour()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.minute()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.second()).slice(-2);

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).endTime = endTime;

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isCompleted = true;

      //         clearTimeout(arrayIntervals[index].time);
      //         arrayIntervals.slice(index, 1);
      //         return;
      //       }
      //       arrayIntervals[index].func();
      //     }, 500);
      //   };
      //   arrayIntervals[index].func = func;
      //   arrayIntervals[index].func();
      // })();

      const id = ID();

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({";
      strBuilder += "type: 'calendar_at_top_bottom',";
      strBuilder +=
        "realEndTime: timeDispatch[JSON.parse(" + value_time + ").type](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += JSON.stringify(id);
      strBuilder += "),";
      strBuilder += "});";
      strBuilder += "let func = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder +=
        "if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";
      strBuilder += "let calculateTime = dayjs();";
      strBuilder += statements_statement;
      strBuilder += "let diffTime = dayjs().diff(calculateTime);";
      strBuilder +=
        "let endTime = dayjs(arrayIntervals[index].realEndTime).set(";
      strBuilder += JSON.stringify("millisecond") + ",";
      strBuilder +=
        "arrayIntervals[index].realEndTime.millisecond() + diffTime";
      strBuilder += ");";
      strBuilder += "endTime =";
      strBuilder += "(" + JSON.stringify("0") + "+ endTime.hour()).slice(-2) +";
      strBuilder += JSON.stringify(":") + "+";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.minute()).slice(-2) +";
      strBuilder += JSON.stringify(":") + " +";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").isCompleted = true;";
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "}, 500);";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = func;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

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
    codeGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      // (function () {
      //   let index = arrayIntervals.length;
      //   arrayIntervals.push({ type: "calendar_every" });
      //   let f = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       try {
      //         statements_statement;
      //         // update fire boolean
      //         activeDateOnCalendar[timeIdsToDate[id].day][
      //           timeIdsToDate[id].startTime
      //         ].isFired = true;
      //       } catch (e) {
      //         if (e === "break") {
      //           clearTimeout(arrayIntervals[index].time);
      //           arrayIntervals.slice(index, 1);
      //           return;
      //         } else if (e === "continue") {
      //         }
      //       }
      //       arrayIntervals[index].func();
      //     }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time), block.getCommentText(), id));
      //   };
      //   arrayIntervals[index].func = f;
      //   arrayIntervals[index].func();
      // })();

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({type: 'calendar_every'});";
      strBuilder += "let f = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder += "try {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder +=
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";

      strBuilder += statements_statement;

      strBuilder +=
        "let endTime =" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().hour()).slice(-2) +" +
        JSON.stringify(":") +
        " +" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().minute()).slice(-2) +" +
        JSON.stringify(":") +
        " + (" +
        JSON.stringify("0") +
        " + dayjs().second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").isCompleted = true;";
      strBuilder += "} catch (e) {";
      strBuilder += 'if (e === "break") {';
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += '} else if (e === "continue") {';
      strBuilder += "}";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder +=
        "}, timeDispatch[JSON.parse(" +
        value_time +
        ").type](JSON.parse(" +
        value_time +
        "), " +
        JSON.stringify(block.getCommentText()) +
        ", " +
        JSON.stringify(id) +
        "));";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = f;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
    debugGen: (block) => {
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
      //   arrayIntervals.push({
      //     type: "calendar_every",
      //     /* Specific time on timeDispatch != codeGen */
      //     realEndTime: timeDispatch[JSON.parse(value_time).type](
      //       JSON.parse(value_time),
      //       block.getCommentText(),
      //       id
      //     ),
      //     timeStep: CalculateMillisecondsForNextTime(JSON.parse(value_time)),
      //   });
      //   let func = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       // if simulated time >= value_time
      //       if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {
      //         let calculatedEndTime;
      //         try {
      //           activeDateOnCalendar[timeIdsToDate[id].day].find(
      //             (e) =>
      //               e.startTime === timeIdsToDate[id].startTime && e.id === id
      //           ).isFired = true;

      //           let calculateTime = dayjs();

      //           statements_statement;

      //           let diffTime = dayjs().diff(calculateTime);

      //           calculatedEndTime = dayjs(
      //             arrayIntervals[index].realEndTime
      //           ).set(
      //             "millisecond",
      //             arrayIntervals[index].realEndTime.millisecond() + diffTime
      //           );

      //           let endTime =
      //             ("0" + calculatedEndTime.hour()).slice(-2) +
      //             ":" +
      //             ("0" + calculatedEndTime.minute()).slice(-2) +
      //             ":" +
      //             ("0" + calculatedEndTime.second()).slice(-2);

      //           activeDateOnCalendar[timeIdsToDate[id].day].find(
      //             (e) =>
      //               e.startTime === timeIdsToDate[id].startTime && e.id === id
      //           ).endTime = endTime;

      //           activeDateOnCalendar[timeIdsToDate[id].day].find(
      //             (e) =>
      //               e.startTime === timeIdsToDate[id].startTime && e.id === id
      //           ).isCompleted = true;
      //         } catch (e) {
      //           if (e === "break") {
      //             clearTimeout(arrayIntervals[index].time);
      //             arrayIntervals.slice(index, 1);
      //             return;
      //           } else if (e === "continue") {
      //           }
      //         }
      //         let nextStartTime = NextStartTime(
      //           calculatedEndTime,
      //           arrayIntervals[index].timeStep
      //         );
      //         if (nextStartTime === -1)
      //           arrayIntervals[index].realEndTime = timeDispatch[
      //             JSON.parse(value_time).type
      //           ](JSON.parse(value_time), block.getCommentText(), id);
      //         else
      //           arrayIntervals[index].realEndTime = timeDispatch[
      //             JSON.parse(value_time).type
      //           ](
      //             JSON.parse(value_time),
      //             block.getCommentText(),
      //             id,
      //             nextStartTime
      //           );
      //       }
      //       arrayIntervals[index].func();
      //     }, 500);
      //   };
      //   arrayIntervals[index].func = func;
      //   arrayIntervals[index].func();
      // })();

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let id = ID();";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({";
      strBuilder += "type: 'calendar_every',";
      strBuilder +=
        "realEndTime: timeDispatch[JSON.parse(" + value_time + ").type](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += "id";
      strBuilder += "),";
      strBuilder +=
        "timeStep: CalculateMillisecondsForNextTime(JSON.parse(" +
        value_time +
        ")),";
      strBuilder += "});";
      strBuilder += "let func = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder +=
        "if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {";
      strBuilder += "let calculatedEndTime;";
      strBuilder += "try {";
      strBuilder += "activeDateOnCalendar[timeIdsToDate[id].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[id].startTime && e.id === id";
      strBuilder += ").isFired = true;";
      strBuilder += "let calculateTime = dayjs();";
      strBuilder += statements_statement;
      strBuilder += "let diffTime = dayjs().diff(calculateTime);";
      strBuilder +=
        "calculatedEndTime = dayjs(arrayIntervals[index].realEndTime).set(";
      strBuilder += JSON.stringify("millisecond") + ",";
      strBuilder +=
        "arrayIntervals[index].realEndTime.millisecond() + diffTime";
      strBuilder += ");";
      strBuilder += "let endTime =";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ calculatedEndTime.hour()).slice(-2) +";
      strBuilder += JSON.stringify(":") + "+";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ calculatedEndTime.minute()).slice(-2) +";
      strBuilder += JSON.stringify(":") + " +";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ calculatedEndTime.second()).slice(-2);";
      strBuilder += "activeDateOnCalendar[timeIdsToDate[id].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[id].startTime && e.id === id";
      strBuilder += ").endTime = endTime;";
      strBuilder += "activeDateOnCalendar[timeIdsToDate[id].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[id].startTime && e.id === id";
      strBuilder += ").isCompleted = true;";
      strBuilder += "} catch (e) {";
      strBuilder += "if (e === 'break') {";
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += "} else if (e === 'continue') {";
      strBuilder += "}";
      strBuilder += "}";
      strBuilder += "let nextStartTime = NextStartTime(";
      strBuilder += "calculatedEndTime,";
      strBuilder += "arrayIntervals[index].timeStep";
      strBuilder += ");";
      strBuilder += "if (nextStartTime === -1)";
      strBuilder += "arrayIntervals[index].realEndTime = timeDispatch[";
      strBuilder += "JSON.parse(" + value_time + ").type";
      strBuilder +=
        "](JSON.parse(" +
        value_time +
        "), " +
        JSON.stringify(block.getCommentText()) +
        ", id);";
      strBuilder += "else ";
      strBuilder += "arrayIntervals[index].realEndTime = timeDispatch[";
      strBuilder += "JSON.parse(" + value_time + ").type";
      strBuilder += "](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += "id,";
      strBuilder += "nextStartTime";
      strBuilder += ");";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "}, 500);";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = func;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
  },
  {
    name: "calendar_every_top_bottom",
    blockDef: () => ({
      isSurroundLoop: function () {
        // Is the block nested in a loop?
        let blockP = this.getSurroundParent();
        while (blockP) {
          if (
            blockP.type === "calendar_every" ||
            blockP.type === "calendar_every_top_bottom" ||
            blockP.type === "when_times" ||
            blockP.type === "when_times_top_bottom" ||
            blockP.type === "when_forever" ||
            blockP.type === "when_forever_top_bottom"
          ) {
            return true;
          }
          blockP = blockP.getSurroundParent();
        }
        return false;
      },
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
    codeGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({type: 'calendar_every_top_bottom'});";
      strBuilder += "let f = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder += "try {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder +=
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";

      strBuilder += statements_statement;

      strBuilder +=
        "let endTime =" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().hour()).slice(-2) +" +
        JSON.stringify(":") +
        " +" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().minute()).slice(-2) +" +
        JSON.stringify(":") +
        " + (" +
        JSON.stringify("0") +
        " + dayjs().second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").isCompleted = true;";
      strBuilder += "} catch (e) {";
      strBuilder += 'if (e === "break") {';
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += '} else if (e === "continue") {';
      strBuilder += "}";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder +=
        "}, timeDispatch[JSON.parse(" +
        value_time +
        ").type](JSON.parse(" +
        value_time +
        "), " +
        JSON.stringify(block.getCommentText()) +
        ", " +
        JSON.stringify(id) +
        "));";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = f;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
    debugGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      // (function () {
      //   let index = arrayIntervals.length;
      //   arrayIntervals.push({
      //     type: "calendar_every_top_bottom",
      //     /* Specific time on timeDispatch != codeGen */
      //     realEndTime: timeDispatch[JSON.parse(value_time).type](
      //       JSON.parse(value_time),
      //       block.getCommentText(),
      //       id
      //     ),
      //     timeStep: CalculateMillisecondsForNextTime(JSON.parse(value_time)),
      //   });
      //   let func = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       // if simulated time >= value_time
      //       if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {
      //         let calculatedEndTime;
      //         try {
      //           activeDateOnCalendar[timeIdsToDate[id].day].find(
      //             (e) =>
      //               e.startTime === timeIdsToDate[id].startTime && e.id === id
      //           ).isFired = true;

      //           let calculateTime = dayjs();

      //           statements_statement;

      //           let diffTime = dayjs().diff(calculateTime);

      //           calculatedEndTime = dayjs(
      //             arrayIntervals[index].realEndTime
      //           ).set(
      //             "millisecond",
      //             arrayIntervals[index].realEndTime.millisecond() + diffTime
      //           );

      //           let endTime =
      //             ("0" + calculatedEndTime.hour()).slice(-2) +
      //             ":" +
      //             ("0" + calculatedEndTime.minute()).slice(-2) +
      //             ":" +
      //             ("0" + calculatedEndTime.second()).slice(-2);

      //           activeDateOnCalendar[timeIdsToDate[id].day].find(
      //             (e) =>
      //               e.startTime === timeIdsToDate[id].startTime && e.id === id
      //           ).endTime = endTime;

      //           activeDateOnCalendar[timeIdsToDate[id].day].find(
      //             (e) =>
      //               e.startTime === timeIdsToDate[id].startTime && e.id === id
      //           ).isCompleted = true;
      //         } catch (e) {
      //           if (e === "break") {
      //             clearTimeout(arrayIntervals[index].time);
      //             arrayIntervals.slice(index, 1);
      //             return;
      //           } else if (e === "continue") {
      //           }
      //         }
      //         let nextStartTime = NextStartTime(
      //           calculatedEndTime,
      //           arrayIntervals[index].timeStep
      //         );
      //         if (nextStartTime === -1)
      //           arrayIntervals[index].realEndTime = timeDispatch[
      //             JSON.parse(value_time).type
      //           ](JSON.parse(value_time), block.getCommentText(), id);
      //         else
      //           arrayIntervals[index].realEndTime = timeDispatch[
      //             JSON.parse(value_time).type
      //           ](
      //             JSON.parse(value_time),
      //             block.getCommentText(),
      //             id,
      //             nextStartTime
      //           );
      //       }
      //       arrayIntervals[index].func();
      //     }, 500);
      //   };
      //   arrayIntervals[index].func = func;
      //   arrayIntervals[index].func();
      // })();

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let id = ID();";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({";
      strBuilder += "type: 'calendar_every_top_bottom',";
      strBuilder +=
        "realEndTime: timeDispatch[JSON.parse(" + value_time + ").type](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += "id";
      strBuilder += "),";
      strBuilder +=
        "timeStep: CalculateMillisecondsForNextTime(JSON.parse(" +
        value_time +
        ")),";
      strBuilder += "});";
      strBuilder += "let func = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder +=
        "if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {";
      strBuilder += "let calculatedEndTime;";
      strBuilder += "try {";
      strBuilder += "activeDateOnCalendar[timeIdsToDate[id].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[id].startTime && e.id === id";
      strBuilder += ").isFired = true;";
      strBuilder += "let calculateTime = dayjs();";
      strBuilder += statements_statement;
      strBuilder += "let diffTime = dayjs().diff(calculateTime);";
      strBuilder +=
        "calculatedEndTime = dayjs(arrayIntervals[index].realEndTime).set(";
      strBuilder += JSON.stringify("millisecond") + ",";
      strBuilder +=
        "arrayIntervals[index].realEndTime.millisecond() + diffTime";
      strBuilder += ");";
      strBuilder += "let endTime =";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ calculatedEndTime.hour()).slice(-2) +";
      strBuilder += JSON.stringify(":") + "+";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ calculatedEndTime.minute()).slice(-2) +";
      strBuilder += JSON.stringify(":") + " +";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ calculatedEndTime.second()).slice(-2);";
      strBuilder += "activeDateOnCalendar[timeIdsToDate[id].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[id].startTime && e.id === id";
      strBuilder += ").endTime = endTime;";
      strBuilder += "activeDateOnCalendar[timeIdsToDate[id].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[id].startTime && e.id === id";
      strBuilder += ").isCompleted = true;";
      strBuilder += "} catch (e) {";
      strBuilder += "if (e === 'break') {";
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += "} else if (e === 'continue') {";
      strBuilder += "}";
      strBuilder += "}";
      strBuilder += "let nextStartTime = NextStartTime(";
      strBuilder += "calculatedEndTime,";
      strBuilder += "arrayIntervals[index].timeStep";
      strBuilder += ");";
      strBuilder += "if (nextStartTime === -1)";
      strBuilder += "arrayIntervals[index].realEndTime = timeDispatch[";
      strBuilder += "JSON.parse(" + value_time + ").type";
      strBuilder +=
        "](JSON.parse(" +
        value_time +
        "), " +
        JSON.stringify(block.getCommentText()) +
        ", id);";
      strBuilder += "else ";
      strBuilder += "arrayIntervals[index].realEndTime = timeDispatch[";
      strBuilder += "JSON.parse(" + value_time + ").type";
      strBuilder += "](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += "id,";
      strBuilder += "nextStartTime";
      strBuilder += ");";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "}, 500);";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = func;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
  },
  {
    name: "break_continue_every",
    blockDef: () => ({
      isSurroundEvery: function () {
        // Is the block nested in a loop?
        let blockP = this.getSurroundParent();
        while (blockP) {
          if (
            blockP.type === "calendar_every" ||
            blockP.type === "calendar_every_top_bottom"
          ) {
            return true;
          }
          blockP = blockP.getSurroundParent();
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
        let input = this.getInput("IMAGE-OUTER");
        input.removeField("IMAGE");
        input.appendField(image, "IMAGE");
      },
      validate: function (newValue) {
        this.getSourceBlock().updateImage(newValue);
        return newValue;
      },
      init: function () {
        this.appendDummyInput("IMAGE-OUTER").appendField(
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
          .appendField("of  Every");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var dropdown_action = block.getFieldValue("ACTION");

      var code = "throw '" + dropdown_action + "'";
      return code;
    },
    debugGen: (block) => {
      var dropdown_action = block.getFieldValue("ACTION");

      var code = "throw '" + dropdown_action + "'";
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
    codeGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      // arrayIntervals.push({
      //   type: "calendar_wait_then",
      //   time: setTimeout(() => {
      //     statements_statement;
      //     // update fire boolean
      //     activeDateOnCalendar[timeIdsToDate[id].day][
      //       timeIdsToDate[id].startTime
      //     ].isFired = true;
      //   }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time), block.getCommentText(), id)),
      // });

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder +=
        "arrayIntervals.push({type: 'calendar_wait_then', time: setTimeout(async () => {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder +=
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";

      strBuilder += statements_statement;

      strBuilder +=
        "let endTime =" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().hour()).slice(-2) +" +
        JSON.stringify(":") +
        " +" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().minute()).slice(-2) +" +
        JSON.stringify(":") +
        " + (" +
        JSON.stringify("0") +
        " + dayjs().second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").isCompleted = true;";
      strBuilder +=
        "}, timeDispatch[JSON.parse(" +
        value_time +
        ").type](JSON.parse(" +
        value_time +
        ")," +
        JSON.stringify(block.getCommentText()) +
        ", " +
        JSON.stringify(id) +
        "))";
      strBuilder += "});";
      strBuilder += "})()";

      var code = strBuilder + "\n";
      return code;
    },
    debugGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      // (function () {
      //   let index = arrayIntervals.length;
      //   arrayIntervals.push({
      //     type: "calendar_wait_then",
      //     /* Specific time on timeDispatch != codeGen */
      //     realEndTime: timeDispatch[JSON.parse(value_time).type](
      //       JSON.parse(value_time),
      //       block.getCommentText(),
      //       id
      //     ),
      //   });
      //   let func = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       // if simulated time >= value_time
      //       if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {
      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isFired = true;

      //         let calculateTime = dayjs();

      //         statements_statement;

      //         let diffTime = dayjs().diff(calculateTime);

      //         let endTime = dayjs(arrayIntervals[index].realEndTime).set(
      //           "millisecond",
      //           arrayIntervals[index].realEndTime.millisecond() + diffTime
      //         );

      //         endTime =
      //           ("0" + endTime.hour()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.minute()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.second()).slice(-2);

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).endTime = endTime;

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isCompleted = true;

      //         clearTimeout(arrayIntervals[index].time);
      //         arrayIntervals.slice(index, 1);
      //         return;
      //       }
      //       arrayIntervals[index].func();
      //     }, 500);
      //   };
      //   arrayIntervals[index].func = func;
      //   arrayIntervals[index].func();
      // })();

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({";
      strBuilder += "type: 'calendar_wait_then',";
      strBuilder +=
        "realEndTime: timeDispatch[JSON.parse(" + value_time + ").type](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += JSON.stringify(id);
      strBuilder += "),";
      strBuilder += "});";
      strBuilder += "let func = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder +=
        "if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";
      strBuilder += "let calculateTime = dayjs();";
      strBuilder += statements_statement;
      strBuilder += "let diffTime = dayjs().diff(calculateTime);";
      strBuilder +=
        "let endTime = dayjs(arrayIntervals[index].realEndTime).set(";
      strBuilder += JSON.stringify("millisecond") + ",";
      strBuilder +=
        "arrayIntervals[index].realEndTime.millisecond() + diffTime";
      strBuilder += ");";
      strBuilder += "endTime =";
      strBuilder += "(" + JSON.stringify("0") + "+ endTime.hour()).slice(-2) +";
      strBuilder += JSON.stringify(":") + "+";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.minute()).slice(-2) +";
      strBuilder += JSON.stringify(":") + " +";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").isCompleted = true;";
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "}, 500);";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = func;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

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
    codeGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      // arrayIntervals.push({
      //   type: "calendar_wait_then_top_bottom",
      //   time: setTimeout(() => {
      //     statements_statement;
      //     // update fire boolean
      //     activeDateOnCalendar[timeIdsToDate[id].day].find(
      //       (e) => e.startTime === timeIdsToDate[id].startTime
      //     ).isFired = true;
      //   }, timeDispatch[JSON.parse(value_time).type](JSON.parse(value_time), block.getCommentText(), id)),
      // });

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder +=
        "arrayIntervals.push({type: 'calendar_wait_then_top_bottom', time: setTimeout(async () => {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder +=
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";

      strBuilder += statements_statement;

      strBuilder +=
        "let endTime =" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().hour()).slice(-2) +" +
        JSON.stringify(":") +
        " +" +
        "(" +
        JSON.stringify("0") +
        " + dayjs().minute()).slice(-2) +" +
        JSON.stringify(":") +
        " + (" +
        JSON.stringify("0") +
        " + dayjs().second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(" +
        "(e) => e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id) +
        ").isCompleted = true;";
      strBuilder +=
        "}, timeDispatch[JSON.parse(" +
        value_time +
        ").type](JSON.parse(" +
        value_time +
        "), " +
        JSON.stringify(block.getCommentText()) +
        ", " +
        JSON.stringify(id) +
        "))";
      strBuilder += "});";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
    debugGen: (block) => {
      var value_time = Blockly.JavaScript.valueToCode(
        block,
        "TIME",
        Blockly.JavaScript.ORDER_ATOMIC
      );

      var statements_statement = Blockly.JavaScript.statementToCode(
        block,
        "STATEMENT"
      );

      const id = ID();

      // (function () {
      //   let index = arrayIntervals.length;
      //   arrayIntervals.push({
      //     type: "calendar_wait_then_top_bottom",
      //     /* Specific time on timeDispatch != codeGen */
      //     realEndTime: timeDispatch[JSON.parse(value_time).type](
      //       JSON.parse(value_time),
      //       block.getCommentText(),
      //       id
      //     ),
      //   });
      //   let func = function () {
      //     arrayIntervals[index].time = setTimeout(async () => {
      //       // if simulated time >= value_time
      //       if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {
      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isFired = true;

      //         let calculateTime = dayjs();

      //         statements_statement;

      //         let diffTime = dayjs().diff(calculateTime);

      //         let endTime = dayjs(arrayIntervals[index].realEndTime).set(
      //           "millisecond",
      //           arrayIntervals[index].realEndTime.millisecond() + diffTime
      //         );

      //         endTime =
      //           ("0" + endTime.hour()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.minute()).slice(-2) +
      //           ":" +
      //           ("0" + endTime.second()).slice(-2);

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).endTime = endTime;

      //         activeDateOnCalendar[timeIdsToDate[id].day].find(
      //           (e) =>
      //             e.startTime === timeIdsToDate[id].startTime && e.id === id
      //         ).isCompleted = true;

      //         clearTimeout(arrayIntervals[index].time);
      //         arrayIntervals.slice(index, 1);
      //         return;
      //       }
      //       arrayIntervals[index].func();
      //     }, 500);
      //   };
      //   arrayIntervals[index].func = func;
      //   arrayIntervals[index].func();
      // })();

      if (value_time === "") {
        let strBuilder = "";
        return strBuilder;
      }

      let strBuilder = "";
      strBuilder += "(function () {";
      strBuilder += "let index = arrayIntervals.length;";
      strBuilder += "arrayIntervals.push({";
      strBuilder += "type: 'calendar_wait_then_top_bottom',";
      strBuilder +=
        "realEndTime: timeDispatch[JSON.parse(" + value_time + ").type](";
      strBuilder += "JSON.parse(" + value_time + "),";
      strBuilder += JSON.stringify(block.getCommentText()) + ",";
      strBuilder += JSON.stringify(id);
      strBuilder += "),";
      strBuilder += "});";
      strBuilder += "let func = function () {";
      strBuilder += "arrayIntervals[index].time = setTimeout(async () => {";
      strBuilder +=
        "if (simulatedTime.diff(arrayIntervals[index].realEndTime) >= 0) {";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").isFired = true;";
      strBuilder += "let calculateTime = dayjs();";
      strBuilder += statements_statement;
      strBuilder += "let diffTime = dayjs().diff(calculateTime);";
      strBuilder +=
        "let endTime = dayjs(arrayIntervals[index].realEndTime).set(";
      strBuilder += JSON.stringify("millisecond") + ",";
      strBuilder +=
        "arrayIntervals[index].realEndTime.millisecond() + diffTime";
      strBuilder += ");";
      strBuilder += "endTime =";
      strBuilder += "(" + JSON.stringify("0") + "+ endTime.hour()).slice(-2) +";
      strBuilder += JSON.stringify(":") + "+";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.minute()).slice(-2) +";
      strBuilder += JSON.stringify(":") + " +";
      strBuilder +=
        "(" + JSON.stringify("0") + "+ endTime.second()).slice(-2);";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id === " +
        JSON.stringify(id);
      strBuilder += ").endTime = endTime;";
      strBuilder +=
        "activeDateOnCalendar[timeIdsToDate[" +
        JSON.stringify(id) +
        "].day].find(";
      strBuilder += "(e) =>";
      strBuilder +=
        "e.startTime === timeIdsToDate[" +
        JSON.stringify(id) +
        "].startTime && e.id ===" +
        JSON.stringify(id);
      strBuilder += ").isCompleted = true;";
      strBuilder += "clearTimeout(arrayIntervals[index].time);";
      strBuilder += "arrayIntervals.slice(index, 1);";
      strBuilder += "return;";
      strBuilder += "}";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "}, 500);";
      strBuilder += "};";
      strBuilder += "arrayIntervals[index].func = func;";
      strBuilder += "arrayIntervals[index].func();";
      strBuilder += "})();";

      var code = strBuilder + "\n";
      return code;
    },
  },
];
