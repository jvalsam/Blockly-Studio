import {Debuggee_Worker, Blockly_Debugger} from '../debugger.js';


export function RegisterStepInDebuggerAction() {
    Blockly_Debugger.actions["StepIn"] = {}; 
    Blockly_Debugger.actions["StepIn"].handler = () => {
        if(!Debuggee_Worker.hasInstance()) return; 
        Debuggee_Worker.Instance().postMessage({"type":"stepIn"});
    }

    return Blockly_Debugger.actions["StepIn"].handler;
}

export function RegisterStepOverDebuggerAction() {
    Blockly_Debugger.actions["StepOver"] = {};
    Blockly_Debugger.actions["StepOver"].handler = () => {
        if(!Debuggee_Worker.hasInstance()) return; 
        Debuggee_Worker.Instance().postMessage({"type":"stepOver"});
    }
    
    return Blockly_Debugger.actions["StepOver"].handler;
}

export function RegisterStepParentDebuggerAction() {
    Blockly_Debugger.actions["StepParent"] = {};
    Blockly_Debugger.actions["StepParent"].handler = () => {
        if(!Debuggee_Worker.hasInstance()) return; 
        Debuggee_Worker.Instance().postMessage({"type":"stepParent"});
    }
    
    return Blockly_Debugger.actions["StepParent"].handler;
}

export function RegisterStepOutDebuggerAction() {
    Blockly_Debugger.actions["StepOut"] = {}; 
    Blockly_Debugger.actions["StepOut"].handler = () => {
        if(!Debuggee_Worker.hasInstance()) return; 
        Debuggee_Worker.Instance().postMessage({"type":"stepOut"});
    }

    return Blockly_Debugger.actions["StepOut"].handler;
}
