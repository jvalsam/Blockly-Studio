import { Debuggee_Worker, Blockly_Debugger } from '../debugger.js';
import './watches.js';
import * as Blockly from 'blockly';

function AddVariableWatchTable() {
    // use onClick callback to fix the UI changes for the debugger
    // initiate the view of watches and variables of the debugger    
    Blockly_Debugger.actions["Variables"].init();
    Blockly_Debugger.actions["Watch"].init();

    // TODO: initiate UI toolbar variables and watches
    
    // document.getElementById("val_table").innerHTML =
    //     `<div class="watch">
    //         <div class="title">&nbsp;Variables<!--i class="fa fa-bars"></i--></div>
    //         <div class="watch-content">
    //             <table style="width:100%">
    //                 <tr>
    //                     <th>Name</th>
    //                     <th>Value</th> 
    //                     <th>Type</th>
    //                 </tr>
    //             </table>
    //             <table id="variables" style="width:100%"></table>
    //         </div>
    //     </div>
    //     <div class="watch">
    //         <div class="title">&nbsp;Watches</div>
    //         <div class="watch-content">
    //             <table style="width:100%">
    //                 <tr>
    //                     <th>Name</th>
    //                     <th>Code</th> 
    //                     <th>Value</th>
    //                     <th>Type</th>
    //                 </tr>     
    //             </table>
    //             <table id="watches" style="width:100%">
    //             </table>
    //         </div>
    //     </div>`;
}


export function RegisterStartDebuggerAction(selector, envDataGetter, onClick) {
    Blockly_Debugger.actions["Start"] = {};

    Blockly_Debugger.actions["Start"].handler = (cursorBreakpoint) => {
        if (Debuggee_Worker.hasInstance()) return;
        
        // instrumentation code. TODO: move it on the runtime environment side
        Blockly.JavaScript.STATEMENT_PREFIX = 'await $id(%1, 0);\n';
        
        // var code1 = Blockly.JavaScript.workspaceToCode(window.workspace["blockly1"]);
        // var code2 = Blockly.JavaScript.workspaceToCode(window.workspace["blockly2"]);
        // var code = code1 + code2;
        
        code.replace(/__DOLLAR__/g, '\$');

        AddVariableWatchTable();
        
        if (cursorBreakpoint instanceof MouseEvent) cursorBreakpoint = "";
        
        Debuggee_Worker.Instance().postMessage({
            "type": "start_debugging", "data": {
                // "code": code,
                "breakpoints": Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => {
                    return {
                        // pelem id
                        "block_id": obj.block_id,
                        "enable": obj.enable
                    }
                }),
                "cursorBreakpoint": cursorBreakpoint,
                "watches": Blockly_Debugger.actions["Watch"].getWatches(),
                "variables": Blockly_Debugger.actions["Variables"].getVariables()
            }
        });
    }

    Blockly_Debugger.addDebuggerAction(
        selector,
        Blockly_Debugger.actions["Start"].handler);
}
