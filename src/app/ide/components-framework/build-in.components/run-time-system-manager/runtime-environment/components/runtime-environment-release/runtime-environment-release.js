import {
    RuntimeEnvironmentScriptsHolder
} from "../../runtime-environment-scripts-holder.js"


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
        this._envData.UISelector = document.getElementById(
          "run-application-view-container"
        );
        this._envData.RuntimeEnvironmentRelease = this;
        this._envData.runtimeEnvironment = this._runtimeEnv;

        this.start(this._envData);
    }

    _onApplicationFinish() {
        alert("functionality on finish application is not implemented");
    }

    start(applicationData) {
        const promise = new Promise((resolve, reject) => {
            this.promiseStopApp = reject;
            applicationData.onFinish = resolve;
            this._executionScript.StartApplication(applicationData);
        });
        promise
            .then(finish => this._onApplicationFinish())
            .catch(stopAction => this._handleStopAction(stopAction));
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

    // has to be executed per visual programming statement
    _handleRuntime() {
        if (this.state === EnvironmentState.STOPPED) {
            this.promiseStopApp("StopApplication");
        }
        else if (this.state === EnvironmentState.PAUSED) {
            this.promiseStopApp("PauseApplication");
        }
    }

    handleOnError(message) {
        alert("stop action failed by run-time system.\n" + message);
        this.callbackOnStop();
    }

    // when user choose to stop the app
    stop(onSuccess) {
        this.state = EnvironmentState.STOPPED;
        this.callbackOnStop = onSuccess;
    }

    onStop() {
        const promise = new Promise((resolve, reject) => {
            this._executionScript.StopApplication(resolve, reject);
        });
        promise
            .then(finish => this.callbackOnStop())
            .catch(message => this.handleOnError(message));
    }

    pause(onSuccess) {
        this.state = EnvironmentState.PAUSED;
        this.callbackOnPause = onSuccess;
    }

    onPause() {
        const promise = new Promise((resolve, reject) => {
            this._executionScript.PauseApplication(resolve, reject);
        });
        promise
            .then(finish => this.callbackOnStop())
            .catch(message => this.handleOnError(message));
    }

    continue(onSuccess) {
        this.state = EnvironmentState.RUNNING;
        this.callbackOnContinue = onSuccess;
    }

    onContinue() {
        const promise = new Promise((resolve, reject) => {
            this.promiseStopApp = reject;
            applicationData.onFinish = resolve;
            this._executionScript.StartApplication(applicationData);
        });
        promise
            .then(finish => console.log("run app finished"))
            .catch(stopAction => this._handleStopAction(stopAction));
    }

    browseBlocklyBlock(projectElementId, blockId) {
        this._runtimeEnv.functionRequest(
            RuntimeEnvironmentRelease.name,
            "RuntimeManager",
            "foldLivePreview",
            []
        );
        
        this._runtimeEnv.functionRequest(
          RuntimeEnvironmentRelease.name,
          "BlocklyVPL",
          "highlightBlockOfPItem",
            [
                projectElementId,
                blockId
            ]);
    }

    saveComponentsData(){
        this._runtimeEnv.functionRequest(
            RuntimeEnvironmentRelease.name,
            "RuntimeManager",
            "foldLivePreview",
            []
        );
        
        this._runtimeEnv.functionRequest(
          RuntimeEnvironmentRelease.name,
          "BlocklyVPL",
          "highlightBlockOfPItem",
            [
                projectElementId,
                blockId
            ]);
    }
}