
export class RuntimeEnvironmentMessageHandler {
    constructor(myApp, connectedApp, postMessage, onMessage) {
        this.myApp = myApp;
        this.connectedApp = connectedApp;

        this._callbackFuncId = 1;
        this._callbackFuncMap = {};
        this._callbackSignalId = 1;
        this._callbackSignalMap = {};

        this._myAppPostMessage = postMessage;
        this._myAppOnMessage = onMessage;

        this._listenMsg();
    }

    _listenMsg() {
        this._myAppOnMessage(
            (event) => {
                let msg = this._encodingMsg(event.data);
    
                this._receiveFunctionRequest(
                    msg.srcComp,
                    msg.destComp,
                    msg.funcName,
                    msg.data,
                    msg.callbackData);
            }
        );
    }

    _postMsg(srcComp, destComp, funcName, data, callbackData) {
        let msg = this._codingMsg(
            srcComp,
            destComp,
            funcName,
            data,
            callbackData);
        
        this._myAppPostMessage(msg);
    }

    _createMsg(srcComp, destComp, funcName, data, callbackData) {
        return {
            srcComp: srcComp,
            destComp: destComp,
            funcName: funcName,
            data: data,
            callbackData: callbackData
        };
    }

    _codingMsg(srcComp, destComp, funcName, data, callbackData) {
        return JSON.stringify(
            this._createMsg(
                srcComp,
                destComp,
                funcName,
                data,
                callbackData
            ));
    }

    _encodingMsg(msg) {
        return JSON.parse(msg);
    }

    functionRequest(srcComp, destComp, funcName, args, callback) {
        if (callback) {
            let callbackData = {
                destComp: this.myApp,
                funcName: "receiveResponseCallback",
                data: {
                    id: this._callbackFuncId,
                    type: callback.type
                }
            };
            this._callbackFuncMap[this._callbackFuncId++] = (data) => callback.func(data);

            this._postMsg(srcComp, destComp, funcName, args, callbackData);
        }
        else {
            this._postMsg(srcComp, destComp, funcName, args);
        }
    }
    
    _handleResponseCallback (resp, callback) {
        if (typeof resp === 'object' && 'type' in resp && 'func' in resp) {
            // TODO: add functionality to convert it and add it in the map all 
            // functions are given as args
        }

        this.functionRequest(
            this.myApp,
            this.connectedApp,
            "receiveResponseCallback",
            [callback.data.id, resp]);
    }

    _receiveFunctionRequest(srcComp, destComp, funcName, args, callback) {
        if (callback) {
            if (callback.data.type === 'sync') {
                let resp = this.dispatchFunctionRequest(
                    srcComp,
                    destComp,
                    funcName,
                    args);
                
                this._handleResponseCallback(resp, callback);
            }
            else { // async
                this.dispatchFunctionRequest(
                    srcComp,
                    destComp,
                    funcName,
                    args,
                    (resp) => this._handleResponseCallback(resp, callback));
            }
        }
        else {
            this.dispatchFunctionRequest(srcComp, destComp, funcName, args);
        }
    }

    receiveResponseCallback(callbackFuncId, data) {
        this._callbackFuncMap[callbackFuncId] (data);

        // free completed callback function request
        delete this._callbackFuncMap[callbackFuncId];
    }

    dispatchFunctionRequest(srcComp, destComp, funcName, data, callback) {
        if (destComp === this.myApp) {
            if (callback) {
                this[funcName] (data, callback);
            }
            else {
                resp = this[funcName] (data);
            }
        }
        else {
            throw new Error(
                "Not impletemented function dispatchFunctionRequest in "
                + this.myApp);
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
            this.myApp,
            this.connectedApp,
            "addListenSignals",
            [signal]
        );
    }

    listensSignals(signals) {
        signals.forEach(elem => this._addSignal(elem.signal, elem.callback));

        this.postMsg(
            this.myApp,
            this.connectedApp,
            "addListenSignals",
            signals
        );
    }

    receiveSignal (signal, data) {
        this.callbackSignalMap[signal].forEach(receiveSignal => receiveSignal(data));
    }
}
