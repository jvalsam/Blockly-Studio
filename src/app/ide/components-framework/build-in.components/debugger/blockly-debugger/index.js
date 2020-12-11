import './init_blockly.js';
import './src/debugger/debugger.js';

// initiate the code generator decoration
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
