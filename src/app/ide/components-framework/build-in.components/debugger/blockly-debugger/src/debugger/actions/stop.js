import { Debuggee_Worker, Blockly_Debugger} from "../debugger.js";

export function RegisterStopDebuggerAction(selector) {
    Blockly_Debugger.actions["Stop"] = {};

    Blockly_Debugger.actions["Stop"].handler = () => {
        Debuggee_Worker.Stop();
        document.getElementById("val_table").innerHTML = '';
        Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{Blockly_Debugger.actions["Breakpoint"].reset_view(obj.block_id)}); 
        // remove hilighting 
        window.workspace["blockly1"].traceOn_ = true;
        window.workspace["blockly1"].highlightBlock("");
        window.workspace["blockly2"].traceOn_ = true;
        window.workspace["blockly2"].highlightBlock("");
    }
    Blockly_Debugger.addDebuggerAction(
        selector,
        Blockly_Debugger.actions["Stop"].handler);
}
