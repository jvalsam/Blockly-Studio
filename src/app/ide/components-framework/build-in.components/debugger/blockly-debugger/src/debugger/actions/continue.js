import {
    Debuggee_Worker,
    Blockly_Debugger
} from '../debugger.js';


export function RegisterContinueDebuggerAction(selector) {
    Blockly_Debugger.actions["Continue"] = {};

    Blockly_Debugger.actions["Continue"].handler = () => {
        Debuggee_Worker.Instance().postMessage({"type":"continue"});
    }
    
    Blockly_Debugger.addDebuggerAction(
        selector,
        Blockly_Debugger.actions["Continue"].handler);    
}
