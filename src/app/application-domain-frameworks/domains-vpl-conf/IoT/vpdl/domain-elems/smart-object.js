import * as Blockly from "blockly";

var definedOnce = false;

export const SmartObject = {
  name: "SmartObject",
  blocklyElems: [
    // {
    //   name: "getValue",
    //   uniqueInstance: false,
    //   // use for special cases of properties of properies VPL domain elements
    //   // (optional use) here we use it for example in properties of VPL domains elements (Smart Object properties)
    //   // this would be required in case if there was (Smart Object properties of properties)
    //   multiBlocksDef: (data) => {
    //     let blocks = {};

    //     data.details.properties.forEach((property) => {
    //       blocks[property.name] = {
    //         init: function () {
    //           this.appendDummyInput()
    //             .appendField(
    //               new Blockly.FieldImage(data.img, 20, 20, {
    //                 alt: "*",
    //                 flipRtl: "FALSE",
    //               })
    //             )
    //             .appendField(data.title)
    //             .appendField("get ")
    //             .appendField(
    //               new Blockly.FieldDropdown([
    //                 [property.name, property.name.toUpperCase()],
    //               ]),
    //               "PROPERTIES"
    //             );
    //           this.setOutput(true, "getter");
    //           this.setColour(240);
    //           this.setTooltip("");
    //           this.setHelpUrl("");
    //         },
    //       };
    //     });

    //     return blocks;
    //   },
    //   codeGen: (data) => {
    //     let codes = {};

    //     data.details.properties.forEach((property) => {
    //       let funcCode = (block) => {
    //         let code =
    //           'await SmartObjects["' +
    //           data.name +
    //           '"]' +
    //           '.getValue("' +
    //           property.nane +
    //           '");';

    //         return [code, Blockly.JavaScript.ORDER_NONE];
    //       };

    //       codes[property.name] = funcCode;
    //     });

    //     return codes;
    //   },
    // },
    // way to define getter without multiple
    {
      name: "getter",
      uniqueInstance: false,
      blockDef: (data) => {
        let dropdownSel = [];

        data.details.properties.forEach((property) => {
          dropdownSel.push([property.name, property.name.toUpperCase()]);
        });

        return {
          init: function () {
            this.appendDummyInput()
              .appendField(
                new Blockly.FieldImage(data.img, 20, 20, {
                  alt: "*",
                  flipRtl: "FALSE",
                })
              )
              .appendField(data.title + ":")
              .appendField(" get value from")
              .appendField(
                new Blockly.FieldDropdown(dropdownSel),
                "PROPERTIES"
              );
            this.setOutput(true, null);
            this.setColour(240);
            this.setTooltip("");
            this.setHelpUrl("");
          },
        };
      },
      codeGen: (data) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });
        // TODO: Assemble JavaScript into code variable.
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
    },
    {
      name: "getter_boolean",
      uniqueInstance: false,
      blockDef: (data) => {
        let dropdownSel = [];

        data.details.properties.forEach((property) => {
          dropdownSel.push([property.name, property.name.toUpperCase()]);
        });

        return {
          init: function () {
            this.appendDummyInput()
              .appendField("Is")
              .appendField(
                new Blockly.FieldImage(data.img, 20, 20, {
                  alt: "*",
                  flipRtl: "FALSE",
                })
              )
              .appendField(data.title)
              .appendField(
                new Blockly.FieldDropdown(dropdownSel),
                "PROPERTIES"
              );
            this.setOutput(true, "getter_boolean");
            this.setColour(230);
            this.setTooltip("");
            this.setHelpUrl("");
          },
        };
      },
      codeGen: (data) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");
        // TODO: Assemble JavaScript into code variable.
        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });
        var code = "...";
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
      },
    },
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

        let validate = function (newValue) {
          this.getSourceBlock().updateConnections(newValue);
          return newValue;
        };

        return {
          updateConnections: function (newValue) {
            if (!this.getInput("VALUE_INPUT").connection.isConnected()) {
              this.getInput("VALUE_INPUT").setCheck(
                propertiesValueType[newValue]
              );

              // TODO: not math_number we need checking
              // workspaceSVG
              let blockSVG = this.workspace.newBlock("math_number");
              blockSVG.initSvg();
              blockSVG.render();

              var outputConn = blockSVG.outputConnection;
              var input = this.getInput("VALUE_INPUT");
              var inputConn = input.connection;
              outputConn.connect(inputConn);
            }
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
                new Blockly.FieldDropdown(dropdownSel, validate),
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
            this.setTooltip("");
            this.setHelpUrl("");
          },
        };
      },
      codeGen: (data) => {
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
      codeGen: (data) => {
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
      name: "create-smart-object",
      mission: "ec-smart-object",
      provider: "SmartObjectVPLEditor",
    },
    {
      action: "onDelete",
      name: "delete-smart-object",
      mission: "ec-smart-object",
      provider: "SmartObjectVPLEditor",
    },
    {
      action: "onEdit",
      name: "rename-smart-object",
      mission: "ec-smart-object",
      provider: "SmartObjectVPLEditor",
    },
  ],
};
