'use strict';
import {
    RuntimeManager
} from "../../../../../../run-time-system-manager/run-time-manager";
import * as Blockly from 'blockly';

Blockly.JavaScript['lists_lengthDEBUG'] = function (block) {
    // String or array length.
    // old blockly
    // var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
    //     Blockly.JavaScript.ORDER_FUNCTION_CALL) || '[]';
    var list = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '[]';
    return ['(' + list + ')' + '.length', Blockly.JavaScript.ORDER_MEMBER];
};
Blockly.JavaScript['lists_lengthRELEASE'] =
    Blockly.JavaScript['lists_length'];
Blockly.JavaScript['lists_length'] = function (block) {
    return Blockly.JavaScript['lists_length'+RuntimeManager.getMode()](block);
}

Blockly.JavaScript['lists_isEmptyDEBUG'] = function (block) {
    // Is the string null or array empty?
    var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '[]';
    //return ['var ' + my_list + ' = ' + argument0 + ';\n' + '!' + my_list + '.length', Blockly.JavaScript.ORDER_LOGICAL_NOT];
    return ['!' + '(' + argument0 + ')' + '.length', Blockly.JavaScript.ORDER_LOGICAL_NOT];
};
Blockly.JavaScript['lists_isEmptyRELEASE'] =
    Blockly.JavaScript['lists_isEmpty'];
