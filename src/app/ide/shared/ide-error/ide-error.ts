/**
 * IDEError - IDE throws errors when detect unexpected states
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017, Updated on November 2017
 */

import { IDEErrorView } from "./ide-error-view";
import { IDEWarningView } from "./ide-warning-view";
import { ViewRegistry } from "../../components-framework/component/registry";
import { MODAL_SELECTOR } from "../data";
import * as $ from "jquery";
import jquery_ui_css from "../../../../../libs/jquery-ui.sycss";
import { LoadStyle } from './../style-loader';


class _IDEError {
    private errorView: IDEErrorView;
    private warningView: IDEWarningView;

    constructor() {
        if (ViewRegistry.hasEntry("IDEErrorView") && ViewRegistry.hasEntry("IDEWarningView")) {
            this.errorView = <IDEErrorView>ViewRegistry.getEntry("IDEErrorView").create(null, MODAL_SELECTOR);
            this.warningView = <IDEWarningView>ViewRegistry.getEntry("IDEWarningView").create(null, MODAL_SELECTOR);
        }
        else {
            this.errorView = null;
            this.warningView = null;
        }
    }

    public initialize(): void {
        if (this.errorView === null) {
            this.errorView = <IDEErrorView>ViewRegistry.getEntry("IDEErrorView").create(null, MODAL_SELECTOR);
            this.warningView = <IDEWarningView>ViewRegistry.getEntry("IDEWarningView").create(null, MODAL_SELECTOR);
        }
        window.onerror = function (message, source, lineno, colno, error) {
            LoadStyle("jquery_ui", "third_party", jquery_ui_css);
            let msg = "Error:\nMessage: " + message + "\source: " + source +
                 "\nlineno: " + lineno + "\ncolno: " + colno + "\nerror: " + error;
            $("#error_dialog").empty();
            $("#error_dialog").append("<p>"+msg+"</p>");
            document["onErrorDialog"]();
        };
    }

    private msgCreator(
        ftype: string,
        etype: string,
        msg: string,
        srcInfo?: string
    ): string {
        var errorMsg: string = etype + ftype + msg;
        if (srcInfo) {
            errorMsg += srcInfo;
        }
        return errorMsg;
    }

    public raise(etype: string, msg: string, srcInfo?: string) {
        let errorMsg: string = this.msgCreator(" Error", etype, msg, srcInfo);
        if (this.errorView) {
            this.errorView.update(errorMsg);
            this.errorView.render();
        }
        else {
            alert(errorMsg);
        }
        throw new RangeError(errorMsg);
    }

    public warn(etype: string, msg: string, srcInfo?: string) {
        let warningMsg: string = this.msgCreator(" Warning", etype, msg, srcInfo);
        if (this.warningView) {
            this.warningView.alert(warningMsg);
        }
        else {
            alert(warningMsg);
        }
        console.warn(warningMsg);
    }
}

export let IDEError: _IDEError = new _IDEError();

export function assert(expr: false, message?: string): any;
export function assert(expr: boolean, message?: string): void;

export function assert(expr: boolean, message?: string): void {
    if (!expr) {
        IDEError.raise("Assertion failed", message);
    }
}
