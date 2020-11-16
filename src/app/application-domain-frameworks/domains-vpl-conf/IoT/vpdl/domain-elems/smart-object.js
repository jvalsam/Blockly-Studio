import * as Blockly from 'blockly';

export const SmartObject = {
    name: 'SmartObject',
    blocklyElems: [
        {
            name: 'getValue',
            multiBlocksDef: (data) => {
                let blocks = {};

                for (let prop in data.object.properties) {
                    blocks[prop] = {
                        init: function() {
                            this.jsonInit({
                                "type": "getter",
                                "message0": "%1 " + data.name + ' get ' + prop + "()",
                                "args0": [
                                    {
                                        "type": "field_image",
                                        "src": data.image,
                                        "width": 15,
                                        "height": 15,
                                        "alt": "*"
                                    }
                                ],
                                "output": "getter",
                                "colour": data.colour || 210,
                                "tooltip": data.name,
                                "helpUrl": data.helpUrl || ''
                            });
                        }
                    };
                }

                return blocks;
            },
            codeGen: (data) => {
                let codes = {};
                
                for (let prop in data.object.properties) {
                    let funcCode = (block) => {
                        let code = 'await SmartObjects["' + data.name + '"]' +
                            '.getValue("' + prop + '");';
                        
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }

                    codes[prop] = funcCode;
                }
                
                return codes;
            }
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
        },
        {
            name: 'setValue',
            multiBlocksDef: (data) => {
                let blocks = {};

                for (let propName in data.object.meta_properties) {
                    let property = data.object.meta_properties[propName];
                    
                    property.type = property.type.charAt(0).toUpperCase() +
                                     property.type.slice(1);

                    if (property.type === 'Function') continue;
                    
                    let args0 = [
                        {
                            "type": "field_image",
                            "src": data.image,
                            "width": 15,
                            "height": 15,
                            "alt": "*"
                        }
                    ];
                    
                    if (property.type === 'Enum') {
                        let elem = {};
                        elem.type = 'field_dropdown';
                        elem.name = 'setValue'+propName;
                        elem.options = [];
                        property.possible_values.forEach(value =>
                            elem.options.push([
                                value,
                                value
                            ])
                        );

                        args0.push(elem);
                    }
                    else {
                        let elem = {
                            type: "input_value",
                            name: 'setValue'+propName,
                            check: [
                                property.type
                            ]
                        };
                        
                        args0.push(elem);
                    }
                    
                    blocks[propName] = {
                        init: function() {
                            this.jsonInit({
                                "type": "setter",
                                "message0": "%1 set" + propName + " %2",
                                "args0": args0,
                                "previousStatement": null,
                                "nextStatement": null,
                                "colour": data.colour || 210,
                                "tooltip": data.name,
                                "helpUrl": data.helpUrl || ''
                            });
                        }
                    };
                }

                return blocks;
            },
            codeGen: (data) => {
                let codes = {};
                
                for (let propName in data.object.properties) {
                    let funcCode = function (block) {
                        let value = Blockly.JavaScript.valueToCode(
                            block,
                            'setValue'+propName,
                            Blockly.JavaScript.ORDER_ATOMIC
                        );

                        let code = 'await SmartObjects["' + data.name + '"]' +
                            '.setValue("' + propName + ', ' + value + '");';
                        
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    };
                    codes[propName] = funcCode;
                }
                
                return codes;
            }
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
        }
        // { // block that end-user builds the condition event
        //     name: "condition_event_so",
        //     blockDef: (data) => ({/* TODO */}),
        //     codeGen: (data) => (function(block) {/* TODO */})
        // }
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
