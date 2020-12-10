import { Blockly_Debuggee, dispatcher } from '../init.js';

export function BlocklyDebuggeeStepInAction() {
  Blockly_Debuggee.actions.stepIn = {};
  Blockly_Debuggee.actions.stepIn.handler = () => {
    Blockly_Debuggee.state.stepWait = true;
    Blockly_Debuggee.state.setState("stepIn");
  };
  dispatcher.stepIn = Blockly_Debuggee.actions["stepIn"].handler;
}

export function BlocklyDebuggeeStepOverAction() {
  Blockly_Debuggee.actions.stepOver = {};
  Blockly_Debuggee.actions.stepOver.handler = () => {
    Blockly_Debuggee.state.stepWait = true;
    Blockly_Debuggee.state.setState("stepOver");
  };
  dispatcher.stepOver = Blockly_Debuggee.actions["stepOver"].handler;
}

export function BlocklyDebuggeeStepOutAction() {
  Blockly_Debuggee.actions.stepOut = {};
  Blockly_Debuggee.actions.stepOut.handler = () => {
    Blockly_Debuggee.state.stepWait = true;
    Blockly_Debuggee.state.setState("stepOut");
  };
  dispatcher.stepOut = Blockly_Debuggee.actions["stepOut"].handler;
}

export function BlocklyDebuggeeStepParentAction() {
  Blockly_Debuggee.actions.stepParent = {};
  Blockly_Debuggee.actions.stepParent.handler = () => {
    Blockly_Debuggee.state.stepWait = true;
    Blockly_Debuggee.state.setState("stepParent");
  };
  dispatcher.stepParent = Blockly_Debuggee.actions["stepParent"].handler;
}
