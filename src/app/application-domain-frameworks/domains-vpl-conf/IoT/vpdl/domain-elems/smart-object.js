import * as Blockly from 'blockly';

var definedOnce = false;

export const SmartObject = {
    name: 'SmartObject',
    blocklyElems: [
        {
            name: 'getValue',
            uniqueInstance: false,
            // use for special cases of properties of properies VPL domain elements
            // (optional use) here we use it for example in properties of VPL domains elements (Smart Object properties)
            // this would be required in case if there was (Smart Object properties of properties)
            multiBlocksDef: (data) => {
                let blocks = {};

                data.details.properties.forEach(property => {
                    blocks[property.name] = {
                        init: function() {
                            this.appendDummyInput()
                                .appendField(new Blockly.FieldImage(data.img, 20, 20, { alt: "*", flipRtl: "FALSE" }))
                                .appendField(data.title)
                                .appendField("get ")
                                .appendField(new Blockly.FieldDropdown([[property.name, property.name.toUpperCase()]]), "PROPERTIES");
                            this.setOutput(true, "getter");
                            this.setColour(240);
                            this.setTooltip("");
                            this.setHelpUrl("");
                        }
                    }; 
                });

                return blocks;
            },
            codeGen: (data) => {
                let codes = {};
                
                data.details.properties.forEach(property => {
                    let funcCode = (block) => {
                        let code = 'await SmartObjects["' + data.name + '"]' +
                            '.getValue("' + property.nane + '");';
                        
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }

                    codes[property.name] = funcCode;
                });
                
                return codes;
            }
        },
        // way to define getter without multiple 
        {
            name: 'getValueBlock',
            uniqueInstance: false,
            blockDef: (data) => {
                let dropdownSel = [];

                data.details.properties.forEach(property => {
                    dropdownSel.push([property.name, property.name.toUpperCase()]);
                });

                return {
                    init: function() {
                        this.appendDummyInput()
                            .appendField(new Blockly.FieldImage(data.img, 20, 20, { alt: "*", flipRtl: "FALSE" }))
                            .appendField(data.title)
                            .appendField("get ")
                            .appendField(new Blockly.FieldDropdown(dropdownSel), "PROPERTIES");
                        this.setOutput(true, "getter");
                        this.setColour(240);
                        this.setTooltip("");
                        this.setHelpUrl("");
                    }
                };
            },
            codeGen: (data) => {
                let code = "...";
                
                data.details.properties.forEach(property => {
                    //code generation based on the choice
                });
                
                return [code, Blockly.JavaScript.ORDER_NONE];;
            },
            debugGen: (data) => {
                let code = "...";
                
                data.details.properties.forEach(property => {
                    //code generation based on the choice
                });
                
                return [code, Blockly.JavaScript.ORDER_NONE];;
            // object
            }
        }
    ],
    // reteElements: [
    //     {
    //         nodeDef: (data) => { /** */ },
    //         codeGen: (data) => {},
    //         debugGen: (data) => {}
    //     }

    // ],
    signals: [
        {
            action: 'onCreate',
            name: 'create-smart-object',
            mission: 'ec-smart-object',
            provider: 'SmartObjectVPLEditor'
        },
        {
            action: 'onDelete',
            name: 'delete-smart-object',
            mission: 'ec-smart-object',
            provider: 'SmartObjectVPLEditor'
        },
        {
            action: 'onEdit',
            name: 'rename-smart-object',
            mission: 'ec-smart-object',
            provider: 'SmartObjectVPLEditor'
        }
    ]
};
