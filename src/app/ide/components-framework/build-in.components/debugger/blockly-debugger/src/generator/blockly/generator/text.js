import * as Blockly from 'blockly';

Blockly.JavaScript['text_lengthDEBUG'] = function (block) {
    // String or array length.
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';
    return ['(' + text + ')' + '.length', Blockly.JavaScript.ORDER_MEMBER];
};
Blockly.JavaScript['text_lengthRELEASE'] =
    Blockly.JavaScript['text_length'];
Blockly.JavaScript['text_length'] = function (block) {
    return Blockly.JavaScript['text_length'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_isEmptyDEBUG'] = function (block) {
    // Is the string null or array empty?
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    return ['!' + '(' + text + ')' + '.length', Blockly.JavaScript.ORDER_LOGICAL_NOT];
};
Blockly.JavaScript['text_isEmptyRELEASE'] =
    Blockly.JavaScript['text_isEmpty'];
Blockly.JavaScript['text_isEmpty'] = function (block) {
    return Blockly.JavaScript['text_isEmpty'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_indexOfDEBUG'] = function (block) {
    // Search the text for a substring.
    var operator = block.getFieldValue('END') == 'FIRST' ?
        'indexOf' : 'lastIndexOf';
    var argument0 = Blockly.JavaScript.valueToCode(block, 'FIND',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    var code = '(' + argument1 + ')' + '.' + operator + '(' + argument0 + ')';
    if (block.workspace.options.oneBasedIndex) {
        return [code + ' + 1', Blockly.JavaScript.ORDER_ADDITION];
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['text_indexOfRELEASE'] =
    Blockly.JavaScript['text_indexOf'];
Blockly.JavaScript['text_indexOf'] = function (block) {
    return Blockly.JavaScript['text_indexOf'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_charAtDEBUG'] = function (block) {
    // Get letter at index.
    // Note: Until January 2013 this block did not have the WHERE input.
    var where = block.getFieldValue('WHERE') || 'FROM_START';
    var textOrder = (where == 'RANDOM') ? Blockly.JavaScript.ORDER_NONE :
        Blockly.JavaScript.ORDER_MEMBER;
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
        textOrder) || '\'\'';
    text = '(' + text + ')';
    switch (where) {
        case 'FIRST':
            var code = text + '.charAt(0)';
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        case 'LAST':
            var code = text + '.slice(-1)';
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        case 'FROM_START':
            var at = Blockly.JavaScript.getAdjusted(block, 'AT');
            // Adjust index if using one-based indices.
            var code = text + '.charAt(' + at + ')';
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        case 'FROM_END':
            var at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, true);
            var code = text + '.slice(' + at + ').charAt(0)';
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        case 'RANDOM':
            var functionName = Blockly.JavaScript.provideFunction_(
                'textRandomLetter',
                ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
                    '(text) {',
                    '  var x = Math.floor(Math.random() * text.length);',
                    '  return text[x];',
                    '}']);
            var code = functionName + '(' + text + ')';
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }
    throw 'Unhandled option (text_charAt).';
};
Blockly.JavaScript['text_charAtRELEASE'] =
    Blockly.JavaScript['text_charAt'];
Blockly.JavaScript['text_charAt'] = function (block) {
    return Blockly.JavaScript['text_charAt'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_getSubstringDEBUG'] = function (block) {
    // Get substring.
    var text = Blockly.JavaScript.valueToCode(block, 'STRING',
        Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';
    var where1 = block.getFieldValue('WHERE1');
    var where2 = block.getFieldValue('WHERE2');
    if (where1 == 'FIRST' && where2 == 'LAST') {
        var code = text;
    } else if (text.match(/^'?\w+'?$/) ||
        (where1 != 'FROM_END' && where1 != 'LAST' &&
            where2 != 'FROM_END' && where2 != 'LAST')) {
        // If the text is a variable or literal or doesn't require a call for
        // length, don't generate a helper function.
        text = '(' + text + ')';
        switch (where1) {
            case 'FROM_START':
                var at1 = Blockly.JavaScript.getAdjusted(block, 'AT1');
                break;
            case 'FROM_END':
                var at1 = Blockly.JavaScript.getAdjusted(block, 'AT1', 1, false,
                    Blockly.JavaScript.ORDER_SUBTRACTION);
                at1 = text + '.length - ' + at1;
                break;
            case 'FIRST':
                var at1 = '0';
                break;
            default:
                throw 'Unhandled option (text_getSubstring).';
        }
        switch (where2) {
            case 'FROM_START':
                var at2 = Blockly.JavaScript.getAdjusted(block, 'AT2', 1);
                break;
            case 'FROM_END':
                var at2 = Blockly.JavaScript.getAdjusted(block, 'AT2', 0, false,
                    Blockly.JavaScript.ORDER_SUBTRACTION);
                at2 = text + '.length - ' + at2;
                break;
            case 'LAST':
                var at2 = text + '.length';
                break;
            default:
                throw 'Unhandled option (text_getSubstring).';
        }
        code = text + '.slice(' + at1 + ', ' + at2 + ')';
    } else {
        text = '(' + text + ')';
        var at1 = Blockly.JavaScript.getAdjusted(block, 'AT1');
        var at2 = Blockly.JavaScript.getAdjusted(block, 'AT2');
        var getIndex_ = Blockly.JavaScript.text.getIndex_;
        var wherePascalCase = {
            'FIRST': 'First', 'LAST': 'Last',
            'FROM_START': 'FromStart', 'FROM_END': 'FromEnd'
        };
        var functionName = Blockly.JavaScript.provideFunction_(
            'subsequence' + wherePascalCase[where1] + wherePascalCase[where2],
            ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
                '(sequence' +
                // The value for 'FROM_END' and'FROM_START' depends on `at` so
                // we add it as a parameter.
                ((where1 == 'FROM_END' || where1 == 'FROM_START') ? ', at1' : '') +
                ((where2 == 'FROM_END' || where2 == 'FROM_START') ? ', at2' : '') +
                ') {',
            '  var start = ' + getIndex_('sequence', where1, 'at1') + ';',
            '  var end = ' + getIndex_('sequence', where2, 'at2') + ' + 1;',
                '  return sequence.slice(start, end);',
                '}']);
        var code = functionName + '(' + text +
            // The value for 'FROM_END' and 'FROM_START' depends on `at` so we
            // pass it.
            ((where1 == 'FROM_END' || where1 == 'FROM_START') ? ', ' + at1 : '') +
            ((where2 == 'FROM_END' || where2 == 'FROM_START') ? ', ' + at2 : '') +
            ')';
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['text_getSubstringRELEASE'] =
    Blockly.JavaScript['text_getSubstring'];
Blockly.JavaScript['text_getSubstring'] = function (block) {
    return Blockly.JavaScript['text_getSubstring'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_changeCaseDEBUG'] = function (block) {
    // Change capitalization.
    var OPERATORS = {
        'UPPERCASE': '.toUpperCase()',
        'LOWERCASE': '.toLowerCase()',
        'TITLECASE': null
    };
    var operator = OPERATORS[block.getFieldValue('CASE')];
    var textOrder = operator ? Blockly.JavaScript.ORDER_MEMBER :
        Blockly.JavaScript.ORDER_NONE;
    var text = Blockly.JavaScript.valueToCode(block, 'TEXT',
        textOrder) || '\'\'';
    if (operator) {
        // Upper and lower case are functions built into JavaScript.
        var code = '(' + text + ')' + operator;
    } else {
        // Title case is not a native JavaScript function.  Define one.
        var functionName = Blockly.JavaScript.provideFunction_(
            'textToTitleCase',
            ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
                '(str) {',
                '  return str.replace(/\\S+/g,',
            '      function(txt) {return txt[0].toUpperCase() + ' +
            'txt.substring(1).toLowerCase();});',
                '}']);
        var code = functionName + '(' + '(' + text + ')' + ')';
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['text_changeCaseRELEASE'] =
    Blockly.JavaScript['text_changeCase'];
Blockly.JavaScript['text_changeCase'] = function (block) {
    return Blockly.JavaScript['text_changeCase'+RuntimeManager.getMode()](block);
};

////

Blockly.JavaScript['text_trimDEBUG'] = function (block) {
    // Trim spaces.
    var OPERATORS = {
        'LEFT': ".replace(/^[\\s\\xa0]+/, '')",
        'RIGHT': ".replace(/[\\s\\xa0]+$/, '')",
        'BOTH': '.trim()'
    };
    var operator = OPERATORS[block.getFieldValue('MODE')];
    var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    return ['(' + argument0 + ')' + operator, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['text_trimRELEASE'] =
    Blockly.JavaScript['text_trim'];
Blockly.JavaScript['text_trim'] = function (block) {
    return Blockly.JavaScript['text_trim'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_prompt_extDEBUG'] = function (block) {
    // Prompt function.
    if (block.getField('TEXT')) {
        // Internal message.
        var msg = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
    } else {
        // External message.
        var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
            Blockly.JavaScript.ORDER_NONE) || '\'\'';
    }
    var code = '(await window.prompt(' + msg + '))';
    var toNumber = block.getFieldValue('TYPE') == 'NUMBER';
    if (toNumber) {
        code = 'parseFloat(' + code + ')';
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
Blockly.JavaScript['text_prompt_extRELEASE'] =
    Blockly.JavaScript['text_prompt_ext'];
Blockly.JavaScript['text_prompt_ext'] = function (block) {
    return Blockly.JavaScript['text_prompt_ext'+RuntimeManager.getMode()](block);
};

Blockly.JavaScript['text_prompt'] = Blockly.JavaScript['text_prompt_ext'];


Blockly.JavaScript['text_printDEBUG'] = function (block) {
    // Print statement.
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    return 'await window.alert(' + msg + ');\n';
};
Blockly.JavaScript['text_printRELEASE'] =
    Blockly.JavaScript['text_print'];
Blockly.JavaScript['text_print'] = function (block) {
    return Blockly.JavaScript['text_print'+RuntimeManager.getMode()](block);
};
