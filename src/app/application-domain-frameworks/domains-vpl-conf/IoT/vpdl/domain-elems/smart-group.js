import * as Blockly from "blockly";

export const SmartGroup = {
  name: "SmartGroup",
  blocklyElems: [
    // way to define getter without multiple
    // {
    //   name: "getValueBlock",
    //   uniqueInstance: false,
    //   blockDef: (data) => {
    //     let dropdownSel = [];
    //     data.details.properties.forEach((property) => {
    //       dropdownSel.push([property.name, property.name.toUpperCase()]);
    //     });
    //     return {
    //       init: function () {
    //         this.appendDummyInput()
    //           .appendField(
    //             new Blockly.FieldImage(data.img, 20, 20, {
    //               alt: "*",
    //               flipRtl: "FALSE",
    //             })
    //           )
    //           .appendField(data.title)
    //           .appendField("get ")
    //           .appendField(
    //             new Blockly.FieldDropdown(dropdownSel),
    //             "PROPERTIES"
    //           );
    //         this.setOutput(true, "getter");
    //         this.setColour(240);
    //         this.setTooltip("");
    //         this.setHelpUrl("");
    //       },
    //     };
    //   },
    //   codeGen: (data) => {
    //     let code = "...";
    //     data.details.properties.forEach((property) => {
    //       //code generation based on the choice
    //     });
    //     return [code, Blockly.JavaScript.ORDER_NONE];
    //   },
    //   debugGen: (data) => {
    //     let code = "...";
    //     data.details.properties.forEach((property) => {
    //       //code generation based on the choice
    //     });
    //     return [code, Blockly.JavaScript.ORDER_NONE];
    //     // object
    //   },
    // },
    {
      name: "setter",
      uniqueInstance: false,
      blockDef: (data) => {
        let dropdownSel = [];
        let propertiesValueType = {};

        data.details.properties.forEach((property) => {
          if (property.type !== "enumerated" && !property.read_only) {
            dropdownSel.push([property.name, property.name.toUpperCase()]);
            let propertyType = typeof property.value;
            propertiesValueType[property.name.toUpperCase()] =
              propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
          }
        });

        // check if we have properties for these blocks
        if (dropdownSel.length === 0) {
          return null;
        }

        return {
          updateConnections: function (newValue) {
            this.getInput("VALUE_INPUT").setCheck(
              propertiesValueType[newValue]
            );
            this.setTooltip("Input type: " + propertiesValueType[newValue]);
          },
          validate: function (newValue) {
            this.getSourceBlock().updateConnections(newValue);
            return newValue;
          },
          init: function () {
            this.appendDummyInput()
              .appendField(
                new Blockly.FieldImage(data.img, 20, 20, {
                  alt: "*",
                  flipRtl: "FALSE",
                })
              )
              .appendField(data.title)
              .appendField(" set")
              .appendField(
                new Blockly.FieldDropdown(dropdownSel, this.validate),
                "PROPERTIES"
              )
              .appendField("to");
            this.appendValueInput("VALUE_INPUT").setCheck(
              propertiesValueType[dropdownSel[0][1]]
            );
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(240);
            this.setTooltip(
              "Input type: " + propertiesValueType[dropdownSel[0][1]]
            );
            this.setHelpUrl("");
          },
        };
      },
      codeGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");
        var value_value = Blockly.JavaScript.valueToCode(
          block,
          "VALUE",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });

        // TODO: Assemble JavaScript into code variable.
        var code = "...;\n";
        return code;
      },
      debugGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");
        var value_value = Blockly.JavaScript.valueToCode(
          block,
          "VALUE",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });

        // TODO: Assemble JavaScript into code variable.
        var code = "...;\n";
        return code;
      },
    },
    {
      name: "setter_enum",
      uniqueInstance: false,
      blockDef: (data) => {
        let enumeratedProps = [];
        let enumeratedPossibleValues = {};

        data.details.properties.forEach((property) => {
          if (property.type === "enumerated" && !property.read_only) {
            // build enumerated properties
            enumeratedProps.push([property.name, property.name.toUpperCase()]);
            enumeratedPossibleValues[property.name.toUpperCase()] = [];
            // build poosible_values for each property
            property.options.possible_values.forEach((possibleValue) => {
              enumeratedPossibleValues[property.name.toUpperCase()].push([
                possibleValue,
                possibleValue.toUpperCase(),
              ]);
            });
          }
        });

        return {
          updateConnections: function (newValue) {
            // console.log(newValue);
            this.removeInput("possible_values");
            this.appendDummyInput("possible_values").appendField(
              new Blockly.FieldDropdown(enumeratedPossibleValues[newValue]),
              "POSSIBLE_VALUES"
            );
          },
          validate: function (newValue) {
            this.getSourceBlock().updateConnections(newValue);
            return newValue;
          },
          init: function () {
            this.appendDummyInput()
              .appendField(
                new Blockly.FieldImage(data.img, 20, 20, {
                  alt: "*",
                  flipRtl: "FALSE",
                })
              )
              .appendField(data.title + ":")
              .appendField(" set")
              .appendField(
                new Blockly.FieldDropdown(enumeratedProps, this.validate),
                "PROPERTIES"
              )
              .appendField("to");
            this.appendDummyInput("possible_values").appendField(
              new Blockly.FieldDropdown(
                enumeratedPossibleValues[enumeratedProps[0][1]]
              ),
              "POSSIBLE_VALUES"
            );
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(240);
            this.setTooltip("");
            this.setHelpUrl("");
          },
        };
      },
      codeGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");
        var dropdown_possible_values = block.getFieldValue("POSSIBLE_VALUES");

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });

        // TODO: Assemble JavaScript into code variable.
        var code = "...;\n";
        return code;
      },
      debugGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");
        var dropdown_possible_values = block.getFieldValue("POSSIBLE_VALUES");

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });

        // TODO: Assemble JavaScript into code variable.
        var code = "...;\n";
        return code;
      },
    },
  ],

  signals: [
    {
      action: "onCreate",
      name: "create-smart-group",
      mission: "ec-smart-group",
      provider: "SmartObjectVPLEditor",
    },
    {
      action: "onDelete",
      name: "delete-smart-group",
      mission: "ec-smart-group",
      provider: "SmartObjectVPLEditor",
    },
    {
      action: "onEdit",
      name: "rename-smart-group",
      mission: "ec-smart-group",
      provider: "SmartObjectVPLEditor",
    },
  ],
};
