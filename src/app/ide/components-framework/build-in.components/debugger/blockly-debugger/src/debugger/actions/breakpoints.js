import { Debuggee_Worker, Blockly_Debugger } from '../debugger.js';
import { generation } from "../../generator/blockly/blockly_init";


export let EnableBreakpoint = (blockId, outer) => {
    Blockly_Debugger.actions["Breakpoint"].enable(blockId, outer);
};

export let DisableBreakpoint = (blockId, outer) => {
    Blockly_Debugger.actions["Breakpoint"].disable(blockId, outer);
};


export function RegisterDebuggerBreakpointFunctionality(visualDebugger) {
    Blockly_Debugger.actions["Breakpoint"] = {};
    // Breakpoints
    Blockly_Debugger.actions["Breakpoint"].breakpoints = [];

    // add breakpoint during the execution
    Blockly_Debugger.actions["Breakpoint"].handler = () => {
        if (!Debuggee_Worker.hasInstance()) return;
        Debuggee_Worker.Instance().postMessage({
            "type": "breakpoint", "data": Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => {
                return {
                    "block_id": obj.block_id,
                    "pelem_id": obj.pelem_id,
                    "enable": obj.enable
                }
            }),
        });
    }

    Blockly_Debugger.actions["Breakpoint"].onAddBreakpoint = (block) => {
        visualDebugger.addBreakpoint(block, "EDITOR");
    }

    Blockly_Debugger.actions["Breakpoint"].onRemoveBreakpoint = (block) => {
        visualDebugger.removeBreakpoint(block.id, "EDITOR");
    }

    Blockly_Debugger.actions["Breakpoint"].wait_view = (block_id) => {
        let currentSystemEditorId = generation.findBlockEditorId(block_id);
        let block = generation.workspaces[currentSystemEditorId]
            .getBlockById(block_id);
        
        while (block != null) {
            block.setCollapsed(false);
            block = block.parentBlock_;
        }
        // highlighting, not works in case that is collapsed
        generation.workspaces[currentSystemEditorId].wsp.traceOn_ = true;
        generation.workspaces[currentSystemEditorId].highlightBlock(block_id);

        document.getElementById(block_id).style.stroke = 'red';
        document.getElementById(block_id).style.fill = 'yellow';
        document.getElementById(block_id).style['stroke-width'] = '5px';
    }


    Blockly_Debugger.actions["Breakpoint"].reset_view = (block_id) => {
        document.getElementById(block_id).style.stroke = 'yellow';
        document.getElementById(block_id).style.fill = 'red';
        document.getElementById(block_id).style['stroke-width'] = '1px';
    }


    Blockly_Debugger.actions["Breakpoint"].disable = (block_id, outer) => {
        var i = Blockly_Debugger
            .actions["Breakpoint"]
            .breakpoints
            .map((obj) => { return obj.block_id; })
            .indexOf(block_id);

        if (i != -1) {
            document.getElementById(block_id).style.stroke = 'yellow';
            document.getElementById(block_id).style.fill = '#FA8258';
            document.getElementById(block_id).style['stroke-width'] = '1px';
            Blockly_Debugger.actions["Breakpoint"].breakpoints[i].enable = false;
            if (Debuggee_Worker.hasInstance())
                Debuggee_Worker.Instance().postMessage({
                    "type": "breakpoint",
                    "data": Blockly_Debugger.actions["Breakpoint"]
                        .breakpoints
                        .map((obj) => {
                            return {
                                "block_id": obj.block_id,
                                "enable": obj.enable
                            };
                        }),
                });
            
            if (!outer)
                visualDebugger.disableBreakpoint(block_id, "EDITOR");
        }
    }

    Blockly_Debugger.actions["Breakpoint"].enable = (block_id, outer) => {
        var i = Blockly_Debugger
            .actions["Breakpoint"]
            .breakpoints
            .map(obj => obj.block_id)
            .indexOf(block_id);

        if (i != -1) {
            document.getElementById(block_id).style.fill = 'red';
            Blockly_Debugger.actions["Breakpoint"].breakpoints[i].enable = true;
            if (Debuggee_Worker.hasInstance())
                Debuggee_Worker.Instance().postMessage({
                    "type": "breakpoint",
                    "data": Blockly_Debugger
                        .actions["Breakpoint"]
                        .breakpoints
                        .map((obj) => {
                            return {
                                "block_id": obj.block_id,
                                "enable": obj.enable
                            }
                        }),
                });

            if (!outer)
                visualDebugger.enableBreakpoint(block_id, "EDITOR");
        }
    }

    Blockly_Debugger.actions["Breakpoint"].menuOption = (block) => {
        var breakpointOption = {
            text: (!Blockly_Debugger
                .actions["Breakpoint"]
                .breakpoints
                .map(obj => obj.block_id)
                .includes(block.id))
                    ? "Add Breakpoint"
                    : "Remove Breakpoint",
            enabled: true,
            callback: function () {
                if (!Blockly_Debugger
                    .actions["Breakpoint"]
                    .breakpoints
                    .map(obj => obj.block_id)
                    .includes(block.id)) {
                    var new_br = {
                        "block_id": block.id,
                        "enable": true,
                        "icon": new Breakpoint_Icon(block),
                        "change": false
                    }
                    Blockly_Debugger
                        .actions["Breakpoint"]
                        .breakpoints
                        .push(new_br);
                    block.setCollapsed(false); // opens when breakpoint hits
                }
                else {
                    let icon = Blockly_Debugger
                        .actions["Breakpoint"]
                        .breakpoints
                        .map((obj) => {
                            if (obj.block_id === block.id)
                                return obj.icon
                        });
                    icon[0].myDisable();
                    var index = Blockly_Debugger
                        .actions["Breakpoint"]
                        .breakpoints
                        .map(obj => obj.block_id)
                        .indexOf(block.id);
                    if (index !== -1) {
                        Blockly_Debugger
                            .actions["Breakpoint"]
                            .breakpoints
                            .splice(index, 1);
                    }
                }
                Blockly_Debugger.actions["Breakpoint"].handler();
            }
        };
        return breakpointOption;
    }


    Blockly_Debugger.actions["Breakpoint"].disableMenuOption = (block) => {
        var DisableBreakpointOption = {
            text: (Blockly_Debugger
                .actions["Breakpoint"]
                .breakpoints
                .map(obj => {
                    if (obj.enable)
                        return obj.block_id})
                .includes(block.id))
                    ? "Disable Breakpoint"
                    : "Enable Breakpoint",
            enabled: (Blockly_Debugger
                .actions["Breakpoint"]
                .breakpoints
                .map((obj) => { return obj.block_id; })
                .includes(block.id))
                    ? true
                    : false,
            callback: function () {
                if (Blockly_Debugger
                    .actions["Breakpoint"]
                    .breakpoints
                    .map((obj) => { if (obj.enable) return obj.block_id })
                    .includes(block.id))
                    Blockly_Debugger.actions["Breakpoint"].disable(block.id);
                else
                    Blockly_Debugger.actions["Breakpoint"].enable(block.id);
            }
        };
        return DisableBreakpointOption;
    }

    Debuggee_Worker.AddOnDispacher(
        "breakpoint_wait_view",
        Blockly_Debugger
            .actions["Breakpoint"]
            .wait_view
    );
    Debuggee_Worker.AddOnDispacher(
        "breakpoint_reset_view",
        Blockly_Debugger
            .actions["Breakpoint"]
            .reset_view
    );
}

export function RegisterDebuggerRunToCursorFunctionality(visualDebugger) {
    Blockly_Debugger.actions["RunToCursor"] = {};

    // Run to Cursor
    Blockly_Debugger.actions["RunToCursor"].handler = (block_id) => {
        if (!Debuggee_Worker.hasInstance()) {
            Blockly_Debugger.actions["Start"].handler(block_id);
            return;
        };
        Debuggee_Worker.Instance().postMessage({ "type": "runToCursor", "data": block_id });
    }
    
    Blockly_Debugger.actions["RunToCursor"].menuOption = (block) => {
        var runToCursorOption = {
            text: "Run to cursor",
            enabled: true,
            callback: function () {
                Blockly_Debugger.actions["RunToCursor"].handler(block.id);
            }
        };
        return runToCursorOption;
    }

}
