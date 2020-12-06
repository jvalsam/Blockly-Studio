import { RuntimeEnvironmentScriptsHolder } from "../../runtime-environment-scripts-holder.js"

export const EnvironmentState = {
    INIT: "init",
    RUNNING: "running",
    STOPPED: "stopped",
    PAUSED: "paused"
};

export class RuntimeEnvironmentDebug {
    constructor(runtimeEnv) {
        this._runtimeEnv = runtimeEnv;
        this.state = EnvironmentState.INIT;
    }

    loadEnvironmentData(envData) {
        this.state = EnvironmentState.RUNNING;
        this._envData = envData;

        this._executionScript = RuntimeEnvironmentScriptsHolder
            .executionDomainFunctions(this._envData.domainType);
        
        // pin callback that checks runtime environment state
        this._envData.checkRuntimeEnvironment = () => this._handleRuntime();

        this.start(this._envData);
    }

    start(envData) {
        this._executionScript.StartApplication(envData);
    }

    stop(onSuccess) {
        this.state = EnvironmentState.STOPPED;
        this.callbackOnStop = onSuccess;
    }

    onStop() {
        this._executionScript.StopApplication();
        this.this.callbackOnStop();
    }

    pause() {
        this._executionScript.PauseApplication();
    }

    continue() {
        this._executionScript.ContinueApplication();
    }
}