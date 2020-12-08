import {Debuggee_Worker, Blockly_Debugger} from '../init.js';

Blockly_Debugger.actions["Continue"] = {};

Blockly_Debugger.actions["Continue"].handler = () => {
    Debuggee_Worker.Instance().postMessage({"type":"continue"});
}