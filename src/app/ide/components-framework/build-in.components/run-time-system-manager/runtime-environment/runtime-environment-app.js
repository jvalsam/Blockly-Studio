/**
 * 
 */

import { RuntimeEnvironmentMessageHandler } from "./runtime-environment-message-handler.js";
import { RuntimeEnvironmentRelease } from "./runtime-environment-release.js";
import { RuntimeEnvironmentDebug } from "./runtime-environment-debug.js";


class RuntimeEnvironmentApp extends RuntimeEnvironmentMessageHandler {
    constructor(connectedApp) {
        super(
            "RuntimeEnvironmentApp",
            connectedApp,
            (msg) => window.top.postMessage(msg, "*"),
            (func) => window.onmessage = func
        );
        this.registeredComponents = {};

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
                func: (data) => this.loadEnvironmentRunData(data)
            }
        );
    }

    registerComponent(compName, compInst) {
        this.registerComponent[compName] = compInst;
    }

    unregisterComponent(compName) {
        delete this.registerComponent[compName];
    }

    loadEnvironmentRunData(data) {
        if (data.execType === 'DEBUG') {
            this.environment = new RuntimeEnvironmentDebug(this, data);
        }
        else {
            this.environment = new RuntimeEnvironmentRelease(this, data);
        }
    }

    dispatchFunctionRequest(srcName, destName, funcName, data, callback) {
        let func;
        
        switch(destName) {
            case this.myApp:
                func = (...data) => this[funcName](...data);
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

        if (callback) {
            func (...data, callback);
        }
        else {
            return func (...data);
        }
    }

}

export const RuntimeEnvironmentApp = new RuntimeEnvironmentApp("RuntimeSystem");