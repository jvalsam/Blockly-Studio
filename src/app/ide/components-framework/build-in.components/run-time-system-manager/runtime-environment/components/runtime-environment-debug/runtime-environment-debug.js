import { RuntimeEnvironmentScriptsHolder } from "../../runtime-environment-scripts-holder.js"

export class RuntimeEnvironmentDebug {
    constructor(runtimeEnv, envData) {
        this._runtimeEnv = runtimeEnv;
        this._envData = envData;

        this._executionScript = RuntimeEnvironmentScriptsHolder
            .executionDomainFunctions(this._envData.domainType);
        
        this.start();
    }

    start() {
        this._executionScript.StartApplication();
    }

    stop() {
        this._executionScript.StopApplication();
    }

    pause() {
        this._executionScript.PauseApplication();
    }

    continue() {
        this._executionScript.ContinueApplication();
    }
}