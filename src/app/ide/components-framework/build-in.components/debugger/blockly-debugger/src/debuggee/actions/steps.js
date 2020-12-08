import {Blockly_Debuggee, dispatcher} from '../init.js';

Blockly_Debuggee.actions.stepIn = {};
Blockly_Debuggee.actions.stepOver = {};
Blockly_Debuggee.actions.stepOut = {};
Blockly_Debuggee.actions.stepParent = {};

Blockly_Debuggee.actions.stepIn.handler = () => {
    Blockly_Debuggee.state.stepWait = true;
    Blockly_Debuggee.state.setState("stepIn");
};

Blockly_Debuggee.actions.stepOver.handler = () => {
  Blockly_Debuggee.state.stepWait = true;
  Blockly_Debuggee.state.setState("stepOver");
};

Blockly_Debuggee.actions.stepOut.handler = () => {
  Blockly_Debuggee.state.stepWait = true;
  Blockly_Debuggee.state.setState("stepOut");
};

Blockly_Debuggee.actions.stepParent.handler = () => {
  Blockly_Debuggee.state.stepWait = true;
  Blockly_Debuggee.state.setState("stepParent");
};

dispatcher.stepIn = Blockly_Debuggee.actions["stepIn"].handler;
dispatcher.stepOver = Blockly_Debuggee.actions["stepOver"].handler;
dispatcher.stepOut = Blockly_Debuggee.actions["stepOut"].handler;
dispatcher.stepParent = Blockly_Debuggee.actions["stepParent"].handler;