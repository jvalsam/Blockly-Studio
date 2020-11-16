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
