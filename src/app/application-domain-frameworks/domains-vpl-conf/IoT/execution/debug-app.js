import {
    dispatcher,
    Blockly_Debuggee,
    window
} from '../../../../ide/components-framework/build-in.components/debugger/blockly-debugger/src/debuggee/init.js';


export async function StartApplication(runTimeData) {
    var variables = Blockly_Debuggee
        .actions["variables"]
        .getVariables();
    var watches = Blockly_Debuggee
        .actions["watch"]
        .getWatches();
    var def_variables_code = Blockly_Debuggee
        .actions["variables"]
        .define_variables();
    var update_values = runTimeData.update_values;
    function evalLocal(expr) {
        eval(expr);
    }

    var variablesWatches_code = 
        `eval(update_values());
            Blockly_Debuggee
            .actions[\"variables\"]
            .updateDebugger();
        Blockly_Debuggee
            .actions[\"watch\"]
            .updateDebugger();`;

    await eval(def_variables_code);
    
    Blockly_Debuggee
            .actions["eval"]
            .evalLocal = evalLocal;

    var finalAppCode = "";

    // TODO: code building...
    // just code gen for testing
    runTimeData.execData.project.AutomationTasks.forEach(
        (events) => {
            finalAppCode += (
                "(async () => {"
                + events.editorsData[0].generated
                + "})()"
          );
        }
    );

    await eval(
        `async function code(){
            ${ finalAppCode }
            ${ variablesWatches_code }
        };
        code();`
    );

    runTimeData.postMessage({ "type": "execution_finished" });
}
  
export async function StopApplication(execData) {
    alert("stop my application");
}

export async function PauseApplication(execData) {
    alert("pause my application");
}

export async function ContinueApplication(execData) {
    alert("continue my application");
}
