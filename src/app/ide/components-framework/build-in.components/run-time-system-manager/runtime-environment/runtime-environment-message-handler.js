
export class RuntimeEnvironmentMessageHandler {
    constructor(myApp, connectedApp, postMessage, onMessage) {
        this.myApp = myApp;
        this.connectedApp = connectedApp;

        this.#callbackFuncId = 1;
        this.#callbackFuncMap = {};
        this.#callbackSignalId = 1;
        this.#callbackSignalMap = {};

        this.#myAppPostMessage = postMessage;
        this.#myAppOnMessage = onMessage;

        this.#listenMsg();
    }

    #listenMsg() {
        this.#myAppOnMessage(
            (event) => {
                let msg = this.#encodingMsg(event.data);
    
                this.#receiveFunctionRequest(
                    msg.srcComp,
                    msg.destComp,
                    msg.funcName,
                    msg.data,
                    msg.callbackData);
            }
        );
    }

    #postMsg(srcComp, destComp, funcName, data, callbackData) {
        let msg = this.#codingMsg(
            srcComp,
            destComp,
            funcName,
            data,
            callbackData);
        
        this.#myAppPostMessage(msg);
    }

    #createMsg(srcComp, destComp, funcName, data, callbackData) {
        return {
            srcComp: srcComp,
            destComp: destComp,
            funcName: funcName,
            data: data,
            callbackData: callbackData
        };
    }

    #codingMsg(srcComp, destComp, funcName, data, callbackData) {
        return JSON.stringify(
            this.#createMsg(
                srcComp,
                destComp,
                funcName,
                data,
                callbackData
            ));
    }

    #encodingMsg(msg) {
        return JSON.parse(msg);
    }

    functionRequest(srcComp, destComp, funcName, args, callback) {
        if (callback) {
            let callbackData = {
                destComp: this.myApp,
                funcName: "receiveResponseCallback",
                data: {
                    id: this.#callbackFuncId,
                    type: callback.type
                }
            };
            this.#callbackFuncMap[this.#callbackFuncId++] = (data) => callback.func(data);

            this.#postMsg(srcComp, destComp, funcName, args, callbackData);
        }
        else {
            this.#postMsg(srcComp, destComp, funcName, args);
        }
    }
    
    #handleResponseCallback (resp, id) {
        if (typeof resp === 'object' && 'type' in resp && 'func' in resp) {
            // TODO: add functionality to convert it and add it in the map all functions are given as args
        }

        this.functionRequest(
            this.myApp,
            this.connectedApp,
            "receiveResponseCallback",
            [id, resp]);
    }

    #receiveFunctionRequest(srcComp, destComp, funcName, args, callback) {
        if (callback) {
            if (callback.type === 'sync') {
                let resp = this.dispatchFunctionRequest(
                    srcComp,
                    destComp,
                    funcName,
                    args);
                
                this.#handleResponseCallback(resp, callback.id);
            }
            else { // async
                this.dispatchFunctionRequest(
                    srcComp,
                    destComp,
                    funcName,
                    args,
                    (resp) => this.#handleFunctionRequest(resp, callback.id));
            }
        }
        else {
            this.dispatchFunctionRequest(srcComp, destComp, funcName, data);
        }
    }

    receiveResponseCallback(callbackFuncId, data) {
        this.#callbackFuncMap[callbackFuncId] (data);

        // free completed callback function request
        delete this.#callbackFuncMap[callbackFuncId];
    }

    dispatchFunctionRequest(srcComp, destComp, funcName, data, callback) {
        if (destComp === this.name) {
            if (callback) {
                this[funcName] (data, callback);
            }
            else {
                resp = this[funcName] (data);
            }
        }
        else {
            throw new Error("Not impletemented function dispatchFunctionRequest in " + this.name);
        }
    }

    // TODO: handling signals between apps

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

    receiveSignal (signal, data) {
        this.callbackSignalMap[signal].forEach(receiveSignal => receiveSignal(data));
    }
}
