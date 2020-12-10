import {
    Debuggee_Worker,
    Blockly_Debugger
} from '../debugger.js';
import * as Blockly from 'blockly';


// Variables
export function RegisterVariablesDebuggerAction (event) {
    Blockly_Debugger.actions["Variables"] = (function () {
        var variables = [];
    
        function handler() { };
    
        function update(new_vars) {
            for (var i = 0; i < variables.length; ++i) {
                if (variables[i].value !== new_vars[i].value) {
                    variables[i].value = new_vars[i].value;
                    variables[i].change = true;
                } else {
                    variables[i].change = false;
                }
    
            }
            //variables = new_vars;
            dispatchEvent(new Event("updateTable"));
        };
    
        function getVariables() {
            return variables;
        };
    
        function init() {
            var workspace_vars = [];
            workspace_vars[0] = window.workspace["blockly1"].getAllVariables().map((variable) => {
                return variable.name;
            });
            workspace_vars[1] = window.workspace["blockly2"].getAllVariables().map((variable) => {
                return variable.name;
            });
    
            for (var i = 0; i < workspace_vars.length; i++) {
                var variables_names = variables.map((variable) => {
                    return variable.name;
                });
                for (var j = 0; j < workspace_vars[i].length; ++j) {
                    if (variables_names.includes(workspace_vars[i][j])) continue;
                    var nvar = {
                        "name": workspace_vars[i][j],
                        "value": undefined,
                        "change": false
                    }
                    variables.push(nvar);
                }
            }
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
export function RegisterWatchDebuggerAction(event) {
    Blockly_Debugger.actions["Watch"] = (function () {
        var watches = [];
    
        function handler() {
            dispatchEvent(new Event("updateWatchesTable"));
            if (!Debuggee_Worker.hasInstance()) return;
            Debuggee_Worker.Instance().postMessage({ "type": "watch", "data": watches });
        }
    
        function update(new_watches) {
            for (var i = 0; i < watches.length; ++i) {
                if (watches[i].value !== new_watches[i].value) {
                    watches[i].value = new_watches[i].value;
                    watches[i].change = true;
                } else {
                    watches[i].change = false;
                }
    
            }
            //watches = new_watches;
            dispatchEvent(new Event("updateWatchesTable"));
        };
    
        function getWatches() {
            return watches;
        }
    
        function init() {
            for (var i = 0; i < watches.length; ++i) {
                watches[i].value = undefined;
            }
        }
    
        function menuOption(block) {
            var watchOption = {
                text: (!Blockly_Debugger.actions["Watch"].getWatches().map((obj) => { return obj.name; }).includes(block.toString())) ? "Add Watch" : "Remove Watch",
                enabled: (block.outputConnection == null) ? false : true,
                callback: function () {
                    var name = block.toString();
    
                    if (!Blockly_Debugger.actions["Watch"].getWatches().map((obj) => { return obj.name; }).includes(name)) {
                        var code = Blockly.JavaScript.myBlockToCode(block);
                        var new_watch = {
                            "name": name,
                            "code": code,
                            "value": undefined
                        }
                        Blockly_Debugger.actions["Watch"].getWatches().push(new_watch);
                    } else {
                        var index = Blockly_Debugger.actions["Watch"].getWatches().map((obj) => { return obj.name; }).indexOf(name);
                        if (index !== -1) Blockly_Debugger.actions["Watch"].getWatches().splice(index, 1);
                    }
                    Blockly_Debugger.actions["Watch"].handler();
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
            enabled: (block.type === "variables_set" || block.type === "math_change") ? true : false,
            callback: function () {
                Blockly_Debugger.actions["Eval"].handler(Blockly.JavaScript.myBlockToCode(block));
            }
        };
        return evalOption;
    }
}
