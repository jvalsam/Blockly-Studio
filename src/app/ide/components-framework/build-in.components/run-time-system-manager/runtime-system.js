import { RuntimeEnvironmentMessageHandler } from "./runtime-environment/runtime-environment-message-handler";

export class RuntimeSystem extends RuntimeEnvironmentMessageHandler {
    constructor(parent, connectedApp, postMessage, onMessage) {
        super(
            "RuntimeSystem",
            connectedApp,
            (msg) => postMessage(msg, "*"),
            (func) => onMessage(func)
        );
        this.parent = parent;
    }

    dispatchFunctionRequest(srcComp, destComp, funcName, data, callback) {
        if (destComp === this.myApp) {
            if (callback) {
                this.parent[funcName] (data, callback);
            }
            else {
                return this.parent[funcName] (data);
            }
        }
        else {
            if (callback) {
                this.parent.dispatchFunctionRequest(
                    srcComp,
                    destComp,
                    funcName,
                    data,
                    callback);
            }
            else {
                return this.parent.dispatchFunctionRequest(
                    srcComp,
                    destComp,
                    funcName,
                    data);
            }
        }
    }

    static initialize(id) {
        var file_src = "/runtime-environment-app.html";
        $('<iframe>')
            .attr('id', id)
            .attr('src',file_src)
            .attr('height',500)
            .attr('width',500)
            .appendTo('.runtime-environment-area');
    }

    static getIframe(id) {
        return document.getElementById(id);
    }

    static close() {
        // TODO: close actions from the connected application

        // on callback of these actions we have to add this line
        $('.runtime-environment-area').empty();
    }


}