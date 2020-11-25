import * as Blockly from "blockly";

export const SmartGroup = {
  name: "SmartGroup",
  blocklyElems: [
    // way to define getter without multiple
    {
      name: "getValueBlock",
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
              .appendField(data.title)
              .appendField("get ")
              .appendField(
                new Blockly.FieldDropdown(dropdownSel),
                "PROPERTIES"
              );
            this.setOutput(true, "getter");
            this.setColour(240);
            this.setTooltip("");
            this.setHelpUrl("");
          },
        };
      },
      codeGen: (data) => {
        let code = "...";

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });

        return [code, Blockly.JavaScript.ORDER_NONE];
      },
      debugGen: (data) => {
        let code = "...";

        data.details.properties.forEach((property) => {
          //code generation based on the choice
        });

        return [code, Blockly.JavaScript.ORDER_NONE];
        // object
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
