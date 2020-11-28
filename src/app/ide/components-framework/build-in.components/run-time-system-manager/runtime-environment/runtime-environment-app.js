/**
 * 
 */

import { RuntimeEnvironmentMessageHandler } from "./runtime-environment-message-handler";
import { RuntimeEnvironmentRelease } from "./runtime-environment-release";
import { RuntimeEnvironmentDebug } from "./runtime-environment-debug";


class RuntimeEnvironmentApp extends RuntimeEnvironmentMessageHandler {
    constructor(parentApp) {
        super(
            "RuntimeEnvironmentApp",
            parentApp,
            (msg) => window.top.postMessage(msg, "*"),
            (func) => window.onmessage = func
        );

        this.initialize();
    }

    initialize() {
        this.functionRequest(
            this.myApp,
            this.connectedApp,
            "getEnvironmentRunData",
            [],
            {
                type: 'sync',
                func: (data) => loadEnvironmentRunData(data)
            }
        );
    }

    loadEnvironmentRunData(data) {
        if (this.environmentRunData.execType === 'Debug') {
            this.environment = new RuntimeEnvironmentDebug(this, data);
        }
        else {
            this.environment = new RuntimeEnvironmentRelease(this, data);
        }
    }

    dispatchFunctionRequest(srcName, destName, funcName, data, callback) {
        let resp;
        
        switch(destName) {
            case this.name:
                resp = this[funcName] (data);
                break;
            case 'Runtime':
                
                break;
            case 'VisualDebugger':

                break;
            case 'Simulator':

                break;
            case 'LivePreview':

                break;
            default:
                throw new Error(compName + " does not exist in Runtime Envrionment Application");
        }

        this.responseMsg(resp, callbackData);
    }

}

const runtimeEnvironment = new RuntimeEnvironmentApp("RuntimeManager");