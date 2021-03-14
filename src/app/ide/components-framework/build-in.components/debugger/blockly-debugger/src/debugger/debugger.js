import { generation } from "../generator/blockly/blockly_init";
import { RegisterContinueDebuggerAction } from "./actions/continue";
import { RegisterStartDebuggerAction } from "./actions/start";
import {
    RegisterVariablesDebuggerAction,
    RegisterWatchDebuggerAction,
    RegisterEvalDebuggerAction,
} from "./actions/watches";
import {
    RegisterStepInDebuggerAction,
    RegisterStepOutDebuggerAction,
    RegisterStepOverDebuggerAction,
    RegisterStepParentDebuggerAction
} from "./actions/step";
import { RegisterStopDebuggerAction } from "./actions/stop";
import {
    RegisterDebuggerBreakpointFunctionality,
    RegisterDebuggerRunToCursorFunctionality
} from "./actions/breakpoints";

export var Debuggee_Worker = null;

export var InitializeDebuggeeWorker = function (plugin) {
    var instance;
    var dispatcher = {};

    function getInstance() {
        if (instance === undefined) {
            instance = {};	 // to path apo to localhost kai oxi apo edw
            initDispacher();
            
            // establish the communication
            instance.onmessage = function (msg) {
                dispatcher[msg.type](msg.data);
            };
            instance.postMessage = (msg) => {
                plugin.postMessage(msg);
            };
        }
        return instance;
    }

    function Stop() {
        if (!hasInstance()) return;
        instance.terminate();
        instance = undefined;
    }

    function AddOnDispacher(event, callback) {
        dispatcher[event] = callback;
    }

    function hasInstance() {
        if (instance === undefined) return false;
        else return true;
    }

    function initDispacher() {
        dispatcher["alert"] = (msg) => {
            window.alert(msg);
            Debuggee_Worker.Instance().postMessage({ "type": "alert", "data": [""] });
        };
        dispatcher["prompt"] = (msg) => {
            Debuggee_Worker.Instance().postMessage({ "type": "prompt", "data": window.prompt(msg) });
        };
        dispatcher["highlightBlock"] = (data) => {
            // it entered here with editor null
            //
            let blocklyWSP = generation.getBlocklyWSP(data.currentSystemEditorId);
            
            generation.workspaces[data.currentSystemEditorId].wsp.traceOn_ = true;
            generation.workspaces[data.currentSystemEditorId].highlightBlock(data.id);
        };
        dispatcher["execution_finished"] = () => {
            instance = undefined;
            // document.getElementById("val_table").innerHTML = '';
        };
    };

    function registerBreakpointsRunToCursorFunctionality () {
        RegisterDebuggerBreakpointFunctionality(plugin);
        RegisterDebuggerRunToCursorFunctionality(plugin);
    }

    Debuggee_Worker = {
        Instance: getInstance,
        Stop: Stop,
        AddOnDispacher: AddOnDispacher,
        hasInstance: hasInstance,
        //
        registerBreakpointsRunToCursorFunctionality: registerBreakpointsRunToCursorFunctionality,
        //
        RegisterContinueDebuggerAction : () => RegisterContinueDebuggerAction(),
        RegisterStartDebuggerAction : (selector, handler) => RegisterStartDebuggerAction(selector, handler),
        RegisterVariablesDebuggerAction : (selector) => RegisterVariablesDebuggerAction(selector),
        RegisterWatchDebuggerAction : (selector) => RegisterWatchDebuggerAction(selector),
        RegisterStopDebuggerAction : () => RegisterStopDebuggerAction(),
        RegisterStepInDebuggerAction : () => RegisterStepInDebuggerAction(),
        RegisterStepOutDebuggerAction : () => RegisterStepOutDebuggerAction(),
        RegisterStepOverDebuggerAction : () => RegisterStepOverDebuggerAction(),
        RegisterStepParentDebuggerAction : () => RegisterStepParentDebuggerAction(),

        RegisterEvalDebuggerAction: () => RegisterEvalDebuggerAction()
    };
};

export var Blockly_Debugger = {
    actions: {},
    addDebuggerAction: (id, handler) => {
        document.getElementById(id).onclick = handler;
    }
};
