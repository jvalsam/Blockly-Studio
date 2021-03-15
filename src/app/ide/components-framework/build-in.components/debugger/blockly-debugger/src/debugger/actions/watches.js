import {
    Debuggee_Worker,
    Blockly_Debugger
} from '../debugger.js';
import * as Blockly from 'blockly';

// Variables
export function RegisterVariablesDebuggerAction (event, plugin) {
    Blockly_Debugger.actions["Variables"] = (function () {
        var variables = {};
    
        function handler() { };
    
        // envTree: Array<JSTree>
        function update(envTree) {
            let workspaces_vars = envTree.filter(elem => elem.isBlocklyVariable);

            workspaces_vars.forEach(variable => {
                if (!variables[variable.parent]) {
                    variables[variable.parent] = [];
                }

                let debugVar = variables[variable.parent]
                    .find(pvar => variable.variableName === pvar.name);
                
                if (debugVar.value !== variable.variableValue) {
                    debugVar.value = variable.variableValue;
                    debugVar.text = variable.variableName + " : " + variable.variableValue;
                    debugVar.change = true;
                } else {
                    debugVar.change = false;
                }
            });

            plugin.updateVariables(envTree);
        };
    
        function getVariables(pelemId) {
            if(pelemId)
                return variables[pelemId];
            
            return variables;
        };
    
        // envTree: Array<JSTreeNode>
        function init(envTree) {
            let workspaces_vars = envTree.filter(elem => elem.isBlocklyVariable);
    
            workspaces_vars.forEach(variable => {
                if (!variables[variable.parent]) {
                    variables[variable.parent] = [];
                }

                variables[variable.parent].push({
                    "name": variable.variableName,
                    "id": variable.id,
                    "value": variable.variableValue,
                    "change": false
                });
            });
        };
    
        return {
            update: update,
            getVariables: getVariables,
            init: init
        }
    })();

    Debuggee_Worker.AddOnDispacher(
        event,
        Blockly_Debugger.actions["Variables"].update);
}

// Watches
export function RegisterWatchDebuggerAction(event, plugin) {
    Blockly_Debugger.actions["Watch"] = (function () {
        var watches = [];
    
        function handler() {
            dispatchEvent(new Event("updateWatchesTable"));
            if (!Debuggee_Worker.hasInstance()) return;
            Debuggee_Worker.Instance().postMessage({ "type": "watch", "data": watches });
        }
    
        function update(new_watches) {
            for (var i = 0; i < watches.length; ++i) {
                let new_watch = new_watches.find(w => w.blockId === watches[i].blockId);

                if (watches[i].value !== new_watch.value) {
                    watches[i].value = new_watch.value;
                    watches[i].change = true;
                } else {
                    watches[i].change = false;
                }
            }
            
            plugin.updateWatches(new_watches);
        };
    
        function getWatches(pelemId) {
            return watches.filter(elem => elem.parent === pelemId);
        }
    
        function init() {
            for (var i = 0; i < watches.length; ++i) {
                watches[i].value = undefined;
            }
        }
    
        function menuOption(block) {
            var pelemId = "debugger_" + block.workspace.pitem.systemId;

            var watchOption = {
                text: (watches.findIndex(e => e.blockId === block.id) === -1)
                            ? "Add Watch"
                            : "Remove Watch",
                enabled: (block.outputConnection == null)
                    ? false
                    : true,
                callback: function () {
                    if (watches.findIndex(e => e.blockId === block.id) > -1) {
                        var code = Blockly.JavaScript.myBlockToCode(block);

                        var new_watch = {
                            "blockId": block.id,
                            "name": block.toString(),
                            "code": code,
                            "value": undefined,
                            "parent": pelemId
                        };
                        watches.push(new_watch);
                    }
                    else {
                        var index = watches.findIndex(
                            e => e.parent === pelemId
                                && e.blockId === block.id);
                        watches.splice(index, 1);
                    }

                    handler();
                }
            };
            return watchOption;
        }
    
        return {
            handler: handler,
            update: update,
            getWatches: getWatches,
            init: init,
            menuOption: menuOption
        }
    })();

    Debuggee_Worker.AddOnDispacher(
        event,
        Blockly_Debugger.actions["Watch"].update);
}

// Eval
export function RegisterEvalDebuggerAction() {
    Blockly_Debugger.actions["Eval"] = {};
    Blockly_Debugger.actions["Eval"].handler = function (expr) {
        if (!Debuggee_Worker.hasInstance()) return;
        Debuggee_Worker.Instance().postMessage({ "type": "eval", "data": expr });
    }
    Blockly_Debugger.actions["Eval"].menuOption = function (block) {
        var evalOption = {
            text: "Evaluate",
            enabled: (block.type === "variables_set" || block.type === "math_change")
                ? true
                : false,
            callback: function () {
                Blockly_Debugger.actions["Eval"].handler(Blockly.JavaScript.myBlockToCode(block));
            }
        };
        return evalOption;
    }
}
