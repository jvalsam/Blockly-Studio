import { RuntimeEnvironmentScriptsHolder } from "./runtime-environment-scripts-holder.js"

export class RuntimeEnvironmentRelease {
    constructor(runtimeEnv, envData) {
        this._runtimeEnv = runtimeEnv;
        this._envData = envData;

        this._executionScript = RuntimeEnvironmentScriptsHolder
            .executionDomainFunctions(this._envData.domainType);
        
        this.start(this._envData);
    }

    start(applicationData) {
        this._executionScript.StartApplication(applicationData);
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