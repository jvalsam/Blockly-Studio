import * as Blockly from 'blockly';

var definedOnce = false;

export const SmartObject = {
    name: 'SmartObject',
    blocklyElems: [
        // Conditional Blocks
        {
            name: 'Conditional_When',
            blockDef: () => ({
                init: function() {
                    this.appendDummyInput()
                        .appendField("When");
                    this.appendValueInput("condition")
                        .setCheck(["so_relational_operators", "so_logical_operators", "so_changes"]);
                    this.appendDummyInput()
                        .appendField("then");
                    this.appendStatementInput("statements")
                        .setCheck(null);
                    this.setInputsInline(true);
                    this.setColour(75);
                    this.setTooltip("");
                    this.setHelpUrl("");
                }
            }),
            codeGen: () => (function(block) {
                var code = 'code...';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
        },
        {
            name: 'Conditional_When_Top_Bottom',
            blockDef: () => ({
                init: function() {
                    this.appendDummyInput()
                        .appendField("When");
                    this.appendValueInput("condition")
                        .setCheck(["so_relational_operators", "so_logical_operators", "so_changes"]);
                    this.appendDummyInput()
                        .appendField("then");
                    this.appendStatementInput("statements")
                        .setCheck(null);
                    this.setInputsInline(true);
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setColour(75);
                    this.setTooltip("");
                    this.setHelpUrl("");
                }
            }),
            codeGen: () => (function(block) {
                var code = 'code...';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
        },
        {
            name: 'so_logical_operators',
            blockDef: () => ({
                init: function() {
                    this.appendValueInput("LEFT")
                        .setCheck(["so_relational_operators", "so_logical_operators"]);
                    this.appendDummyInput()
                        .appendField(new Blockly.FieldDropdown([["and","AND"], ["or","OR"]]), "OPERATORS");
                    this.appendValueInput("RIGHT")
                        .setCheck(["so_relational_operators", "so_logical_operators"]);
                    this.setInputsInline(true);
                    this.setOutput(true, "so_logical_operators");
                    this.setColour(0);
                    this.setTooltip("");
                    this.setHelpUrl("");
                }
            }),
            codeGen: () => (function(block) {
                var code = 'code...';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
        },
        {
            name: 'so_relational_operators',
            blockDef: () => ({
                init: function() {
                    this.appendValueInput("left_value")
                        .setCheck("getter");
                    this.appendDummyInput()
                        .appendField(new Blockly.FieldDropdown([["=","EQUAL"], ["≠","NOTEQUAL"], [">","GREATER"], ["<","LESS"], ["≥","GREATERTHAN"], ["≤","LESSTHAN"]]), "OPERATORS");
                    this.appendValueInput("right_value")
                        .setCheck(["String", "Boolean", "Number", "getter"]);
                    this.setInputsInline(true);
                    this.setOutput(true, "so_relational_operators");
                    this.setColour(0);
                    this.setTooltip("");
                    this.setHelpUrl("");
                }
            }),
            codeGen: () => (function(block) {
                var code = 'code...';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
        },
        {
            name: 'so_changes',
            blockDef: () => ({
                init: function() {
                    this.appendValueInput("NAME")
                        .setCheck("getter");
                    this.appendDummyInput()
                        .appendField("changes");
                    this.setInputsInline(true);
                    this.setOutput(true, "so_changes");
                    this.setColour(0);
                    this.setTooltip("");
                    this.setHelpUrl("");
                }
            }),
            codeGen: () => (function(block) {
                var code = 'code...';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
        },
        // Calendar Blocks

        // Handle Smart Objects
        {
            name: 'getValue',
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
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
        },
        // way to define getter without multiple 
        {
            name: 'getValueBlock',
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
            }
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
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
