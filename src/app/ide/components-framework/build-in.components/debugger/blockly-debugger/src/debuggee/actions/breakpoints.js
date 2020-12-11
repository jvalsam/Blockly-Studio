import {Blockly_Debuggee, dispatcher} from '../init.js';


export function BlocklyDebuggeeeBreakpointsAction(plugin) {
    Blockly_Debuggee.actions["breakpoint"] = (function(){
        var breakpoints = [];
        function handler(br){
            breakpoints = br;
        };

        function includes_enable(block_id){
            // check also if the breakpoint is enable
            return breakpoints.map((obj)=>{if(obj.enable) return obj.block_id}).includes(block_id);
        };
        
        function update(updated){
            breakpoints = updated;
        };

        function wait_view(block_id){
            if(includes_enable(block_id))
                plugin.postMessage({"type": "breakpoint_wait_view", "data" : block_id});
        }

        function reset_view(block_id){
            if(includes_enable(block_id))
                plugin.postMessage({"type": "breakpoint_reset_view", "data" : block_id});
        }

        return {
            handler : handler,
            includes_enable: includes_enable,
            update : update,
            wait_view : wait_view,
            reset_view : reset_view
        };
    })();
    dispatcher.breakpoint = Blockly_Debuggee.actions["breakpoint"].handler;
}

export function BlocklyDebuggeeeRunToCursor() {
    Blockly_Debuggee.actions["runToCursor"] = (function(){
        var cursorBreakpoint = "";
        function handler(block_id){
            Blockly_Debuggee.actions["runToCursor"].cursorBreakpoint = block_id;
            Blockly_Debuggee.state.stepWait = true;
        }

        return {
            cursorBreakpoint : cursorBreakpoint,
            handler : handler
        }
    })();
    dispatcher.runToCursor = Blockly_Debuggee.actions["runToCursor"].handler;
}
