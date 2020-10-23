import {Debuggee_Worker, Blockly_Debugger} from '../init.js';

Blockly_Debugger.actions["StepIn"] = {}; 
Blockly_Debugger.actions["StepOver"] = {};
Blockly_Debugger.actions["StepParent"] = {};
Blockly_Debugger.actions["StepOut"] = {}; 

Blockly_Debugger.actions["StepIn"].handler = () => {
    if(!Debuggee_Worker.hasInstance()) return; 
    Debuggee_Worker.Instance().postMessage({"type":"stepIn"});
}

Blockly_Debugger.actions["StepOver"].handler = () => {
    if(!Debuggee_Worker.hasInstance()) return; 
    Debuggee_Worker.Instance().postMessage({"type":"stepOver"});
}

Blockly_Debugger.actions["StepParent"].handler = () => {
    if(!Debuggee_Worker.hasInstance()) return; 
    Debuggee_Worker.Instance().postMessage({"type":"stepParent"});
}

Blockly_Debugger.actions["StepOut"].handler = () => {
    if(!Debuggee_Worker.hasInstance()) return; 
    Debuggee_Worker.Instance().postMessage({"type":"stepOut"});
}