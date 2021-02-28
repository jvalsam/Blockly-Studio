import {
    Debuggee_Worker,
    Blockly_Debugger
} from '../debugger.js';


export function RegisterContinueDebuggerAction() {
    Blockly_Debugger.actions["Continue"] = {};

    Blockly_Debugger.actions["Continue"].handler = () => {
        Debuggee_Worker.Instance().postMessage({"type":"continue"});
    }

    return Blockly_Debugger.actions["Continue"].handler;
}
