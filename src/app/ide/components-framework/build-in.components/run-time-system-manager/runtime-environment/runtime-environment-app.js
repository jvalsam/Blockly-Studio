/**
 * 
 */
import { RuntimeEnvironmentRelease } from "./runtime-environment-release";
import { RuntimeEnvironmentDebug } from "./runtime-environment-debug";


class RuntimeEnvironmentApp {
    constructor(parentApp) {
        this.parentApp = parentApp;
        this.name = "RuntimeEnvironmentApp";
        this.callbackFuncId = 1;
        this.callbackFuncMap = {};
        this.callbackSignalId = 1;
        this.callbackSignalMap = {};

        this.listenMsg();
        this.connectApp();
    }

    connectApp () {
        this.functionRequest(
            this.name,
            this.destComp,
            "getEnvironmentRunData",
            [],
            this.createMsg(
                "RuntimeEnvironmentApp",
                "loadEnvironmentRunData"
            ),
            (data) => this.loadEnvironmentRunData(data)
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

    responseMsg(respData, callbackData) {
        if (typeof callbackData === 'object') {
            // response has to include two keys: data and callback
            let callback = 
            this.postMsg(
                callbackData.compName);
        }
    }

    listenMsg() {
        window.onmessage = (event) => {
            let msg = this.encodingMsg(event.data);
            
            this.dispatchFunctionRequest(
                msg.compName,
                msg.funcName,
                msg.data,
                msg.callbackData);
        };
    }

    postMsg(srcName, destName, funcName, data ={}, callbackData) {
        let msg = this.codingMsg(
            srcName,
            destName,
            funcName,
            data,
            callbackData);
        
        window.top.postMessage(msg);
    }

    createMsg(srcName, destName, funcName, data, callbackData) {
        return {
            srcName: srcName,
            destName: destName,
            funcName: funcName,
            data: data,
            callbackData: callbackData
        };
    }

    codingMsg(srcName, destName, funcName, data, callbackData) {
        return JSON.stringify(
            this.createMsg(
                srcName,
                destName,
                funcName,
                data,
                callbackData
            ));
    }

    encodingMsg(msg) {
        return JSON.parse(msg);
    }

    // Components are able to use it in order to function request from components that
    // are registered in the project
    functionRequest(srcComp, destComp, funcName, args, callback) {
        if (callback) {
            let callbackData = {
                destComp: this.name,
                funcName: "receiveResponseCallback",
                data: [this.callbackFuncId]
            };
            this.callbackFuncMap[this.callbackFuncId++] = (data) => callback(...data);

            this.postMsg(srcComp, destComp, funcName, args, callbackData);
        }
        else {
            this.postMsg(srcComp, destComp, funcName, args);
        }
    }

    _addSignal(signal, callback) {
        if (!this.callbackSignalMap[signal]) {
            this.callbackSignalMap[signal] = [];
        }
        this.callbackSignalMap[signal].push(callback);
    }

    listenSignal(signal, callback) {
        this._addSignal(signal, callback);

        this.postMsg(
            this.name,
            this.parentApp,
            "addListenSignals",
            [signal]
        );
    }

    listensSignals(signals) {
        signals.forEach(elem => this._addSignal(elem.signal, elem.callback));

        this.postMsg(
            this.name,
            this.parentApp,
            "addListenSignals",
            signals
        );
    }

    receiveResponseCallback(callbackFuncId, data) {
        this.callbackFuncMap[callbackFuncId] (data);

        // free completed callback function request
        delete this.callbackFuncMap[callbackFuncId];
    }

    dispatchFunctionRequest(compName, funcName, data, callbackData) {
        let resp;
        
        switch(compName) {
            case 'RuntimeEnvironmentApp':
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

    receiveSignal (signal, data) {
        this.callbackSignalMap[signal].forEach(receiveSignal => receiveSignal(data));
    }
}

const runtimeEnvironment = new RuntimeEnvironmentApp("RuntimeManager");