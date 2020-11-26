/**
 * 
 */
import { RuntimeEnvironmentRelease } from "./runtime-environment-release";
import { RuntimeEnvironmentDebug } from "./runtime-environment-debug";


class RuntimeEnvironmentApp {
    constructor() {
        this.listenIDEMsgs();
        this.connectApp();
    }

    connectApp () {
        window.top.postMessage(this.codingMsg(
            "RuntimeManager",
            "getEnvironmentRunData",
            [],
            this.createMsg(
                "RuntimeEnvironmentApp",
                "loadEnvironmentRunData"
            )
        ), '*');
    }

    loadEnvironmentRunData(data) {
        if (this.environmentRunData.execType === 'Debug') {
            this.environment = new RuntimeEnvironmentDebug(this, data);
        }
        else {
            this.environment = new RuntimeEnvironmentRelease(this, data);
        }
    }

    listenIDEMsgs() {
        window.onmessage = (event) => {
            let data = this.encodingMsg(event.data);
            data.compName
            console.log('Parent received successfully.');
            console.log(msgData);
        };
    }

    callbackResponse() {
        
    }

    createMsg(compName, funcName, data ={}, callbackData ={}) {
        return {
            compName: compName,
            funcName: funcName,
            data: data,
            callbackData: callbackData
        };
    }

    codingMsg(compName, funcName, data, callbackData) {
        return JSON.stringify(this.createMsg(
            compName,
            funcName,
            data,
            callbackData
        ));
    }

    encodingMsg(msg) {
        return JSON.parse(msg);
    }
}

const runtimeEnvironment = new RuntimeEnvironmentApp();