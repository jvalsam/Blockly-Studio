import './init_blockly.js';
import './src/debugger/debugger.js';

// initiate the code generator decoration
import { generation } from "./src/generator/blockly/blockly_init";
import './src/generator/blockly/generator/lists.js';
import './src/generator/blockly/generator/procedures.js';
import './src/generator/blockly/generator/text.js';
import './src/generator/blockly/core/generator.js';
import './src/generator/blockly/core/block_svg.js';
import './src/generator/blockly/core/block.js';
import './src/generator/blockly/blockly_init.js';

import {
    Debuggee_Worker,
    InitializeDebuggeeWorker
} from "./src/debugger/debugger";


export function BlocklyDebugger (plugin) {
    this.plugin = plugin;

    InitializeDebuggeeWorker(plugin);
    Debuggee_Worker.registerBreakpointsRunToCursorFunctionality();

    generation.wps = plugin.getAllBlocklyWSPs();
    generation.findBlockEditorId = (blockId) => {
        for(const editorId in generation.wps) {
            if(generation.wps[editorId].getBlockById(blockId)) {
                return generation.wps[editorId];
            }
        }
    };

    this.initiateToolbar = (selector, onReady) => {
        Debuggee_Worker.registerDebuggerActions();
        Debuggee_Worker.RegisterContinueDebuggerAction("ContinueButton");

        Debuggee_Worker.RegisterStartDebuggerAction(
            "StartButton",
            () => this.plugin.getEnvironmentData(),
            () => alert("actions on start")
        );
        
        Debuggee_Worker.RegisterVariablesDebuggerAction("variables");
        Debuggee_Worker.RegisterWatchDebuggerAction("watches");
        Debuggee_Worker.RegisterStopDebuggerAction("StopButton");
        Debuggee_Worker.RegisterStepInDebuggerAction("StepInButton");
        Debuggee_Worker.RegisterStepOutDebuggerAction("StepOutButton");
        Debuggee_Worker.RegisterStepOverDebuggerAction("StepOverButton");
        Debuggee_Worker.RegisterStepParentDebuggerAction("StepParentButton");

        onReady();
    };
}
