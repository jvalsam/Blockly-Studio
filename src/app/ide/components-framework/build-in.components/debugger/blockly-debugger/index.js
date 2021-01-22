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
import { Toolbar, Toolbar_API_Examples } from "./ui-toolbar/Toolbar.js";

import {
    Debuggee_Worker,
    InitializeDebuggeeWorker
} from "./src/debugger/debugger";


export function BlocklyDebugger(plugin) {
    this.plugin = plugin;

    InitializeDebuggeeWorker(plugin, this);
    Debuggee_Worker.registerBreakpointsRunToCursorFunctionality();

    generation.workspaces = plugin.getAllBlocklyWSPs();
    generation.findBlockEditorId = (blockId) => {
        for (const editorId in generation.workspaces) {
            if (generation.workspaces[editorId].getBlockById(blockId)) {
                return editorId;
            }
        }
    };
    generation.getBlocklyWSP = (editorId) => {
        return generation.workspaces[editorId];
    };

    this.initiateToolbar = (selector, onReady) => {
        let data = [{
            'name': 'Conditional Task 1',
            'parent': 'Automations for Conditional Tasks',
            'icon': false
        },
        {
            'name': 'Scheduled Task 4',
            'parent': 'Automations for Scheduled Tasks',
            'icon': false
        }];
        let data2 =[{
            'name': 'Scheduled Task 1',
            'parent': 'Automations for Scheduled Tasks',
            'icon': false
        },{
            'name': 'Scheduled Task 2',
            'parent': 'Automations for Scheduled Tasks',
            'icon': false
        },{
            'name': 'Conditional Task 1',
            'parent': 'Automations for Conditional Tasks',
            'icon': false
        },
        {
            'name': 'Scheduled Task 4',
            'parent': 'Automations for Scheduled Tasks',
            'icon': false
        }]; 
        this.toolbar_ui = new Toolbar(selector, () => {
            $('#debugger-close').click(function () {
                $('#debugger-toolbar').toggle();
                $('#debugger-toggle').show();
            });

            $('#debugger-toggle').click(function () {
                $('#debugger-toolbar').toggle();
                $('#debugger-toggle').hide();
            });

            Debuggee_Worker.registerDebuggerActions();
            Debuggee_Worker.RegisterContinueDebuggerAction("ContinueButton");

            /*Debuggee_Worker.RegisterStartDebuggerAction(
                "StartButton",
                () => this.plugin.getEnvironmentData(),
                () => alert("actions on start")
            );*/
            //Debuggee_Worker.RegisterVariablesDebuggerAction("variables");
            //Debuggee_Worker.RegisterWatchDebuggerAction("watches");
            //Debuggee_Worker.RegisterStopDebuggerAction("StopButton");
            Debuggee_Worker.RegisterStepInDebuggerAction("StepInButton");
            Debuggee_Worker.RegisterStepOutDebuggerAction("StepOutButton");
            Debuggee_Worker.RegisterStepOverDebuggerAction("StepOverButton");
            Debuggee_Worker.RegisterStepParentDebuggerAction("StepParentButton");
            //onReady();
        });
        this.toolbar_ui.createVariables(data2);
    };

    this.onmessage = (msg, callback) => {
        Debuggee_Worker.getInstance().onmessage(msg);
    };
}
