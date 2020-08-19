import * as Blockly from 'blockly';

export const BlocklyTask = {
    name: 'de-blockly-task',
    blocklyElems: [
        {
            name: 'run_task',
            blockDef: (data) => ({
                init: function() {
                    this.appendDummyInput()
                        .appendField(
                            new Blockly.FieldImage(
                                'https://img.icons8.com/ios-filled/50/000000/playstore.png',
                                15,
                                15,
                                {
                                    alt: "*",
                                    flipRtl: "FALSE"
                                }
                            )
                        )
                        .appendField("Run task:")
                        .appendField(
                            new Blockly.FieldLabel(
                                data.taskName,
                                data.elem.labelStyle //TODO: fix style
                            )
                        );
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setColour(data.elem.colour || 223);
                    this.setTooltip(data.elem.tooltip || '');
                    this.setHelpUrl(data.elem.tooltip || '');
                }
            }),
            codeGen: (data) => (function(block) {
                var code = 'tasks [' + data.taskName + ']();';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
        }
    ],
    signals: [
        {
            action: 'onCreate',
            name: 'create-blockly-task',
            mission: 'ec-blockly-task',
            provider: 'BlocklyVPL'
        },
        {
            action: 'onDelete',
            name: 'delete-blockly-task',
            mission: 'ec-blockly-task',
            provider: 'BlocklyVPL'
        },
        {
            action: 'onEdit',
            name: 'rename-blockly-task',
            mission: 'ec-blockly-task',
            provider: 'BlocklyVPL'
        }
    ]
};
