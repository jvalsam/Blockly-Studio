import {
    dispatcher,
    Blockly_Debuggee,
    window
} from '../../../../ide/components-framework/build-in.components/debugger/blockly-debugger/src/debuggee/init.js';

import {
    BlocklyDebuggeeStartAction
} from "../../../../ide/components-framework/build-in.components/debugger/blockly-debugger/src/debuggee/actions/start.js";

var debuggerEnvironmentVariables = [

];

var watches;

function DebuggerAddNode (id, type, parent, text, icon, color) {
    debuggerEnvironmentVariables.push({
        id: id,
        type: type,
        parent: parent,
        text: text,
        icon: icon,
        color: color,
        state: {
            opened: true
        },
        options: false
    });
}

function InitializePredefinedDebuggerNodes(project) {
    if (project.SmartObjects.length > 0)
        debuggerEnvironmentVariables.push({
            icon: "fas fa-wifi",
            id: "debugger_jstree_SmartObjects",
            options: false,
            parent: "#",
            state: {opened: true},
            text: "Smart Devices",
            type: "SmartObjects"
        });
    
    if (project.ConditionalEvents.length > 0)
        debuggerEnvironmentVariables.push({
            icon: "fas fa-code-branch",
            id: "debugger_jstree_ConditionalEvents",
            options: false,
            parent: "#",
            state: {opened: true},
            text: "Conditional Tasks",
            type: "ConditionalEvents"
        });

    if (project.CalendarEvents.length > 0)
        debuggerEnvironmentVariables.push({
            icon: "fas fa-calendar-alt",
            id: "debugger_jstree_CalendarEvents",
            options: false,
            parent: "#",
            state: {opened: true},
            text: "Scheduled Tasks",
            type: "CalendarEvents"
        });

    if (project.AutomationTasks.length > 0)
        debuggerEnvironmentVariables.push({
            icon: "fas fa-tasks",
            id: "debugger_jstree_AutomationTasks",
            options: false,
            parent: "#",
            state: {opened: true},
            text: "Basic Tasks",
            type: "AutomationTasks"
        });
}

function AddCategoryPelemsDebuggerNodes(categoryData, parentName) {
    categoryData.forEach(pelem => {
        DebuggerAddNode(
            "debugger_" + pelem.id,
            pelem.type,
            parentName,
            pelem.title,
            pelem.img,
            pelem.color
        );
    });
}

function AddSmartDevicesVariables(smartObjects) {
    smartObjects.forEach(smartObject => {
        // add smart device properties
        smartObject.editorsData[0].generated.details.properties.forEach(property => {
            debuggerEnvironmentVariables.push({
                icon: "fas fa-bullseye",
                id: "debugger_" + smartObject.id + "_" + property.name,
                options: false,
                parent: "debugger_" + smartObject.id,
                state: {opened: true},
                text: property.name + " : " + property.value,
                type: smartObject.type + "_property"
            });
        });
        // add smart device actions
        for (let i = 1; i < smartObject.editorsData.length; ++i) {
            let blocklyEditorDataIndex = smartObject.editorsData[0]
                .generated
                .details
                .blocklyEditorDataIndex;
            
            let actionName = Object.keys(blocklyEditorDataIndex)
                .find(key => blocklyEditorDataIndex[key] === i);
            
            debuggerEnvironmentVariables.push({
                icon: "fas fa-puzzle-piece",
                id: "debugger_" + smartObject.id + "_" + actionName,
                options: false,
                parent: "debugger_" + smartObject.id,
                state: {opened: true},
                text: actionName,
                type: smartObject.type + "_action"
            });

            smartObject.editorsData[i].generated.variables.forEach (variable => {
                debuggerEnvironmentVariables.push({
                    icon: "fas fa-cube",
                    id: "debugger_" + smartObject.id + "_" + actionName + "_" + variable,
                    options: false,
                    parent: "debugger_" + smartObject.id + "_" + actionName,
                    state: {opened: true},
                    text: variable + " : undefined",
                    type: smartObject.type + "_action_variable",
                    // blockly debugger information
                    isBlocklyVariable: true,
                    variableName: variable,
                    variableValue: undefined
                });
            });
        }
    });
}

