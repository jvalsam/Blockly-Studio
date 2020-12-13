import { generation } from "../../generator/blockly/blockly_init";
import { Debuggee_Worker, Blockly_Debugger} from "../debugger.js";

export function RegisterStopDebuggerAction(selector) {
    Blockly_Debugger.actions["Stop"] = {};

    Blockly_Debugger.actions["Stop"].handler = () => {
        Debuggee_Worker.Stop();
        document.getElementById("val_table").innerHTML = '';
        Blockly_Debugger.actions["Breakpoint"]
            .breakpoints
            .map((obj)=>{Blockly_Debugger.actions["Breakpoint"]
            .reset_view(obj.block_id)});
        // remove hilighting
        for (const editorId in generation.workspaces) {
            generation.workspaces[editorId].setTraceOn_(true);
            generation.workspaces[editorId].highlightBlock("");
        }
    }
    Blockly_Debugger.addDebuggerAction(
        selector,
        Blockly_Debugger.actions["Stop"].handler);
}
