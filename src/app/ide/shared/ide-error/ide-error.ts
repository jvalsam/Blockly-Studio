/**
 * IDEError - IDE throws errors when detect unexpected states
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017, Updated on November 2017
 */

import { ViewRegistry } from "../../components-framework/view/view";
import { IDEErrorView } from "./ide-error-view";
import { IDEWarningView } from "./ide-warning-view";


class _IDEError {
    private errorView: IDEErrorView;
    private warningView: IDEWarningView;

    constructor() {
        this.errorView = <IDEErrorView>ViewRegistry.getEntry("IDEErrorView").create(null);
        this.warningView = <IDEWarningView>ViewRegistry.getEntry("IDEWarningView").create(null);
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
        let errorMsg: string = this.msgCreator("Error", etype, msg, srcInfo);
        this.errorView.alert(errorMsg);
        throw new RangeError(errorMsg);
    }

    public warn(etype: string, msg: string, srcInfo?: string) {
        let warningMsg: string = this.msgCreator("Warning", etype, msg, srcInfo);
        this.warningView.alert(warningMsg);
        console.warn(warningMsg);
    }
}

export let IDEError: _IDEError = new _IDEError();
