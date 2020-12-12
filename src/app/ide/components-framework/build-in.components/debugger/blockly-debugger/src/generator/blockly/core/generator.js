import {
    RuntimeManager
} from "../../../../../../run-time-system-manager/run-time-manager";
import { generation } from '../blockly_init.js';
import { genEval } from '../../genEval.js';
import * as Blockly from 'blockly';
/**
 * Generate code for the specified block (and attached blocks).
 * @param {Blockly.Block} block The block to generate code for.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string|!Array} For statement blocks, the generated code.
 *     For value blocks, an array containing the generated code and an
 *     operator order value.  Returns '' if block is null.
 */
Blockly.Generator.prototype.blockToCodeDEBUG = function (block, opt_thisOnly) {
    if (!block) {
        return '';
    }
    if (!block.isEnabled()) {
        // Skip past this block if it is disabled.
        return opt_thisOnly ? '' : this.blockToCode(block.getNextBlock());
    }
    if (block.isInsertionMarker()) {
        // Skip past insertion markers.
        return opt_thisOnly ? '' : this.blockToCode(block.getChildren(false)[0]);
    }

    var func = this[block.type];
    if (typeof func != 'function') {
        throw Error('Language "' + this.name_ + '" does not know how to generate ' +
            ' code for block type "' + block.type + '".');
    }
    // First argument to func.call is the value of 'this' in the generator.
    // Prior to 24 September 2013 'this' was the only way to access the block.
    // The current prefered method of accessing the block is through the second
    // argument to func.call, which becomes the first parameter to the generator.
    var my_nest = ++generation.nest;
    var code = func.call(block, block);
    generation.nest--;
    generation.currentSystemEditorId = generation.findBlockEditorId(block.id);
    
    if (Array.isArray(code)) {
        // Value blocks return tuples of code and operator order.
        if (!block.outputConnection) {
            throw TypeError('Expecting string from statement block: ' + block.type);
        }
        if (this.STATEMENT_PREFIX) {
            let cs = genEval(my_nest, block.id, generation.currentSystemEditorId);
            code[0] = 'await $id(' + cs + ', ' + code[0] + ')';
        }
        return [this.scrub_(block, code[0], opt_thisOnly), code[1]];
    } else if (typeof code == 'string') {
        let id = block.id.replace(/\$/g, '$$$$');  // Issue 251.  //!! New blockly 
        let cs = genEval(my_nest, block.id, generation.currentSystemEditorId);
        if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
            //code = this.injectId(this.STATEMENT_PREFIX, cs) + code;
            code = this.STATEMENT_PREFIX.replace(/%1/g, cs) +
                code;
        }
        if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
            code = code + this.STATEMENT_PREFIX.replace(/%1/g, cs);
        }
        return this.scrub_(block, code, opt_thisOnly);
    } else if (code === null) {
        // Block has handled code generation itself.
        return '';
    } else {
        throw SyntaxError('Invalid code generated: ' + code);
    }
};
Blockly.Generator.prototype.blockToCodeRELEASE =
    Blockly.Generator.prototype.blockToCode;
Blockly.Generator.prototype.blockToCode = function (block, opt_thisOnly) {
    return Blockly.Generator.prototype["blockToCode" + RuntimeManager.getMode()].bind(this) (block, opt_thisOnly);
};

Blockly.Generator.prototype.addLoopTrapDEBUG = function (branch, block) {
    let id = block.id.replace(/\$/g, '$$$$');  // Issue 251.  //!! Now blockly // where id = block
    let cs = genEval(generation.nest, id, generation.currentSystemEditorId);
    if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
        branch = this.INFINITE_LOOP_TRAP.replace(/%1/g, '\'' + id + '\'') + branch;
    }
    if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
        branch += this.prefixLines(this.STATEMENT_PREFIX.replace(/%1/g, cs), this.INDENT);
    }
    return branch;
};
Blockly.Generator.prototype.addLoopTrapRELEASE =
    Blockly.Generator.prototype.addLoopTrap;
Blockly.Generator.prototype.addLoopTrap = function (branch, block) {
    return Blockly.Generator.prototype["addLoopTrap" + RuntimeManager.getMode()].bind(this) (branch, block);
}

