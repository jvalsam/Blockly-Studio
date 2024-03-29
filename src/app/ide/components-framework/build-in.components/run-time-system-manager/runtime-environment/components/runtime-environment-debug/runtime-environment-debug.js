import { RuntimeEnvironmentScriptsHolder } from "../../runtime-environment-scripts-holder.js";
import { BlocklyDebuggee } from "../../../../debugger/blockly-debugger/src/debuggee/debuggee.js";

export const EnvironmentState = {
  INIT: "init",
  RUNNING: "running",
  STOPPED: "stopped",
  PAUSED: "paused",
};

export class RuntimeEnvironmentDebug {
  constructor(runtimeEnv) {
    this._runtimeEnv = runtimeEnv;
    this.state = EnvironmentState.INIT;
  }

  loadEnvironmentData(runTimeData) {
    this.state = EnvironmentState.RUNNING;
    this._envData = runTimeData;

    this._executionScript = RuntimeEnvironmentScriptsHolder.executionDebugDomainFunctions(
      this._envData.domainType
    );

    // pin callback that checks runtime environment state
    this._envData.checkRuntimeEnvironment = () => this._handleRuntime();
    this._envData.UISelector = document.getElementById(
      "run-application-view-container"
    );

    this._envData.RuntimeEnvironmentDebug = this;

    // request to start front-end debugger
    this._runtimeEnv.functionRequest(
      RuntimeEnvironmentDebug.name,
      "Debugger",
      "start",
      [],
      {
        // on start debugger
        func: (response) => {
          // initialize backend
          (this.blocklyDebuggee = new BlocklyDebuggee(this)),
            this.start(this._envData);
        },
        type: "async",
      }
    );
  }

  // post message to the debugger front end
  postMessage(message) {
    this._runtimeEnv.functionRequest(
      RuntimeEnvironmentDebug.name,
      "Debugger",
      "frontendReceiveMessage",
      [message]
    );
  }

  // has to be executed per visual programming statement
  _handleRuntime() {
    if (this.state === EnvironmentState.STOPPED) {
      this.promiseStopApp("StopApplication");
    } else if (this.state === EnvironmentState.PAUSED) {
      this.promiseStopApp("PauseApplication");
    }
  }

  _handleStopAction(action) {
    if (action === "StopApplication") {
      this.onStop();
    } else if (action === "PauseApplication") {
      this.onPause();
    } else {
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
      .then((finish) => this._handleStopAction("StopApplication"))
      .catch((stopAction) => this._handleStopAction(stopAction));
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
      .then((finish) => this.callbackOnStop())
      .catch((message) => this.handleOnError(message));
  }

  pause() {
    this._executionScript.PauseApplication();
  }

  continue() {
    this._executionScript.ContinueApplication();
  }

  receiveFrontendMessage(message, callback) {
    this.blocklyDebuggee.onmessage(message);
  }

  browseBlocklyBlock(projectElementId, blockId) {
    this._runtimeEnv.functionRequest(
      RuntimeEnvironmentDebug.name,
      "RuntimeManager",
      "foldLivePreview",
      []
    );

    this._runtimeEnv.functionRequest(
      RuntimeEnvironmentDebug.name,
      "BlocklyVPL",
      "highlightBlockOfPItem",
      [
        projectElementId,
        this.modalWSPId
          ? this.modalWSPId + "____" + blockId
          : blockId
      ]
    );
  }

  functionRequest(compDest, funcName, args, callback) {
    return this._runtimeEnv.functionRequest(
      RuntimeEnvironmentDebug.name,
      compDest,
      funcName,
      args,
      callback
    );
  }
}
