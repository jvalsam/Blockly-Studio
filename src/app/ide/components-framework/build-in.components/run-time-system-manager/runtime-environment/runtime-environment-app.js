import { RuntimeEnvironmentMessageHandler } from "./runtime-environment-message-handler.js";
import {
    RuntimeEnvironmentComponents
} from "./runtime-environment-components-registration.js"

class _RuntimeEnvironmentApp extends RuntimeEnvironmentMessageHandler {
    constructor(connectedApp) {
        super(
            "RuntimeEnvironmentApp",
            connectedApp,
            (msg) => window.top.postMessage(msg, "*"),
            (func) => window.onmessage = func
        );
        this.runtimeEnvironmentComp = null;
        this.registeredComponents = {};
        RuntimeEnvironmentComponents.registration(this);

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

    loadEnvironmentRunData(data) {
        if (data.execType === 'DEBUG') {
            this.runtimeEnvironmentComp = "RuntimeEnvironmentDebug";
            this.registeredComponents["RuntimeEnvironmentDebug"]
                .loadEnvironmentData(data);
        }
        else {
            this.runtimeEnvironmentComp = "RuntimeEnvironmentRelease";
            this.registeredComponents["RuntimeEnvironmentRelease"]
                .loadEnvironmentData(data);
        }
    }

    dispatchFunctionRequest(srcComp, destComp, funcName, data, callback) {
        if (! this.registeredComponents[destComp]) {
            throw new Error(
                destComp
                + " not registered component in the Runtime Environment.");
        }
        if (! this.registeredComponents[destComp][funcName]) {
            throw new Error(
                "Function "
                + funcName
                + " not exists on "
                + destComp
                + " in the Runtime Environment.");
        }

        if (callback) {
            this.registeredComponents[destComp][funcName] (...data, callback);
        }
        else {
            return this.registeredComponents[destComp][funcName] (...data);
        }
    }

    importJSLib(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.head.appendChild(script);
    }

    importCSSLib(url) {
        var link = document.createElement("link");
        link.href = url;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }

    importJS(code) { 
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = code;
        document.head.appendChild(script);
    }

    /** 
     * Methods to handle components are loaded in the runtime environment app
    /* and would like to communicate with the Blockly Studio IDE.
    **/

    registerComponent(compName, compInst) {
        this.registeredComponents[compName] = compInst;
    }

    unregisterComponent(compName) {
        delete this.registeredComponents[compName];
    }

    functionRequestInnerComp(srcComp, destComp, funcName, args) {
        if (!this.registeredComponents[destComp]) {
            throw new Error(
                "Function Request from "
                + srcComp
                + " for Inner Component failed. "
                + destComp
                + " is not registered in the Runtime Environment.");
        }
        else if (!this.registeredComponents[destComp][funcName]) {
            throw new Error(
                "Function Request "
                + destComp
                + "."
                + funcName
                + " from "
                + srcComp
                + " for Inner Component failed. "
                + funcName
                + " is not registered in the Runtime Environment.");
        }
        return this.registeredComponents[destComp][funcName](...args);
    }

    getComponentInst(comp) {
        return this.registeredComponents[comp];
    }

    stopApplication(onSuccess) {
        this.registeredComponents[this.runtimeEnvironmentComp]
            .stop(onSuccess);
    }

    // TODO: support of signals for the registered components
    // in case it will be required
}

export const RuntimeEnvironmentApp = new _RuntimeEnvironmentApp("RuntimeSystem");