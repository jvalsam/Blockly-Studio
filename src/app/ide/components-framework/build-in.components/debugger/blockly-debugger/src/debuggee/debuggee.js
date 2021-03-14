import "./init.js";
import { InitializeBlocklyDebuggee, dispatcher } from "./init.js";

import { BlocklyDebuggeeStartAction } from "./actions/start.js";
import {
    BlocklyDebuggeeWatchAction,
    BlocklyDebuggeeVariablesAction,
    BlocklyDebuggeeEvalAction
} from "./actions/watches.js";
import { BlocklyDebuggeeContinueAction } from "./actions/continue.js";
import {
    BlocklyDebuggeeStepInAction,
    BlocklyDebuggeeStepOverAction,
    BlocklyDebuggeeStepOutAction,
    BlocklyDebuggeeStepParentAction
} from "./actions/steps.js";
import {
    BlocklyDebuggeeeBreakpointsAction,
    BlocklyDebuggeeeRunToCursor
} from "./actions/breakpoints.js";


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

    this.onmessage = (msg) => {
        dispatcher[msg.type](msg.data);
    };
}
