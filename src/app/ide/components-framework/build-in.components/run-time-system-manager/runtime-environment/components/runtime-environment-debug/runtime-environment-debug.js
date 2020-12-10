import {
    RuntimeEnvironmentScriptsHolder
} from "../../runtime-environment-scripts-holder.js"


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

        // TODO: find debugger back-end and request for the front-end debugger to start view

        this.start(this._envData);
    }

    // has to be executed per visual programming statement
    _handleRuntime() {
        if (this.state === EnvironmentState.STOPPED) {
            this.promiseStopApp("StopApplication");
        }
        else if (this.state === EnvironmentState.PAUSED) {
            this.promiseStopApp("PauseApplication");
        }
    }

    _handleStopAction(action) {
        if (action === "StopApplication") {
            this.onStop();
        }
        else if (action === "PauseApplication") {
            this.onPause();
        }
        else {
            throw "Runtime Environment Error: Not supported action: " + e;
        }
    }

    handleOnError(message) {
        alert("stop action failed by run-time system.\n" + message);
        this.callbackOnStop();
    }

    start(applicationData) {
        const promise = new Promise((resolve, reject) => {
            this.promiseStopApp = reject;
            applicationData.onFinish = resolve;
            this._executionScript.StartApplication(applicationData);
        });
        promise
            .then(finish => this._handleStopAction("StopApplication"))
            .catch (stopAction => this._handleStopAction(stopAction));
    }

    stop(onSuccess) {
        this.state = EnvironmentState.STOPPED;
        this.callbackOnStop = onSuccess;
    }

    onStop() {
        const promise = new Promise((resolve, reject) => {
            // TODO: stop the backend-debugger
            this._executionScript.StopApplication(resolve, reject);
        });
        promise
            .then(finish => this.callbackOnStop())
            .catch(message => this.handleOnError(message));
    }

    pause() {
        this._executionScript.PauseApplication();
    }

    continue() {
        this._executionScript.ContinueApplication();
    }

    receiveFrontendMessage(message, callback) {
        
    }
}
