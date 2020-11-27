
class RuntimeEnvironmentMessageHandler {
    constructor(app, parent, postMessage, onMessage) {
        this.app = app;
        this.parent = parent;
        this.callbackFuncId = 1;
        this.callbackFuncMap = {};
        this.callbackSignalId = 1;
        this.callbackSignalMap = {};
        this.appPostMessage = postMessage;
        this.appOnMessage = onMessage;

        this.listenMsg();
    }

    listenMsg(functionsRequestDispatcher) {
        window.onmessage = (event) => {
            let msg = this.encodingMsg(event.data);
//todo: edit based on func request
            this.dispatchFunctionRequest(
                msg.compName,
                msg.funcName,
                msg.data,
                msg.callbackData);
        };
    }

    postMsg(srcName, destName, funcName, data, callbackData) {
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

    functionRequest(srcComp, destComp, funcName, args, callback) {
        if (callback) {
            let callbackData = {
                destComp: "RuntimeEnvironmentApp",
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


}