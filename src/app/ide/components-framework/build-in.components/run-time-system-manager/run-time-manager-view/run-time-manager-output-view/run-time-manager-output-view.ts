import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "./../../../../component/component-view";

/// <reference path="../../../../../node.d.ts"/>
import RuntimeManagerOutputTmpl from "./run-time-manager-output-view.tmpl";
import RuntimeManagerOutputSYCSS from "./run-time-manager-output-view.sycss";
import { ViewRegistry } from "../../../../component/registry";
import {
    RuntimeManagerOutputMsgView
} from "./run-time-manager-output-msg-view/run-time-manager-output-msg-view";

export interface IConsoleOutputMsg {
    typeMsg: String;
    imgIcon?: String;

    msg: {
        text: String,
        color: String
    };
    sender: String;
    time: String;

    // interactive output console with vpl editors and blocks...
    onClickMsg(): void
    onClickIcon(): void
};

@ComponentViewElementMetadata({
    name: "RuntimeManagerOutputView",
    templateHTML: RuntimeManagerOutputTmpl,
    style: {
        system: RuntimeManagerOutputSYCSS
    }
})
export class RuntimeManagerOutputView extends ComponentViewElement {
    private _msgs: { [hookId: string]: RuntimeManagerOutputMsgView } = {};

    static defaultImgIcon_app =
        "url(https://image.flaticon.com/icons/svg/1849/1849653.svg)";
    static defaultImgIcon_user =
        "url(https://image.flaticon.com/icons/svg/145/145867.svg)";

    public render(): void {
        this.renderTmplEl();
    }

    public addMsg(data: IConsoleOutputMsg): String {
        data.imgIcon = data.imgIcon
            ||  RuntimeManagerOutputView['defaultImgIcon_' + data.typeMsg];
        let $el = $("#"+this._id);
        // add hook
        let total = $el.children(".output-msg-area").length;
        let hookId = "output-msg-area-" + total;
        $el.append(`<div id="${hookId}" class="output-msg-area"></div>`);
        // create msg view
        let msgView = <RuntimeManagerOutputMsgView>ViewRegistry
            .getEntry("RuntimeManagerOutputMsgView")
            .create(
                this.parent,
                '#' + hookId,
                data);
        msgView.setRenderData(data);
        msgView.render();

        if (!this._msgs) {
            this._msgs = {};
        }
        this._msgs[hookId] = msgView;

        return hookId;
    }

    public removeMsg(hookId: string): void {
        this._msgs[hookId].destroy();
        $("#" + hookId).remove();
    }

    public clearMsgs (): void {
        Object.keys(this._msgs).forEach(hookId => this.removeMsg(hookId));
    }

    public editMsg(hookId: string, msg: any): void {
        this._msgs[hookId].editMsg(msg);
    }
}
