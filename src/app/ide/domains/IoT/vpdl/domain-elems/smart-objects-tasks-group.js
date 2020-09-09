export const SmartObjectsTasksGroup = {
    name: 'SmartObjectsTasksGroup',
    blocklyElems: [
        {
            name: 'run_group_tasks',
            blockDef: (data) => ({
                init: function() {
                    this.appendDummyInput()
                        .appendField(
                            new Blockly.FieldImage(
                                data.elem.image,
                                15,
                                15,
                                {
                                    alt: "*",
                                    flipRtl: "FALSE"
                                }
                            )
                        )
                        .appendField("Run group: ")
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
                var code = '';
                
                data.tasks.forEach(taskName =>
                    code += 'tasks [' + taskName + ']();\n'
                );
                
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
            //, debugGen: (data) => open blockly instance editor & highlight 
            // project manager item of the group ?
        }
    ],
    signals: [
        {
            action: 'onCreate',
            name: 'create-smart-objects-tasks-group'
        },
        {
            action: 'onDelete',
            name: 'delete-smart-objects-tasks-group'
        },
        {
            action: 'onRename',
            name: 'rename-smart-objects-tasks-group'
        }
    ]
};
