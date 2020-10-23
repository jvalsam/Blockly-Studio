import {Blockly_Debuggee, dispatcher} from '../init.js';

Blockly_Debuggee.actions.continue = {};

Blockly_Debuggee.actions.continue.handler = () => {
  Blockly_Debuggee.state.stepWait = true;
  Blockly_Debuggee.state.setState("continue");
};

dispatcher.continue = Blockly_Debuggee.actions["continue"].handler;