import { RuntimeEnvironmentMessageHandler } from "./runtime-environment/runtime-environment-message-handler";
import { RuntimeEnvironmentDomainHolder } from "./runtime-environment-domain-holder";

import RuntimeEnvironmentTmpl from "./runtime-environment-app.tmpl";


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
                if (this[funcName]) {
                    this[funcName] (...data, callback);
                }
                else {
                    this.parent[funcName] (...data, callback);
                }
            }
            else {
                if (this[funcName]) {
                    return this[funcName] (...data);
                }
                else {
                    return this.parent[funcName] (...data);
                }
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

    static createEnvironmentAppHtml(domainType) {
        let $envApp = $($.parseHTML(RuntimeEnvironmentTmpl));
        let libs = RuntimeEnvironmentDomainHolder.getThirdPartyLibs(domainType);
        libs.forEach(url => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            $envApp.append(script);
        });
        let styles = RuntimeEnvironmentDomainHolder.getCSSLibs(domainType);
        styles.forEach(url => {
            let link = `<link href="${url}" rel="stylesheet"></link>`;
            $envApp.append(link);
        });
        return '<html lang="en"><head>'
            + $envApp.html()
            + '</head><body>iframe ui loaded...</body></html>';
    }

    static initialize(id, domainType) {
        let envHtml = RuntimeSystem.createEnvironmentAppHtml(domainType);
        $('<iframe>')
            .attr('id', id)
            .attr('srcdoc', envHtml)
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