function AddAutomationsVariables(automations) {
    automations.forEach(automation => {
        automation.editorsData[0].generated.variables.forEach(variable => {
            debuggerEnvironmentVariables.push({
                icon: "fas fa-cube",
                id: "debugger_" + automation.id + "_" + variable,
                options: false,
                parent: "debugger_" + automation.id,
                state: {opened: true},
                text: variable + " : undefined",
                type: automation.type + "_variable",
                // blockly debugger information
                isBlocklyVariable: true,
                variableName: variable,
                variableValue: undefined
            });
        });
    });
}

export async function StartApplication(runTimeData) {
    let debuggeeActions = BlocklyDebuggeeStartAction();

    // initialize functions of debugge that are used in generated source
    let $id = debuggeeActions.$id;
    let wait = debuggeeActions.wait;
    let isStepOver = debuggeeActions.isStepOver;
    let isStepParent = debuggeeActions.isStepParent;

    // init variables for UI toolbar
    InitializePredefinedDebuggerNodes(runTimeData.execData.project);
    // collect pelements
    AddCategoryPelemsDebuggerNodes(
        runTimeData.execData.project.SmartObjects,
        "debugger_jstree_SmartObjects"
    );
    AddCategoryPelemsDebuggerNodes(
        runTimeData.execData.project.ConditionalEvents,
        "debugger_jstree_ConditionalEvents"
    );
    AddCategoryPelemsDebuggerNodes(
        runTimeData.execData.project.CalendarEvents,
        "debugger_jstree_CalendarEvents"
    );
    AddCategoryPelemsDebuggerNodes(
        runTimeData.execData.project.AutomationTasks,
        "debugger_jstree_AutomationTasks"
    );
    // collect variables
    AddAutomationsVariables(runTimeData.execData.project.ConditionalEvents);
    AddAutomationsVariables(runTimeData.execData.project.CalendarEvents);
    AddAutomationsVariables(runTimeData.execData.project.AutomationTasks);
    AddSmartDevicesVariables(runTimeData.execData.project.SmartObjects);
    
    // notify debugger for environment variables tree
    runTimeData.RuntimeEnvironmentDebug.functionRequest(
        "Debugger",
        "setEnvironmentVariablesTree",
        [
            debuggerEnvironmentVariables
        ],
        {
            type: "async",
            func: async (debuggerContent) => {
                //todo: build rest data to init debuggee
                debuggerContent.variables = debuggerEnvironmentVariables;

                debuggeeActions.init(debuggerContent);
                
                // iniate variables for the debugger toolbar
                watches = debuggerContent.watches;

                var update_values = (pelemId) => {
                    var update_var = Blockly_Debuggee
                        .actions["variables"]
                        .update_values(pelemId);
                    var update_watch = Blockly_Debuggee
                        .actions["watch"]
                        .update_values(pelemId);
                    return update_var + update_watch;
                }

                function evalLocal(expr) {
                    eval(expr);
                }

                var variablesWatches_code = 
                    `eval(update_values(debuggerScopeId));
                        Blockly_Debuggee
                        .actions[\"variables\"]
                        .updateDebugger();
                    Blockly_Debuggee
                        .actions[\"watch\"]
                        .updateDebugger();`;
                
                Blockly_Debuggee
                        .actions["eval"]
                        .evalLocal = evalLocal;

                var finalAppCode = "";

                runTimeData.execData.project.AutomationTasks.forEach(
                    (basicTask) => {
                        let variablesDef = "";
                        basicTask.editorsData[0]
                            .generated
                            .variables
                            .forEach(variable => {
                                variablesDef += "let " + variable + ";\n";
                            });

                        finalAppCode += 
                            "(async () => {"
                            + "let projectElementId = " + JSON.stringify(basicTask.id) + ";"
                            + "let debuggerScopeId = " + JSON.stringify("debugger_" + basicTask.id) + ";"
                            + variablesDef
                            + basicTask.editorsData[0].generated.src
                            + variablesWatches_code
                            + "})()";
                    }
                );

                await eval(
                    `async function code(){
                        ${ finalAppCode }
                    };
                    code();`
                );

                runTimeData.RuntimeEnvironmentDebug.postMessage({ "type": "execution_finished" });
            }
        });
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