Blockly.Generator.workspaceToCodeDEBUG = function (workspace) {
    if (!workspace) {
        // Backwards compatibility from before there could be multiple workspaces.
        console.warn('No workspace specified in workspaceToCode call.  Guessing.');
        workspace = Blockly.getMainWorkspace();
    }
    let code = [];
    this.init(workspace);
    let blocks = workspace.getTopBlocks(true);
    for (var i = 0, block; (block = blocks[i]); i++) {
        let line = this.blockToCode(block);
        if (Array.isArray(line)) {
            // Value blocks return tuples of code and operator order.
            // Top-level blocks don't care about operator order.
            line = line[0];
        }
        if (line) {
            if (block.outputConnection) {
                // This block is a naked value.  Ask the language's code generator if
                // it wants to append a semicolon, or something.
                line = this.scrubNakedValue(line);
                if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
                    line = this.injectId(this.STATEMENT_PREFIX, block) + line;
                }
                if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
                    line = line + this.injectId(this.STATEMENT_SUFFIX, block);
                }
            }
            code.push(line);
        }
    }
    code = code.join('\n');  // Blank line between each section.
    code = this.finish(code);
    // Final scrubbing of whitespace.
    code = code.replace(/^\s+\n/, '');
    code = code.replace(/\n\s+$/, '\n');
    code = code.replace(/[ \t]+\n/g, '\n');
    return code;
};
Blockly.Generator.workspaceToCodeRELEASE =
    Blockly.Generator.prototype.workspaceToCode;
Blockly.Generator.prototype.workspaceToCode = function (workspace) {
    return Blockly.Generator["workspaceToCode" + RuntimeManager.getMode()].bind(this) (workspace);
}

// den einai kalh idea pou to exw balei sto Blockly.Generator.prototype gt einai diko m
Blockly.Generator.prototype.myBlockToCode = function (block) {
    if (!block) {
        return '';
    }
    if (!block.isEnabled()) {
        // Skip past this block if it is disabled.
        return opt_thisOnly ? '' : this.blockToCode(block.getNextBlock());
    }
    if (block.isInsertionMarker()) {
        // Skip past insertion markers.
        return opt_thisOnly ? '' : this.blockToCode(block.getChildren(false)[0]);
    }

    this.init(block.workspace);           //  added 
    var func = this[block.type];
    var stmt_Prefix = this.STATEMENT_PREFIX;
    this.STATEMENT_PREFIX = null;
    if (typeof func != 'function') {
        throw Error('Language "' + this.name_ + '" does not know how to generate ' +
            ' code for block type "' + block.type + '".');
    }

    var code = func.call(block, block);
    if (Array.isArray(code)) {
        if (!block.outputConnection) {
            throw TypeError('Expecting string from statement block: ' + block.type);
        }
        this.STATEMENT_PREFIX = stmt_Prefix;
        return this.myscrub_(block, code[0]);     // gia na ta kanei ola return san text
    } else if (typeof code == 'string') {
        this.STATEMENT_PREFIX = stmt_Prefix;
        //return code;
        return this.myscrub_(block, code);
    } else if (code === null) {
        this.STATEMENT_PREFIX = stmt_Prefix;
        return '';
    } else {
        throw SyntaxError('Invalid code generated: ' + code);
    }
};


Blockly.JavaScript.myscrub_ = function (a, b) {
    var c = "";
    if (!a.outputConnection || !a.outputConnection.targetConnection) {
        var d = a.getCommentText();
        (d = Blockly.utils.string.wrap(d, Blockly.JavaScript.COMMENT_WRAP - 3)) && (c = a.getProcedureDef ? c + ("/**\n" + Blockly.JavaScript.prefixLines(d + "\n", " * ") + " */\n") : c + Blockly.JavaScript.prefixLines(d + "\n", "// "));
        for (var e = 0; e < a.inputList.length; e++)
            a.inputList[e].type == Blockly.INPUT_VALUE && (d = a.inputList[e].connection.targetBlock()) && (d = Blockly.JavaScript.allNestedComments(d)) && (c += Blockly.JavaScript.prefixLines(d, "// "))
    }
    return c + b;
}


Blockly.JavaScript.finish = function (a) {
    var b = [], c;
    for (c in Blockly.JavaScript.definitions_) {
        if (c === "variables") continue;
        b.push(Blockly.JavaScript.definitions_[c]);
    }
    delete Blockly.JavaScript.definitions_;
    delete Blockly.JavaScript.functionNames_;
    Blockly.JavaScript.variableDB_.reset();
    return b.join("\n\n") + "\n\n\n" + a
};
Blockly.JavaScript.scrubNakedValue = function (a) { return a + ";\n" };
Blockly.JavaScript.quote_ = function (a) {
    a = a.replace(/\\/g, "\\\\").replace(/\n/g, "\\\n").replace(/'/g, "\\'");
    return "'" + a + "'"
};


/**
 * Generate code representing the statement.  Indent the code.
 * @param {!Blockly.Block} block The block containing the input.
 * @param {string} name The name of the input.
 * @return {string} Generated code or '' if no blocks are connected.
 */
// Blockly.Generator.prototype.statementToCode = function(block, name) {
//     var targetBlock = block.getInputTargetBlock(name);
//     var code = this.blockToCode(targetBlock);
//     // Value blocks must return code and order of operations info.
//     // Statement blocks must only return code.
//     goog.asserts.assertString(code, 'Expecting code from statement block "%s".',
//         targetBlock && targetBlock.type);
//     if (code) {
//       code = this.prefixLines(/** @type {string} */ (code), this.INDENT);
//     }
//     return code;
//   };
