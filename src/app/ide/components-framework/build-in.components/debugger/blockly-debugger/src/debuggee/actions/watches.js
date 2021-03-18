import { Blockly_Debuggee, dispatcher } from '../init.js';

Blockly_Debuggee.actions["watch"] = {};
Blockly_Debuggee.actions["variables"] = {};
Blockly_Debuggee.actions["eval"] = {};

export function BlocklyDebuggeeWatchAction(plugin) {
    Blockly_Debuggee.actions["watch"] = (function () {
        var watches = [];

        function handler(new_watches) {
            watches = new_watches;

            let uwc = "watches = Blockly_Debuggee.actions[\"watch\"].getWatches();";
            for (var i = 0; i < watches.length; ++i) {
                uwc += 'watches[' + i + '].value = ' + watches[i].code + ';\n';
            }
            Blockly_Debuggee.actions["eval"]
                    .evalLocal(uwc);

            updateDebugger();
        };

        // function includes(variable) {
        //     return watches.includes(variable);
        // };

        function update(updated) {
            watches = updated;
        };

        function update_values(pelemId) {
            var code = '';

            let pelemWatches = watches.filter(w => w.parent === pelemId);

            pelemWatches.forEach(pwatch => {
                code += "watches.find(w => w.blockId === " + JSON.stringify(pwatch.blockId) + ").value = "
                    + pwatch.code;
            });

            return "watches = Blockly_Debuggee.actions[\"watch\"].getWatches();"
                + code;
        }

        function getWatches() {
            return watches;
        }

        function updateDebugger() {
            plugin.postMessage({ "type": "watches", "data": watches });
        }


        return {
            handler: handler,
            // includes: includes,
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
        var variables;

        function update(envTree) {
            variables = envTree;
        };

        function update_values(pelemId) {
            var code = '';

            let varsNodes = variables
                .filter(elem => elem.parent === pelemId &&  elem.isBlocklyVariable);
            
            varsNodes.forEach(varNode => {
                code += 'debuggerEnvironmentVariables.find(elem => elem.id === '
                    + JSON.stringify(varNode.id)
                    + ').variableValue = ' + varNode.variableName + ';\n';
                code += 'debuggerEnvironmentVariables.find(elem => elem.id === '
                    + JSON.stringify(varNode.id)
                    + ').text = '
                    + JSON.stringify(varNode.variableName + " : ")
                    + " + "
                    + varNode.variableName + ";\n";
            });

            varsNodes = variables.filter(elem => elem.variableSName);
            
            varsNodes.forEach(varNode => {
                code += 'debuggerEnvironmentVariables.find(elem => elem.id === '
                    + JSON.stringify(varNode.id)
                    + ').variableValue = ' + varNode.variableSName + ';\n';
                code += 'debuggerEnvironmentVariables.find(elem => elem.id === '
                    + JSON.stringify(varNode.id)
                    + ').text = '
                    + JSON.stringify(varNode.variableName + " : ")
                    + " + "
                    + varNode.variableSName + ";\n";
            });

            return code;
        }

        function getVariables(pelemId) {
            if(pelemId)
                return variables
                    .filter(elem => elem.parent === pelemId &&  elem.isBlocklyVariable);
            
            return variables;
        }

        function updateDebugger() {
            plugin.postMessage({ "type": "variables", "data": variables });
        }

        return {
            update: update,
            update_values: update_values,
            getVariables: getVariables,
            updateDebugger: updateDebugger
        }
    })();
}

export function BlocklyDebuggeeEvalAction() {
    Blockly_Debuggee.actions["eval"].evalLocal;     // defined inside the start action in the eval()

    Blockly_Debuggee.actions["eval"].handler = function (expr, debuggerScopeId) {
        Blockly_Debuggee.actions["eval"].evalLocal(expr);
        Blockly_Debuggee.actions["eval"]
            .evalLocal(Blockly_Debuggee.actions["variables"].update_values(debuggerScopeId));
        Blockly_Debuggee.actions["variables"].updateDebugger();
        Blockly_Debuggee.actions["eval"]
            .evalLocal(Blockly_Debuggee.actions["watch"].update_values(debuggerScopeId));
        Blockly_Debuggee.actions["watch"].updateDebugger();
    }
    dispatcher.eval = Blockly_Debuggee.actions["eval"].handler;
}
