import * as Blockly from 'blockly';


export const ConditionalStaticBlocks = [
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
        }),
        debugGen: () => (function(block) {
            var code = 'code...';
            return [code, Blockly.JavaScript.ORDER_NONE];
        })
    },
    {
        name: 'Conditional_When_Top_Bottom',
        uniqueInstance: true, 
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
        uniqueInstance: true,
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
        uniqueInstance: true,
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
        uniqueInstance: true,
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
    }
];