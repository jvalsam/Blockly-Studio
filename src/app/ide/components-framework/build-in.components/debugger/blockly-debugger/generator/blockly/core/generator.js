import {generation} from '../blockly_init.js'
import {genEval} from '../../genEval.js'

Blockly.Generator.prototype.blockToCode = function(block) {
    if (!block) {
      return '';
    }
    if (block.disabled) {
      // Skip past this block if it is disabled.
      return this.blockToCode(block.getNextBlock());
    }
  
    var func = this[block.type];
    goog.asserts.assertFunction(func,
        'Language "%s" does not know how to generate code for block type "%s".',
        this.name_, block.type);
    // First argument to func.call is the value of 'this' in the generator.
    // Prior to 24 September 2013 'this' was the only way to access the block.
    // The current prefered method of accessing the block is through the second
    // argument to func.call, which becomes the first parameter to the generator.
    var my_nest = ++generation.nest;
    var code = func.call(block, block);
    generation.nest--;
    if (goog.isArray(code)) {
      // Value blocks return tuples of code and operator order.
      goog.asserts.assert(block.outputConnection,               //!! New blockly 
        'Expecting string from statement block "%s".', block.type);
      if (this.STATEMENT_PREFIX) {
        let cs = genEval (my_nest,  block.id, generation.currentSystemEditorId);
        code[0] = 'await $id('+ cs + ', ' + code[0] + ')';
      }
      return [this.scrub_(block, code[0]), code[1]];
    } else if (goog.isString(code)) {
      var id = block.id.replace(/\$/g, '$$$$');  // Issue 251.  //!! New blockly 
      if (this.STATEMENT_PREFIX) {
        let cs = genEval (my_nest,  block.id, generation.currentSystemEditorId);
        code = this.STATEMENT_PREFIX.replace(/%1/g, cs ) +
            code;
      }
      return this.scrub_(block, code);
    } else if (code === null) {
      // Block has handled code generation itself.
      return '';
    } else {
      goog.asserts.fail('Invalid code generated: %s', code);
    }
  };


Blockly.Generator.prototype.addLoopTrap = function(branch, id) {
  id = id.replace(/\$/g, '$$$$');  // Issue 251.  //!! Now blockly 
  if (this.INFINITE_LOOP_TRAP) {
    branch = this.INFINITE_LOOP_TRAP.replace(/%1/g, '\'' + id + '\'') + branch;
  }
  if (this.STATEMENT_PREFIX) {
    let cs =  genEval (generation.nest, id, generation.currentSystemEditorId);
    branch += this.prefixLines(this.STATEMENT_PREFIX.replace(/%1/g, cs), this.INDENT);
  }
  return branch;
};


Blockly.Generator.prototype.workspaceToCode = function(workspace) {
  if (!workspace) {
    // Backwards compatability from before there could be multiple workspaces.
    console.warn('No workspace specified in workspaceToCode call.  Guessing.');
    workspace = Blockly.getMainWorkspace();
  }
  var code = [];
  this.init(workspace);
  var blocks = workspace.getTopBlocks(true);
  generation.currentSystemEditorId = workspace.systemEditorId;
  var line = "\n// start source code of another editor\n";
  // var line = "\n// start source code of another editor\nCurrentSystemEditorId = '" + workspace.systemEditorId + "';\n";
  code.push(line);
  for (var x = 0, block; block = blocks[x]; x++) {
    line = this.blockToCode(block);
    if (goog.isArray(line)) {
      // Value blocks return tuples of code and operator order.
      // Top-level blocks don't care about operator order.
      line = line[0];
    }
    if (line) {
      if (block.outputConnection && this.scrubNakedValue) {
        // This block is a naked value.  Ask the language's code generator if
        // it wants to append a semicolon, or something.
        line = this.scrubNakedValue(line);
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


 // den einai kalh idea pou to exw balei sto Blockly.Generator.prototype gt einai diko m
 Blockly.Generator.prototype.myBlockToCode = function(block) {
  if (!block || block.disabled) {
    return '';
  }
  this.init(block.workspace);           //  added 
  var func = this[block.type];
  var stmt_Prefix = this.STATEMENT_PREFIX;
  this.STATEMENT_PREFIX = null;
  goog.asserts.assertFunction(func,
      'Language "%s" does not know how to generate code for block type "%s".',
      this.name_, block.type);
   var code = func.call(block, block);
  if (goog.isArray(code)) {
       goog.asserts.assert(block.outputConnection,
        'Expecting string from statement block "%s".', block.type);
    this.STATEMENT_PREFIX = stmt_Prefix;
    return this.myscrub_(block, code[0]);     // gia na ta kanei ola return san text
  } else if (goog.isString(code)) {
    this.STATEMENT_PREFIX = stmt_Prefix;
    //return code;
    return this.myscrub_(block, code);
  } else if (code === null) {
    this.STATEMENT_PREFIX = stmt_Prefix;
    return '';
  } else {
    goog.asserts.fail('Invalid code generated: %s', code);
  }
};


Blockly.JavaScript.myscrub_=function(a,b){
  var c="";
  if(!a.outputConnection||!a.outputConnection.targetConnection){
    var d=a.getCommentText();
    (d=Blockly.utils.wrap(d,Blockly.JavaScript.COMMENT_WRAP-3))&&(c=a.getProcedureDef?c+("/**\n"+Blockly.JavaScript.prefixLines(d+"\n"," * ")+" */\n"):c+Blockly.JavaScript.prefixLines(d+"\n","// "));
    for(var e=0;e<a.inputList.length;e++)
      a.inputList[e].type==Blockly.INPUT_VALUE&&(d=a.inputList[e].connection.targetBlock())&&(d=Blockly.JavaScript.allNestedComments(d))&&(c+=Blockly.JavaScript.prefixLines(d,"// "))
  }
  return c+b;
}


Blockly.JavaScript.finish=function(a){
  var b=[],c;
  for(c in Blockly.JavaScript.definitions_){
    if(c === "variables") continue;
    b.push(Blockly.JavaScript.definitions_[c]);
  }
  delete Blockly.JavaScript.definitions_;
  delete Blockly.JavaScript.functionNames_;
  Blockly.JavaScript.variableDB_.reset();
  return b.join("\n\n")+"\n\n\n"+a};
  Blockly.JavaScript.scrubNakedValue=function(a){return a+";\n"};
  Blockly.JavaScript.quote_=function(a){a=a.replace(/\\/g,"\\\\").replace(/\n/g,"\\\n").replace(/'/g,"\\'");
  return"'"+a+"'"
};
