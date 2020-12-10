import "./init.js";
import { InitializeBlocklyDebuggee, dispatcher } from "./init.js";

import { BlocklyDebuggeeStartAction } from "./actions/start";
import {
    BlocklyDebuggeeWatchAction,
    BlocklyDebuggeeVariablesAction,
    BlocklyDebuggeeEvalAction
} from "./actions/watches";
import { BlocklyDebuggeeContinueAction } from "./actions/continue";
import {
    BlocklyDebuggeeStepInAction,
    BlocklyDebuggeeStepOverAction,
    BlocklyDebuggeeStepOutAction,
    BlocklyDebuggeeStepParentAction
} from "./actions/steps";
import {
    BlocklyDebuggeeeBreakpointsAction,
    BlocklyDebuggeeeRunToCursor
} from "./actions/breakpoints";

onmessage = function (msg) {
    let obj = msg.data;
    dispatcher[obj.type](obj.data);
}

export function BlocklyDebuggee (plugin) {
    InitializeBlocklyDebuggee(plugin);

    BlocklyDebuggeeStartAction(plugin);

    BlocklyDebuggeeWatchAction(plugin);
    BlocklyDebuggeeVariablesAction(plugin);
    BlocklyDebuggeeEvalAction();

    BlocklyDebuggeeContinueAction();
    BlocklyDebuggeeStepInAction();
    BlocklyDebuggeeStepOverAction();
    BlocklyDebuggeeStepOutAction();
    BlocklyDebuggeeStepParentAction();

    BlocklyDebuggeeeBreakpointsAction(plugin);
    BlocklyDebuggeeeRunToCursor();
}

/**
 * 
 */
var plugin = {
    postMessage: postMessage
};

BlocklyDebuggee(plugin);
