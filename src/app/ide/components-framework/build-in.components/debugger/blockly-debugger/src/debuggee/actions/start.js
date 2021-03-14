import { dispatcher, Blockly_Debuggee } from '../init.js';
import { window } from "../init.js";


function update_values(pelemId) {
    var update_var = Blockly_Debuggee.actions["variables"].update_values(pelemId);
    var update_watch = Blockly_Debuggee.actions["watch"].update_values(pelemId);
    return update_var + update_watch;
}

export function BlocklyDebuggeeStartAction() {
    function init(content) {
        if (content != undefined) {
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
        }
        else {
            window.alert("The content is undefined.");
        }
    }

    async function $id(update_values, wait_call, code) {
        return code;
    }

    async function wait(nest, block_id, currentSystemEditorId) {
        await Blockly_Debuggee.wait(nest, block_id, currentSystemEditorId);
    }

    function isStepOver() {
        return Blockly_Debuggee.state.isState("stepOver");
    }


    function isStepParent() {
        return Blockly_Debuggee.state.isState("stepParent");
    }

    return {
        init: init,
        $id: $id,
        wait: wait,
        isStepOver: isStepOver,
        isStepParent: isStepParent
    };
}
