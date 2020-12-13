import { dispatcher, Blockly_Debuggee } from '../init.js';
import { window } from "../init.js";


function update_values() {
    var update_var = Blockly_Debuggee.actions["variables"].update_values();
    var update_watch = Blockly_Debuggee.actions["watch"].update_values();
    return update_var + update_watch;
}

export function BlocklyDebuggeeStartAction(plugin) {
    Blockly_Debuggee.actions.start_debugging = (function () {
        async function handler(content) {
            if (content != undefined) {                
                let execData = plugin._envData.execData;
                plugin._envData.update_values = update_values;
                plugin._envData.postMessage = plugin.postMessage.bind(plugin);

                Blockly_Debuggee
                    .actions["breakpoint"]
                    .update(content.breakpoints);
                Blockly_Debuggee
                    .actions["runToCursor"]
                    .cursorBreakpoint = content.cursorBreakpoint;
                Blockly_Debuggee
                    .actions["watch"]
                    .update(content.watches);
                Blockly_Debuggee
                    .actions["variables"]
                    .update(content.variables);

                plugin._executionScript(execData);
            }
            else {
                window.alert("The content is undefined.");
            }
        };

        async function $id(update_values, wait_call, code) {
            return code;
        };

        async function wait(nest, block_id, currentSystemEditorId) {
            await Blockly_Debuggee.wait(nest, block_id, currentSystemEditorId);
        };

        function isStepOver() {
            return Blockly_Debuggee.state.isState("stepOver");
        };


        function isStepParent() {
            return Blockly_Debuggee.state.isState("stepParent");
        };

        return {
            handler: handler
        };
    })();

    dispatcher.start_debugging = Blockly_Debuggee.actions["start_debugging"].handler;
}
