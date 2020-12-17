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

    //     // if the blocks must not be generated, return empty map
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
        let propertiesValueType = {};

        data.details.properties.forEach((property) => {
          dropdownSel.push([property.name, property.name]);
          let propertyType = typeof property.value;
          propertiesValueType[property.name] =
            propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
        });

        if (dropdownSel.length === 0) return null;
        return {
          updateConnections: function (newValue) {
            this.setOutput(true, propertiesValueType[newValue]);
            this.setTooltip("Output type: " + propertiesValueType[newValue]);
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
              .appendField(" get value from")
              .appendField(
                new Blockly.FieldDropdown(dropdownSel, this.validate),
                "PROPERTIES"
              );
            this.setOutput(true, propertiesValueType[dropdownSel[0][1]]);
            this.setColour(240);
            this.setTooltip(
              "Output type: " + propertiesValueType[dropdownSel[0][1]]
            );
            this.setHelpUrl("");
            // pass data to codeGen
            this.soData = data;
          },
        };
      },
      codeGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");

        // (function () {
        //   let property = devicesOnAutomations
        //     .find(
        //       (device) => device.id === block.soData.details.iotivityResourceID
        //     )
        //     .properties.find((prop) => prop.name === dropdown_properties);
        //   return property.value;
        // })()

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let property = devicesOnAutomations";
        strBuilder += ".find(";
        strBuilder +=
          "(device) => device.id === " +
          JSON.stringify(block.soData.details.iotivityResourceID);
        strBuilder += ")";
        strBuilder +=
          ".properties.find((prop) => prop.name === " +
          JSON.stringify(dropdown_properties) +
          ");";
        strBuilder += "return property.value;";
        strBuilder += "})()";

        var code = strBuilder + "\n";
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
          if (property.type === "boolean") {
            dropdownSel.push([property.name, property.name]);
          }
        });

        // check if we have properties for these blocks
        if (dropdownSel.length === 0) return null;

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
            this.setOutput(true, "Boolean");
            this.setColour(230);
            this.setTooltip("Output type: Boolean");
            this.setHelpUrl("");
            // pass data to codeGen
            this.soData = data;
          },
        };
      },
      codeGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");

        // (function () {
        //   let property = devicesOnAutomations
        //     .find(
        //       (device) => device.id === block.soData.details.iotivityResourceID
        //     )
        //     .properties.find((prop) => prop.name === dropdown_properties);
        //   return property.value ? true : false;
        // })()

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let property = devicesOnAutomations";
        strBuilder += ".find(";
        strBuilder +=
          "(device) => device.id === " +
          JSON.stringify(block.soData.details.iotivityResourceID);
        strBuilder += ")";
        strBuilder +=
          ".properties.find((prop) => prop.name === " +
          JSON.stringify(dropdown_properties) +
          ");\n";
        strBuilder += "return property.value;";
        strBuilder += "})()";

        var code = strBuilder + "\n";
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
            dropdownSel.push([property.name, property.name]);
            let propertyType = typeof property.value;
            propertiesValueType[property.name] =
              propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
          }
        });

        // check if we have properties for these blocks
        if (dropdownSel.length === 0) return null;

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
              .appendField(data.title + ":")
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
            // pass data to codeGen
            this.soData = data;
          },
        };
      },
      codeGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");

        var value_value = Blockly.JavaScript.valueToCode(
          block,
          "VALUE_INPUT",
          Blockly.JavaScript.ORDER_ATOMIC
        );

        let checkArray = block.getInput("VALUE_INPUT").connection.getCheck();

        // TODO: console warning when the value is number and < minimum or > maximum

        // (function () {
        //   let args = [];
        //   let property = devicesOnAutomations
        //     .find(
        //       (device) => device.id === block.soData.details.iotivityResourceID
        //     )
        //     .properties.find((prop) => prop.name === dropdown_properties);
        //   if (checkArray[0] === "Number") {
        //     let number = parseFloat(value_value);
        //     // check for minimum and maximum values
        //     if (
        //       property.options.minimum_value &&
        //       number < property.options.minimum_value
        //     ) {
        //       args.push(property.options.minimum_value);
        //     } else if (
        //       property.options.maximum_value &&
        //       number > property.options.maximum_value
        //     ) {
        //       args.push(property.options.maximum_value);
        //     } else {
        //       args.push(number);
        //     }
        //   } else if (checkArray[0] === "Boolean") {
        //     args.push(value_value === "true" ? true : false);
        //   } else if (checkArray[0] === "String") {
        //     args.push(value_value);
        //   }
        //   // change value in data and then send request
        //   if (property.value !== args[0]) {
        //     property.value = args[0];
        //     let oldDeviceIndex = devicesOnAutomations.findIndex(
        //       (elem) => elem.id === block.soData.details.iotivityResourceID
        //     );
        //     CreateDeviceBubbleForLog(
        //       data.title,
        //       data.img,
        //       bgColor,
        //       "Text",
        //       () =>
        //         runTimeData.RuntimeEnvironmentRelease.browseBlocklyBlock(
        //           projectElementId,
        //           block.blockId
        //         )
        //     );
        //     RerenderDevice(devicesOnAutomations[oldDeviceIndex], [property]);
        //   }
        //   PostRequest(
        //     "http://" + urlInfo.iotivityUrl + "/resource/execute-method",
        //     {
        //       resourceId: block.soData.details.iotivityResourceID,
        //       methodId:
        //         "method-" +
        //         block.soData.details.iotivityResourceID +
        //         "-set-" +
        //         dropdown_properties,
        //       arguments: JSON.stringify(args),
        //     }
        //   );
        // })();

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder += "let args = [];\n";
        strBuilder += "let property = devicesOnAutomations";
        strBuilder += ".find(";
        strBuilder +=
          "(device) => device.id === " +
          JSON.stringify(block.soData.details.iotivityResourceID);
        strBuilder += ")";
        strBuilder +=
          ".properties.find((prop) => prop.name === " +
          JSON.stringify(dropdown_properties) +
          ");\n";
        strBuilder += "if ('" + checkArray[0] + '\' === "Number") {';
        strBuilder += "let number = parseFloat(" + value_value + ");\n";
        strBuilder += "if (";
        strBuilder += "property.options.minimum_value && ";
        strBuilder += "number < property.options.minimum_value";
        strBuilder += ") {";
        strBuilder += "args.push(property.options.minimum_value);\n";
        strBuilder += "} else if (";
        strBuilder += "property.options.maximum_value && ";
        strBuilder += "number > property.options.maximum_value";
        strBuilder += ") {";
        strBuilder += "args.push(property.options.maximum_value);\n";
        strBuilder += "} else {";
        strBuilder += "args.push(number);\n";
        strBuilder += "}\n";
        strBuilder +=
          "} else if (" + JSON.stringify(checkArray[0]) + ' === "Boolean") {';
        strBuilder +=
          "args.push(" + value_value + ' === "true" ? true : false);\n';
        strBuilder +=
          "} else if (" + JSON.stringify(checkArray[0]) + ' === "String") {';
        strBuilder += "args.push(" + value_value + ");\n";
        strBuilder += "}";
        strBuilder += "if (property.value !== args[0]) {";
        strBuilder += "CreateDeviceBubbleForLog(";
        strBuilder += JSON.stringify(block.soData.title) + ",";
        strBuilder += JSON.stringify(block.soData.img) + ",";
        strBuilder += JSON.stringify(block.soData.colour) + ",";
        strBuilder +=
          JSON.stringify("Set property ") +
          "+ property.name +" +
          JSON.stringify(": old value = <b>") +
          "+ property.value +" +
          JSON.stringify("</b>, current value =  <b>") +
          "+ args[0] +" +
          JSON.stringify("</b>") +
          ",";
        strBuilder += "() =>";
        strBuilder +=
          "runTimeData.RuntimeEnvironmentRelease.browseBlocklyBlock(";
        strBuilder += "projectElementId,";
        strBuilder += JSON.stringify(block.id);
        strBuilder += ")";
        strBuilder += ");";
        strBuilder += "property.value = args[0];\n";
        strBuilder += "let oldDeviceIndex = devicesOnAutomations.findIndex(";
        strBuilder +=
          "(elem) => elem.id === " +
          JSON.stringify(block.soData.details.iotivityResourceID);
        strBuilder += ");";
        strBuilder +=
          "RerenderDevice(devicesOnAutomations[oldDeviceIndex], [property]);";
        strBuilder += "}";
        strBuilder +=
          'PostRequest("http://" + urlInfo.iotivityUrl + "/resource/execute-method", {';
        strBuilder +=
          "resourceId: " +
          JSON.stringify(block.soData.details.iotivityResourceID) +
          ",\n";
        strBuilder +=
          "methodId: 'method-" +
          block.soData.details.iotivityResourceID +
          "-set-" +
          dropdown_properties +
          "',\n";
        strBuilder += "arguments: JSON.stringify(args),";
        strBuilder += "});\n";
        strBuilder += "})();";

        var code = strBuilder + "\n";
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
            enumeratedProps.push([property.name, property.name]);
            enumeratedPossibleValues[property.name] = [];
            // build poosible_values for each property
            property.options.possible_values.forEach((possibleValue) => {
              enumeratedPossibleValues[property.name].push([
                possibleValue,
                possibleValue,
              ]);
            });
          }
        });

        if (enumeratedProps.length === 0) return null;

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
            // pass data to codeGen
            this.soData = data;
          },
        };
      },
      codeGen: (block) => {
        var dropdown_properties = block.getFieldValue("PROPERTIES");
        var dropdown_possible_values = block.getFieldValue("POSSIBLE_VALUES");

        // (function () {
        //   let args = [dropdown_possible_values];
        //   let property = devicesOnAutomations
        //     .find(
        //       (device) => device.id === block.soData.details.iotivityResourceID
        //     )
        //     .properties.find((prop) => prop.name === dropdown_properties);
        //   if (property.value !== args[0]) {
        //     property.value = args[0];
        //     let oldDeviceIndex = devicesOnAutomations.findIndex(
        //       (elem) => elem.id === block.soData.details.iotivityResourceID
        //     );
        //     RerenderDevice(devicesOnAutomations[oldDeviceIndex], [property]);
        //   }
        //   PostRequest(
        //     "http://" + urlInfo.iotivityUrl + "/resource/execute-method",
        //     {
        //       resourceId: block.soData.details.iotivityResourceID,
        //       methodId:
        //         "method-" +
        //         data.details.iotivityResourceID +
        //         "-set-" +
        //         dropdown_properties,
        //       arguments: JSON.stringify(args),
        //     }
        //   );
        // })();

        let strBuilder = "";
        strBuilder += "(function () {";
        strBuilder +=
          "let args = [" + JSON.stringify(dropdown_possible_values) + "];\n";
        strBuilder += "let property = devicesOnAutomations";
        strBuilder += ".find(";
        strBuilder +=
          "(device) => device.id === " +
          JSON.stringify(block.soData.details.iotivityResourceID);
        strBuilder += ")";
        strBuilder +=
          ".properties.find((prop) => prop.name === " +
          JSON.stringify(dropdown_properties) +
          ");\n";
        strBuilder += "if (property.value !== args[0]) {";
        strBuilder += "CreateDeviceBubbleForLog(";
        strBuilder += JSON.stringify(block.soData.title) + ",";
        strBuilder += JSON.stringify(block.soData.img) + ",";
        strBuilder += JSON.stringify(block.soData.colour) + ",";
        strBuilder +=
          JSON.stringify("Set property ") +
          "+ property.name +" +
          JSON.stringify(": old value = <b>") +
          "+ property.value +" +
          JSON.stringify("</b>, current value =  <b>") +
          "+ args[0] +" +
          JSON.stringify("</b>") +
          ",";
        strBuilder += "() =>";
        strBuilder +=
          "runTimeData.RuntimeEnvironmentRelease.browseBlocklyBlock(";
        strBuilder += "projectElementId,";
        strBuilder += JSON.stringify(block.id);
        strBuilder += ")";
        strBuilder += ");";
        strBuilder += "property.value = args[0];";
        strBuilder += "let oldDeviceIndex = devicesOnAutomations.findIndex(";
        strBuilder +=
          "(elem) => elem.id === " +
          JSON.stringify(block.soData.details.iotivityResourceID);
        strBuilder += ");";
        strBuilder +=
          "RerenderDevice(devicesOnAutomations[oldDeviceIndex], [property]);";
        strBuilder += "}";
        strBuilder +=
          'PostRequest("http://" + urlInfo.iotivityUrl + "/resource/execute-method", {';
        strBuilder +=
          "resourceId: " +
          JSON.stringify(block.soData.details.iotivityResourceID) +
          ",\n";
        strBuilder +=
          "methodId: 'method-" +
          block.soData.details.iotivityResourceID +
          "-set-" +
          dropdown_properties +
          "',\n";
        strBuilder += "arguments: JSON.stringify(args)\n";
        strBuilder += "});";
        strBuilder += "})();";

        var code = strBuilder + "\n";
        return code;
      },
    },
    {
      name: "action",
      uniqueInstance: false,
      blockDef: (data) => {
        const actions = [];
        const argsOfActions = {};

        // Here we need to parse actions and modify blocks dynamically
        data.details.actions.forEach((action) => {
          // initialize args for every action
          argsOfActions[action.name] = { args: [] };

          action.parameters.forEach((parameter) => {
            let argType = parameter.type;
            let arg = {
              type: argType.charAt(0).toUpperCase() + argType.slice(1),
              name: parameter.name,
            };
            // check for relation of property
            // take possible values if it has
            if (parameter._UI.relation) {
              // if relation is enumerated
              let property = data.details.properties.find(
                (x) => x.name === parameter._UI.relation
              );
              if (property.type === "enumerated") {
                arg.possibleValues = [];
                property.options.possible_values.forEach((value) => {
                  arg.possibleValues.push([value, value]);
                });
              }
            }
            argsOfActions[action.name].args.push(arg);
          });
          actions.push([action.name, action.name]);
        });

        if (actions.length === 0) return null;

        return {
          updateConnections: function (newValue) {
            let inputs = [].concat(this.inputList);
            // we need only first input, remove the other inputs
            inputs.forEach((input) => {
              if (input.name !== "MAIN") {
                this.removeInput(input.name);
              }
            });
            if (argsOfActions[newValue].args.length !== 0) {
              for (let i = 0; i < argsOfActions[newValue].args.length; ++i) {
                let arg = argsOfActions[newValue].args[i];
                let input;
                if (arg.possibleValues) {
                  input = this.appendDummyInput("INPUT" + i);
                  if (i !== 0) input.appendField(",");
                  else input.appendField(" with  (");
                  input
                    .appendField(arg.name + ": ")
                    .appendField(
                      new Blockly.FieldDropdown(arg.possibleValues),
                      "ENUM" + i
                    );
                } else {
                  input = this.appendValueInput("INPUT" + i).setCheck(arg.type);
                  if (i !== 0) input.appendField(",");
                  else input.appendField(" with  (");
                  input.appendField(arg.name + ":");
                }
                if (i === argsOfActions[newValue].args.length - 1)
                  input.appendField(" ) ");
              }
            }
            // this.appendValueInput("Args")
            //   .setCheck(["Boolean", "Number", "String"])
            //   .appendField("with:");
          },
          validate: function (newValue) {
            this.getSourceBlock().updateConnections(newValue);
            return newValue;
          },
          init: function () {
            this.appendDummyInput("MAIN")
              .appendField(
                new Blockly.FieldImage(data.img, 20, 20, {
                  alt: "*",
                  flipRtl: "FALSE",
                })
              )
              .appendField(data.title)
              .appendField(
                new Blockly.FieldDropdown(actions, this.validate),
                "ACTIONS"
              );
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(135);
            this.setTooltip("");
            this.setHelpUrl("");
            // pass data to codeGen
            this.soData = data;
          },
        };
      },
      codeGen: (block) => {
        var dropdown_actions = block.getFieldValue("ACTIONS");

        // get parameters to check the length
        let parametersLength = block.soData.details.actions.find(
          (elem) => elem.name === dropdown_actions
        ).parameters.length;

        let inputsToCode = [];
        let checksArray = {};

        // get code and type from every input
        for (let i = 0; i < parametersLength; ++i) {
          if (block.getInput("INPUT" + i).type === 1) {
            // type 1
            inputsToCode.push(
              eval(
                Blockly.JavaScript.valueToCode(
                  block,
                  "INPUT" + i,
                  Blockly.JavaScript.ORDER_ATOMIC
                )
              )
            );
            checksArray["INPUT" + i] = block
              .getInput("INPUT" + i)
              .connection.getCheck();
          } else if (block.getInput("INPUT" + i).type === 5) {
            // type 5
            inputsToCode.push(block.getFieldValue("ENUM" + i));
            checksArray["INPUT" + i] = ["String"];
          }
        }

        // await(function () {
        //   new Promise((resolve) => {
        //     let args = [];
        //     for (let i = 0; i < parametersLength; ++i) {
        //       if (checksArray["INPUT" + i][0] === "Number") {
        //         let number = parseFloat(inputsToCode[i]);
        //         args.push(number);
        //       } else if (checksArray["INPUT" + i][0] === "Boolean") {
        //         args.push(inputsToCode[i] === "true" ? true : false);
        //       } else if (checksArray["INPUT" + i][0] === "String") {
        //         args.push(inputsToCode[i]);
        //       }
        //     }
        //     PostRequest(
        //       "http://" + urlInfo.iotivityUrl + "/resource/execute-method",
        //       {
        //         resourceId: block.soData.details.iotivityResourceID,
        //         methodId:
        //           "action-" +
        //           data.details.iotivityResourceID +
        //           "-" +
        //           dropdown_actions,
        //         arguments: JSON.stringify(args),
        //       }
        //     ).then(() => {

        //       resolve();
        //     });
        //   });
        // })();

        let strBuilder = "";
        strBuilder += "await(function () {\n";
        strBuilder += "new Promise((resolve) => {\n";
        strBuilder += "let args = [];\n";
        strBuilder +=
          "let inputsToCode = JSON.parse('" +
          JSON.stringify(inputsToCode) +
          "');\n";
        strBuilder +=
          "let checksArray = JSON.parse('" +
          JSON.stringify(checksArray) +
          "');\n";
        strBuilder += "for (let i = 0; i < " + parametersLength + "; ++i) {\n";
        strBuilder += 'if (checksArray["INPUT" + i][0] === "Number") {\n';
        strBuilder += "let number = parseFloat(inputsToCode[i]);\n";
        strBuilder += "args.push(number);\n";
        strBuilder +=
          '} else if (checksArray["INPUT" + i][0] === "Boolean") {\n';
        strBuilder += 'args.push(inputsToCode[i] === "true" ? true : false);\n';
        strBuilder +=
          '} else if (checksArray["INPUT" + i][0] === "String") {\n';
        strBuilder += "args.push(inputsToCode[i]);\n";
        strBuilder += "}\n";
        strBuilder += "}\n";
        strBuilder +=
          'PostRequest("http://" + urlInfo.iotivityUrl + "/resource/execute-method", {\n';
        strBuilder +=
          "resourceId: " +
          JSON.stringify(block.soData.details.iotivityResourceID) +
          ",\n";
        strBuilder +=
          "methodId: 'action-" +
          block.soData.details.iotivityResourceID +
          "-" +
          dropdown_actions +
          "',\n";
        strBuilder += "arguments: JSON.stringify(args)\n";
        strBuilder += "}).then(() => { ";
        strBuilder += "let argsStr = '';";
        strBuilder +=
          "if (args.length !== 0) argsStr += " +
          JSON.stringify("with arguments: ") +
          ";";
        strBuilder += "args.forEach((arg, idx, array) => {";
        strBuilder +=
          "argsStr += " +
          JSON.stringify("<b>") +
          " + arg +" +
          JSON.stringify("</b>") +
          ";";
        strBuilder += "if (idx !== array.length - 1) {";
        strBuilder += "argsStr += " + JSON.stringify(", ") + ";";
        strBuilder += "}";
        strBuilder += "});";
        strBuilder += "CreateDeviceBubbleForLog(";
        strBuilder += JSON.stringify(block.soData.title) + ",";
        strBuilder += JSON.stringify(block.soData.img) + ",";
        strBuilder += JSON.stringify(block.soData.colour) + ",";
        strBuilder +=
          JSON.stringify("Execute Action: <b>" + dropdown_actions + "</b>  ") +
          "+ argsStr" +
          ",";
        strBuilder += "() =>";
        strBuilder +=
          "runTimeData.RuntimeEnvironmentRelease.browseBlocklyBlock(";
        strBuilder += "projectElementId,";
        strBuilder += JSON.stringify(block.id);
        strBuilder += ")";
        strBuilder += ");";
        strBuilder += "resolve()});\n";
        strBuilder += "});\n";
        strBuilder += "})();";

        var code = strBuilder + "\n";
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