Blockly.JavaScript['lists_isEmpty'] = function (block) {
    return Blockly.JavaScript['lists_isEmpty'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['lists_indexOfDEBUG'] = function (block) {
    // Find an item in the list.
    var operator = block.getFieldValue('END') == 'FIRST' ?
        'indexOf' : 'lastIndexOf';
    var item = Blockly.JavaScript.valueToCode(block, 'FIND',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    var list = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '[]';
    // var code = '(' + list  + ')' + '.' + operator + '(' + item + ') + 1';
    // return [code, Blockly.JavaScript.ORDER_MEMBER];
    var code = '(' + list + ')' + '.' + operator + '(' + item + ')';
    if (block.workspace.options.oneBasedIndex) {
        return [code + ' + 1', Blockly.JavaScript.ORDER_ADDITION];
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['lists_indexOfRELEASE'] =
    Blockly.JavaScript['lists_indexOf'];
Blockly.JavaScript['lists_indexOf'] = function (block) {
    return Blockly.JavaScript['lists_indexOf'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['lists_getIndexDEBUG'] = function (block) {
    // Get element at index.
    // Note: Until January 2013 this block did not have MODE or WHERE inputs.
    var mode = block.getFieldValue('MODE') || 'GET';
    var where = block.getFieldValue('WHERE') || 'FROM_START';
    var listOrder = (where == 'RANDOM') ? Blockly.JavaScript.ORDER_COMMA :
        Blockly.JavaScript.ORDER_MEMBER;
    var list = Blockly.JavaScript.valueToCode(block, 'VALUE', listOrder) || '[]';
    list = '(' + list + ')';
    switch (where) {
        case ('FIRST'):
            if (mode == 'GET') {
                var code = list + '[0]';
                return [code, Blockly.JavaScript.ORDER_MEMBER];
            } else if (mode == 'GET_REMOVE') {
                var code = list + '.shift()';
                return [code, Blockly.JavaScript.ORDER_MEMBER];
            } else if (mode == 'REMOVE') {
                return list + '.shift();\n';
            }
            break;
        case ('LAST'):
            if (mode == 'GET') {
                var code = list + '.slice(-1)[0]';
                return [code, Blockly.JavaScript.ORDER_MEMBER];
            } else if (mode == 'GET_REMOVE') {
                var code = list + '.pop()';
                return [code, Blockly.JavaScript.ORDER_MEMBER];
            } else if (mode == 'REMOVE') {
                return list + '.pop();\n';
            }
            break;
        case ('FROM_START'):
            var at = Blockly.JavaScript.getAdjusted(block, 'AT');
            if (mode == 'GET') {
                var code = list + '[' + at + ']';
                return [code, Blockly.JavaScript.ORDER_MEMBER];
            } else if (mode == 'GET_REMOVE') {
                var code = list + '.splice(' + at + ', 1)[0]';
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            } else if (mode == 'REMOVE') {
                return list + '.splice(' + at + ', 1);\n';
            }
            break;
        case ('FROM_END'):
            var at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, true);
            if (mode == 'GET') {
                var code = list + '.slice(' + at + ')[0]';
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            } else if (mode == 'GET_REMOVE') {
                var code = list + '.splice(' + at + ', 1)[0]';
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            } else if (mode == 'REMOVE') {
                return list + '.splice(' + at + ', 1);';
            }
            break;
        case ('RANDOM'):
            var functionName = Blockly.JavaScript.provideFunction_(
                'listsGetRandomItem',
                ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
                    '(list, remove) {',
                    '  var x = Math.floor(Math.random() * list.length);',
                    '  if (remove) {',
                    '    return list.splice(x, 1)[0];',
                    '  } else {',
                    '    return list[x];',
                    '  }',
                    '}']);
            code = functionName + '(' + list + ', ' + (mode != 'GET') + ')';
            if (mode == 'GET' || mode == 'GET_REMOVE') {
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            } else if (mode == 'REMOVE') {
                return code + ';\n';
            }
            break;
    }
    throw 'Unhandled combination (lists_getIndex).';
};
Blockly.JavaScript['lists_getIndexRELEASE'] =
    Blockly.JavaScript['lists_getIndex'];
Blockly.JavaScript['lists_getIndex'] = function (block) {
    return Blockly.JavaScript['lists_getIndex'+RuntimeManager.getMode()](block);
}

Blockly.JavaScript['lists_setIndexDEBUG'] = function (block) {
    // Set element at index.
    // Note: Until February 2013 this block did not have MODE or WHERE inputs.
    var list = Blockly.JavaScript.valueToCode(block, 'LIST',
        Blockly.JavaScript.ORDER_MEMBER) || '[]';
    var mode = block.getFieldValue('MODE') || 'GET';
    var where = block.getFieldValue('WHERE') || 'FROM_START';
    var value = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    // Closure, which accesses and modifies 'list'.

    list = '(' + list + ')';
    function cacheList() {
        if (list.match(/^\w+$/)) {
            return '';
        }
        var listVar = Blockly.JavaScript.variableDB_.getDistinctName(
            'tmpList', Blockly.Variables.NAME_TYPE);
        var code = 'var ' + listVar + ' = ' + list + ';\n';
        list = listVar;
        return code;
    }
    switch (where) {
        case ('FIRST'):
            if (mode == 'SET') {
                return list + '[0] = ' + value + ';\n';
            } else if (mode == 'INSERT') {
                return list + '.unshift(' + value + ');\n';
            }
            break;
        case ('LAST'):
            if (mode == 'SET') {
                var code = cacheList();
                code += list + '[' + list + '.length - 1] = ' + value + ';\n';
                return code;
            } else if (mode == 'INSERT') {
                return list + '.push(' + value + ');\n';
            }
            break;
        case ('FROM_START'):
            var at = Blockly.JavaScript.getAdjusted(block, 'AT');
            if (mode == 'SET') {
                return list + '[' + at + '] = ' + value + ';\n';
            } else if (mode == 'INSERT') {
                return list + '.splice(' + at + ', 0, ' + value + ');\n';
            }
            break;
        case ('FROM_END'):
            var at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, false,
                Blockly.JavaScript.ORDER_SUBTRACTION);
            var code = cacheList();
            if (mode == 'SET') {
                code += list + '[' + list + '.length - ' + at + '] = ' + value + ';\n';
                return code;
            } else if (mode == 'INSERT') {
                code += list + '.splice(' + list + '.length - ' + at + ', 0, ' + value +
                    ');\n';
                return code;
            }
            break;
        case ('RANDOM'):
            var code = cacheList();
            var xVar = Blockly.JavaScript.variableDB_.getDistinctName(
                'tmpX', Blockly.Variables.NAME_TYPE);
            code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
                '.length);\n';
            if (mode == 'SET') {
                code += list + '[' + xVar + '] = ' + value + ';\n';
                return code;
            } else if (mode == 'INSERT') {
                code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
                return code;
            }
            break;
    }
    throw 'Unhandled combination (lists_setIndex).';
};
Blockly.JavaScript['lists_setIndexRELEASE'] =
    Blockly.JavaScript['lists_setIndex'];
Blockly.JavaScript['lists_setIndex'] = function (block) {
    return Blockly.JavaScript['lists_setIndex'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['lists_splitDEBUG'] = function (block) {
    // Block for splitting text into a list, or joining a list into text.
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT',
        Blockly.JavaScript.ORDER_MEMBER);
    var delimiter = Blockly.JavaScript.valueToCode(block, 'DELIM',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    var mode = block.getFieldValue('MODE');
    if (mode == 'SPLIT') {
        if (!input) {
            input = '\'\'';
        }
        var functionName = 'split';
    } else if (mode == 'JOIN') {
        if (!input) {
            input = '[]';
        }
        var functionName = 'join';
    } else {
        throw 'Unknown mode: ' + mode;
    }
    var code = '(' + input + ')' + '.' + functionName + '(' + delimiter + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['lists_splitRELEASE'] =
    Blockly.JavaScript['lists_split'];
Blockly.JavaScript['lists_split'] = function (block) {
    return Blockly.JavaScript['lists_split'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['lists_reverseDEBUG'] = function (block) {
    // Block for reversing a list.
    var list = Blockly.JavaScript.valueToCode(block, 'LIST',
        Blockly.JavaScript.ORDER_FUNCTION_CALL) || '[]';
    var code = '(' + list + ')' + '.slice().reverse()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['lists_reverseRELEASE'] =
    Blockly.JavaScript['lists_reverse'];
Blockly.JavaScript['lists_reverse'] = function (block) {
    return Blockly.JavaScript['lists_reverse'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['lists_sortDEBUG'] = function (block) {
    // Block for sorting a list.
    var list = Blockly.JavaScript.valueToCode(block, 'LIST',
        Blockly.JavaScript.ORDER_FUNCTION_CALL) || '[]';
    var direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
    var type = block.getFieldValue('TYPE');
    var getCompareFunctionName = Blockly.JavaScript.provideFunction_(
        'listsGetSortCompare',
        ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
            '(type, direction) {',
            '  var compareFuncs = {',
            '    "NUMERIC": function(a, b) {',
            '        return parseFloat(a) - parseFloat(b); },',
            '    "TEXT": function(a, b) {',
            '        return a.toString() > b.toString() ? 1 : -1; },',
            '    "IGNORE_CASE": function(a, b) {',
        '        return a.toString().toLowerCase() > ' +
        'b.toString().toLowerCase() ? 1 : -1; },',
            '  };',
            '  var compare = compareFuncs[type];',
            '  return function(a, b) { return compare(a, b) * direction; }',
            '}']);
    return ['(' + list + ')' + '.slice().sort(' +
        getCompareFunctionName + '("' + type + '", ' + direction + '))',
    Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['lists_sortRELEASE'] =
    Blockly.JavaScript['lists_sort'];
Blockly.JavaScript['lists_sort'] = function (block) {
    return Blockly.JavaScript['lists_sort'+RuntimeManager.getMode()](block);
};
