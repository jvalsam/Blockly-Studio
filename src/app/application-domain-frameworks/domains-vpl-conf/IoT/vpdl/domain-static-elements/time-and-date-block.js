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
          .appendField(new Blockly.FieldNumber(0, 0, 11, 1), "HOUR")
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
    codeGen: () =>
      function (block) {
        var number_hour = block.getFieldValue("HOUR");
        var number_minute = block.getFieldValue("MINUTE");
        var number_second = block.getFieldValue("SECOND");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
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
            ["Monday", "MONDAY"],
            ["Tuesday", "TUESDAY"],
            ["Wednesday", "WEDNESDAY"],
            ["Thursday", "THURSDAY"],
            ["Friday", "FRIDAY"],
            ["Saturday", "SATURDAY"],
            ["Sunday", "SUNDAY"],
          ]),
          "NAME"
        );
        this.setInputsInline(true);
        this.setOutput(true, "specific_day");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var dropdown_name = block.getFieldValue("NAME");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
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
            ["January", "JANUARY"],
            ["February", "FEBRUARY"],
            ["March", "MARCH"],
            ["April", "APRIL"],
            ["May", "MAY"],
            ["June", "JUNE"],
            ["July", "JULY"],
            ["August", "AUGUST"],
            ["September", "SEPTEMBER"],
            ["October", "OCTOBER"],
            ["November", "NOVEMBER"],
            ["December", "DECEMBER"],
          ]),
          "MONTH"
        );
        this.setOutput(true, "specific_month");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var dropdown_month = block.getFieldValue("MONTH");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "every_seconds",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 0, Infinity, 1), "SECONDS")
          .appendField("second(s)");
        this.setOutput(true, "every_seconds");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_seconds = block.getFieldValue("SECONDS");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "every_hours",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 0, Infinity, 1), "HOUR")
          .appendField("hour(s)");
        this.setOutput(true, "every_hours");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_hour = block.getFieldValue("HOUR");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "every_minutes",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 0, Infinity, 1), "MINUTE")
          .appendField("minute(s)");
        this.setOutput(true, "every_minutes");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_minute = block.getFieldValue("MINUTE");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "every_days",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 0, Infinity, 1), "DAY")
          .appendField("day(s)");
        this.setOutput(true, "every_days");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_day = block.getFieldValue("DAY");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
  {
    name: "every_months",
    blockDef: () => ({
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0, 0, Infinity, 1), "MONTH")
          .appendField("month(s)");
        this.setOutput(true, "every_months");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    }),
    codeGen: () =>
      function (block) {
        var number_month = block.getFieldValue("MONTH");
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
  },
];
