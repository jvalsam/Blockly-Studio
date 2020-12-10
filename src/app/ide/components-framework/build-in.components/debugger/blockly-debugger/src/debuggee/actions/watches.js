import { Blockly_Debuggee, dispatcher } from '../init.js';

Blockly_Debuggee.actions["watch"] = {};
Blockly_Debuggee.actions["variables"] = {};
Blockly_Debuggee.actions["eval"] = {};

export function BlocklyDebuggeeWatchAction() {
    Blockly_Debuggee.actions["watch"] = (function () {
        var watches = [];
        function handler(new_watches) {
            watches = new_watches;
            for (var i = 0; i < watches.length; ++i) {
                Blockly_Debuggee.actions["eval"].evalLocal("var watches = Blockly_Debuggee.actions[\"watch\"].getWatches();" + 'watches[' + i + '].value = ' + watches[i].code + ';\n');
            }
            updateDebugger();
        };

        function includes(variable) {
            return watches.includes(variable);
        };

        function update(updated) {
            watches = updated;
        };


        function update_values() {
            var code = '';
            for (var i = 0; i < watches.length; ++i) {
                code += 'watches[' + i + '].value = ' + watches[i].code + ';\n';
            }
            return "var watches = Blockly_Debuggee.actions[\"watch\"].getWatches();" + code;
        }

        function getWatches() {
            return watches;
        }

        function updateDebugger() {
            postMessage({ "type": "watches", "data": watches });
        }


        return {
            handler: handler,
            includes: includes,
            update: update,
            update_values: update_values,
            getWatches: getWatches,
            updateDebugger: updateDebugger
        };
    })();
    dispatcher.watch = Blockly_Debuggee.actions["watch"].handler;
}

export function BlocklyDebuggeeVariablesAction(plugin) {
    Blockly_Debuggee.actions["variables"] = (function () {
        var variables = [];
        function update(new_vars) {
            variables = new_vars;
        };


        function update_values() {
            var code = '';
            for (var i = 0; i < variables.length; ++i) {
                code += 'variables[' + i + '].value = ' + variables[i].name + ';\n';
            }
            return code;
        }

        function getVariables() {
            return variables;
        }

        function updateDebugger() {
            /*plugin.*/postMessage({ "type": "variables", "data": variables });
        }

        function define_variables() {
            var code = '';
            for (var i = 0; i < variables.length; ++i) {
                code += 'var ' + variables[i].name + ';\n';
            }
            return code;
        }

        return {
            update: update,
            update_values: update_values,
            getVariables: getVariables,
            updateDebugger: updateDebugger,
            define_variables: define_variables
        }
    })();
}

export function BlocklyDebuggeeEvalAction() {
    Blockly_Debuggee.actions["eval"].evalLocal;     // defined inside the start action in the eval()

    Blockly_Debuggee.actions["eval"].handler = function (expr) {
        Blockly_Debuggee.actions["eval"].evalLocal(expr);
        Blockly_Debuggee.actions["eval"].evalLocal(Blockly_Debuggee.actions["variables"].update_values());
        Blockly_Debuggee.actions["variables"].updateDebugger();
        Blockly_Debuggee.actions["eval"].evalLocal(Blockly_Debuggee.actions["watch"].update_values());
        Blockly_Debuggee.actions["watch"].updateDebugger();
    }
    dispatcher.eval = Blockly_Debuggee.actions["eval"].handler;
}
