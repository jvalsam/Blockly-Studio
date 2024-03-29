import * as Blockly from "blockly";

export const TimeAndDateStaticBlocks = [
  {
    name: "specific_hour",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(
            new Blockly.FieldImage(
              "https://img.icons8.com/pastel-glyph/2x/clock.png",
              20,
              20,
              { alt: "*", flipRtl: "FALSE" }
            )
          )
          .appendField(new Blockly.FieldNumber(0, 0, 23, 1), "HOUR")
          .appendField("hour :")
          .appendField(new Blockly.FieldNumber(0, 0, 59, 1), "MINUTE")
          .appendField("minute :")
          .appendField(new Blockly.FieldNumber(0, 0, 59, 1), "SECOND")
          .appendField("second");
        this.setInputsInline(true);
        this.setOutput(true, "specific_hour");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var number_hour = block.getFieldValue("HOUR");
      var number_minute = block.getFieldValue("MINUTE");
      var number_second = block.getFieldValue("SECOND");

      var code =
        'JSON.stringify({ type: "specificTime", hour: ' +
        number_hour +
        ",minute:" +
        number_minute +
        ", second:" +
        number_second +
        ",})";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var number_hour = block.getFieldValue("HOUR");
      var number_minute = block.getFieldValue("MINUTE");
      var number_second = block.getFieldValue("SECOND");

      var code =
        '________JSON.stringify({ type: "specificTime", hour: ' +
        number_hour +
        ",minute:" +
        number_minute +
        ", second:" +
        number_second +
        ",})________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "specific_day",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["Monday", "Monday"],
            ["Tuesday", "Tuesday"],
            ["Wednesday", "Wednesday"],
            ["Thursday", "Thursday"],
            ["Friday", "Friday"],
            ["Saturday", "Saturday"],
            ["Sunday", "Sunday"],
          ]),
          "DAYS"
        );
        this.setInputsInline(true);
        this.setOutput(true, "specific_day");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var dropdown_days = block.getFieldValue("DAYS");

      var code =
        'JSON.stringify({ type: "specificDay", day: \'' +
        dropdown_days +
        "' })";

      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var dropdown_days = block.getFieldValue("DAYS");

      var code =
        '________JSON.stringify({ type: "specificDay", day: \'' +
        dropdown_days +
        "' })________";

      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "specific_month",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["January", "January"],
            ["February", "February"],
            ["March", "March"],
            ["April", "April"],
            ["May", "May"],
            ["June", "June"],
            ["July", "July"],
            ["August", "August"],
            ["September", "September"],
            ["October", "October"],
            ["November", "November"],
            ["December", "December"],
          ]),
          "MONTHS"
        );
        this.setOutput(true, "specific_month");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var dropdown_months = block.getFieldValue("MONTHS");
      // TODO: Assemble JavaScript into code variable.
      var code =
        'JSON.stringify({ type: "specificMonth", month: \'' +
        dropdown_months +
        "' })";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var dropdown_months = block.getFieldValue("MONTHS");
      // TODO: Assemble JavaScript into code variable.
      var code =
        '________JSON.stringify({ type: "specificMonth", month: \'' +
        dropdown_months +
        "' })________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "every_seconds",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "SECONDS")
          .appendField("second(s)");
        this.setOutput(true, "every_seconds");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var number_seconds = block.getFieldValue("SECONDS");
      var code =
        'JSON.stringify({ type: "everySecond", second: ' +
        number_seconds +
        " })";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var number_seconds = block.getFieldValue("SECONDS");
      var code =
        '________JSON.stringify({ type: "everySecond", second: ' +
        number_seconds +
        " })________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "every_minutes",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "MINUTE")
          .appendField("minute(s)");
        this.setOutput(true, "every_minutes");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var number_minute = block.getFieldValue("MINUTE");

      var code =
        'JSON.stringify({ type: "everyMinute", minute: ' +
        number_minute +
        " })";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var number_minute = block.getFieldValue("MINUTE");

      var code =
        '________JSON.stringify({ type: "everyMinute", minute: ' +
        number_minute +
        " })________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "every_hours",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "HOUR")
          .appendField("hour(s)");
        this.setOutput(true, "every_hours");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var number_hour = block.getFieldValue("HOUR");

      var code =
        'JSON.stringify({ type: "everyHour", hour: ' + number_hour + " })";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var number_hour = block.getFieldValue("HOUR");

      var code =
        '________JSON.stringify({ type: "everyHour", hour: ' + number_hour + " })________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "every_days",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "DAY")
          .appendField("day(s)");
        this.setOutput(true, "every_days");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var number_day = block.getFieldValue("DAY");

      var code =
        'JSON.stringify({ type: "everyDay", day: ' + number_day + " })";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var number_day = block.getFieldValue("DAY");

      var code =
        '________JSON.stringify({ type: "everyDay", day: ' + number_day + " })________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
  {
    name: "every_months",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 1, Infinity, 1), "MONTH")
          .appendField("month(s)");
        this.setOutput(true, "every_months");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: (block) => {
      var number_month = block.getFieldValue("MONTH");

      var code =
        'JSON.stringify({ type: "everyMonth", month: ' + number_month + " })";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
    debugGen: (block) => {
      var number_month = block.getFieldValue("MONTH");

      var code =
        '________JSON.stringify({ type: "everyMonth", month: ' + number_month + " })________";
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_NONE];
    },
  },
];
