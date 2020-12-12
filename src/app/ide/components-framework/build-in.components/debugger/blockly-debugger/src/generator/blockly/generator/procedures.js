import { RuntimeManager } from "../../../../../../run-time-system-manager/run-time-manager";
import { generation } from '../blockly_init.js'
import * as Blockly from 'blockly';

Blockly.JavaScript['procedures_defreturnDEBUG'] = function (block) {
    // Define a procedure with a return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
        var id = block.id.replace(/\$/g, '$$$$');  // Issue 251.
        branch = Blockly.JavaScript.prefixLines(
            Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g, 'eval(update_values()), await wait(' + "0" + ', \'' + id + '\', \'' + generation.currentSystemEditorId + '\')'
            ), Blockly.JavaScript.INDENT) + branch;
    }

    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
        branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
            '\'' + block.id + '\'') + branch;
    }
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
        Blockly.JavaScript.ORDER_NONE) || '';

    if (returnValue)
        returnValue = '  return Blockly_Debuggee.function_return_decorator(' + returnValue + ', caller_nest);\n';
    else
        returnValue = '  return Blockly_Debuggee.function_return_decorator( \'\', caller_nest);\n';

    var args = [];
    for (var i = 0; i < block.arguments_.length; i++) {
        args[i] = Blockly.JavaScript.variableDB_.getName(block.arguments_[i],
            Blockly.Variables.NAME_TYPE);
    }
    var code = 'async function ' + funcName + '(' + args.join(', ') + ') {\n' +
        '  let caller_nest = Blockly_Debuggee.state.currNest;\n' +
        '  if(isStepOver() || isStepParent()) Blockly_Debuggee.state.currNest = -1;\n' +
        branch +
        returnValue + '}';
    code = Blockly.JavaScript.scrub_(block, code);
    // Add % so as not to collide with helper functions in definitions list.
    Blockly.JavaScript.definitions_['%' + funcName] = code;
    return null;
};
Blockly.JavaScript['procedures_defreturnRELEASE'] =
    Blockly.JavaScript['procedures_defreturn'];
Blockly.JavaScript['procedures_defreturn'] = function (block) {
    return Blockly.JavaScript['procedures_defreturn'+RuntimeManager.getMode()].bind(this)(block);
};

Blockly.JavaScript['procedures_defnoreturn'] =
    Blockly.JavaScript['procedures_defreturn'];

// function call 
Blockly.JavaScript['procedures_callreturnDEBUG'] = function (block) {
    // Call a procedure with a return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
            Blockly.JavaScript.ORDER_COMMA) || 'null';
    }
    var code = "await " + funcName + '(' + args.join(', ') + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['procedures_callreturnRELEASE'] =
    Blockly.JavaScript['procedures_callreturn'];
Blockly.JavaScript['procedures_callreturn'] = function (block) {
    return Blockly.JavaScript['procedures_callreturn'+RuntimeManager.getMode()].bind(this)(block);
};

Blockly.JavaScript['procedures_callnoreturnDEBUG'] = function (block) {
    // Call a procedure with no return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
            Blockly.JavaScript.ORDER_COMMA) || 'null';
    }
    var code = "await " + funcName + '(' + args.join(', ') + ');\n';
    return code;
};
Blockly.JavaScript['procedures_callnoreturnRELEASE'] =
    Blockly.JavaScript['procedures_callnoreturn'];
Blockly.JavaScript['procedures_callnoreturn'] = function (block) {
    return Blockly.JavaScript['procedures_callnoreturn'+RuntimeManager.getMode()].bind(this)(block);
};

Blockly.JavaScript['procedures_ifreturnDEBUG'] = function (block) {
    // Conditionally return value from a procedure.
    var condition = Blockly.JavaScript.valueToCode(block, 'CONDITION',
        Blockly.JavaScript.ORDER_NONE) || 'false';
    var code = 'if (' + condition + ') {\n';
    if (block.hasReturnValue_) {
        var value = Blockly.JavaScript.valueToCode(block, 'VALUE',
            Blockly.JavaScript.ORDER_NONE) || 'null';
        code += '  return Blockly_Debuggee.function_return_decorator(' + value + ', caller_nest);\n';
    } else {
        code += '  return Blockly_Debuggee.function_return_decorator(\'\', caller_nest);\n';
    }
    code += '}\n';
    return code;
};
Blockly.JavaScript['procedures_ifreturnRELEASE'] =
    Blockly.JavaScript['procedures_ifreturn'];
Blockly.JavaScript['procedures_ifreturn'] = function (block) {
    return Blockly.JavaScript['procedures_ifreturn'+RuntimeManager.getMode()].bind(this)(block);
};
