import { RuntimeEnvironmentScriptsHolder } from "../../runtime-environment-scripts-holder.js"

export const EnvironmentState = {
    INIT: "init",
    RUNNING: "running",
    STOPPED: "stopped",
    PAUSED: "paused"
};

export class RuntimeEnvironmentRelease {
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

    start(applicationData) {
        try {
            this._executionScript.StartApplication(applicationData);
        }
        catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        if (e.message === "StopApplication") {
            this.onStop();
        }
        else if (e.message === "PauseApplication") {
            this.onPause();
        }
        else {
            throw e;
        }
    }

    // has to be executed per visual programming statement
    _handleRuntime() {
        if (this.state === EnvironmentState.STOPPED) {
            throw new Error("StopApplication");
        }
        else if (this.state === EnvironmentState.PAUSED) {
            throw new Error("PauseApplication");
        }
    }

    stop() {
        this.state = EnvironmentState.STOPPED;
    }

    onStop() {
        this._executionScript.StopApplication();
        // TODO: send message to refresh the UI of the IDE
        // and output consolse message bubble
    }

    pause() {
        this.state = EnvironmentState.PAUSED;
        // TODO: send message to refresh the UI of the IDE
        // and output consolse message bubble
    }

    onPause() {
        this._executionScript.PauseApplication();
    }

    continue() {
        this.state = EnvironmentState.RUNNING;
        try {
            this._executionScript.ContinueApplication();
        }
        catch (e) {
            this._handleError(e);
        }
    }
}