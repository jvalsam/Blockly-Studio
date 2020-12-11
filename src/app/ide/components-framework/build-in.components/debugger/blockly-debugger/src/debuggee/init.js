
export var window = {};

export var Blockly_Debuggee = {
    actions: {}
};

export function InitializeBlocklyDebuggee (plugin) {
    Blockly_Debuggee.state = {
        currNest: 0,
        currId: '',
        promptMsg: undefined,
        alertFlag: false,
        stepWait: false,
        currState: {
            stepIn: false,
            stepOver: false,
            stepParent: false,
            stepOut: false,
            continue: true
        },
        isState: function (state) {
            return this.currState[state];
        },
        setState: function (new_state) {
            this.currState["stepIn"] = false;
            this.currState["stepOver"] = false;
            this.currState["stepParent"] = false;
            this.currState["stepOut"] = false;
            this.currState["continue"] = false;
            this.currState[new_state] = true;
        }
    };


    Blockly_Debuggee.wait = (function () {
        function highlightBlock(id, currentSystemEditorId) {
            plugin.postMessage(
                {
                    "type": "highlightBlock",
                    "data": {
                        "id": id,
                        "currentSystemEditorId": currentSystemEditorId
                    }
                });
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function next_message() {
            return sleep(0);
        }

        async function wait(nest, block_id, currentSystemEditorId) {
            highlightBlock(block_id, currentSystemEditorId);

            var hasBreakpoint = Blockly_Debuggee.actions.breakpoint.includes_enable(block_id) || (Blockly_Debuggee.actions["runToCursor"].cursorBreakpoint === block_id);
            if ((Blockly_Debuggee.actions["runToCursor"].cursorBreakpoint === block_id))
                Blockly_Debuggee.actions["runToCursor"].cursorBreakpoint = "";
            if (Blockly_Debuggee.state.isState("continue") && !hasBreakpoint) {
                Blockly_Debuggee.state.currNest = nest;
                return;
            }
            if (Blockly_Debuggee.state.currNest == -1 && !hasBreakpoint) return;    // stepOver + stepOut for functions                   
            if (Blockly_Debuggee.state.isState("stepIn") || hasBreakpoint || nest <= Blockly_Debuggee.state.currNest) {
                if (Blockly_Debuggee.state.currId === block_id && !hasBreakpoint) return;
                if (Blockly_Debuggee.state.isState("stepParent") && nest == Blockly_Debuggee.state.currNest && !hasBreakpoint) return;

                // Send the array with vars values 
                Blockly_Debuggee.actions["variables"].updateDebugger();
                Blockly_Debuggee.actions["watch"].updateDebugger();
                Blockly_Debuggee.actions["breakpoint"].wait_view(block_id);

                while (!Blockly_Debuggee.state.stepWait) {
                    await next_message();
                }
                Blockly_Debuggee.actions["breakpoint"].reset_view(block_id);

                Blockly_Debuggee.state.stepWait = false;
                Blockly_Debuggee.state.currId = block_id;
                if (Blockly_Debuggee.state.isState("stepOut")) {
                    Blockly_Debuggee.state.currNest = -1;
                    Blockly_Debuggee.state.currState.stepOut = false;
                } else {
                    Blockly_Debuggee.state.currNest = nest;
                }
            }
        };
        return wait;
    })();


    Blockly_Debuggee.function_return_decorator = function (return_value, parent_nest) {
        if (Blockly_Debuggee.state.currNest != -1)
            Blockly_Debuggee.state.currState.parent = false;
        Blockly_Debuggee.state.currNest = parent_nest;
        return return_value;
    };

    window.alert = async function (msg) {
        Blockly_Debuggee.actions["variables"].updateDebugger();     // gia na fainontai swsta kata to alert ta value pisw ston pinaka
        Blockly_Debuggee.actions["watch"].updateDebugger();
        setTimeout(function () { /*plugin.*/postMessage({ "type": "alert", "data": msg }); }, 50);
        while (!Blockly_Debuggee.state.alertFlag) {
            await (function () { return new Promise(resolve => setTimeout(resolve, 0)); })();         // next_message();
        }
        Blockly_Debuggee.state.alertFlag = false;
    };
    window.prompt = async function (msg) {
        Blockly_Debuggee.actions["variables"].updateDebugger();     // gia na fainontai swsta kata to prompt ta value pisw ston pinaka
        Blockly_Debuggee.actions["watch"].updateDebugger();
        setTimeout(function () { /*plugin.*/postMessage({ "type": "prompt", "data": msg }); }, 50);
        while (Blockly_Debuggee.state.promptMsg == undefined) {
            await (function () { return new Promise(resolve => setTimeout(resolve, 0)); })();         // next_message();
        }
        var tmp = Blockly_Debuggee.state.promptMsg;
        Blockly_Debuggee.state.promptMsg = undefined;
        return tmp;
    };
}

export var dispatcher = {
    prompt: (promptMsg) => {
        Blockly_Debuggee.state.promptMsg = promptMsg;
    },
    alert: () => {
        Blockly_Debuggee.state.alertFlag = true;
    }
};
