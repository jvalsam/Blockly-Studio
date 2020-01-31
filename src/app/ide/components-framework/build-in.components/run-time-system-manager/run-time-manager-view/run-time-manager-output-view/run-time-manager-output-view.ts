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
    typeMsg?: String;
    imgIcon?: String;

    msg: String;
    sender: String;
    time: String;

    // interactive output console with vpl editors and blocks...
    onClickMsg(): void
    onClockIcon(): void
};

@ComponentViewElementMetadata({
    name: "RuntimeManagerOutputView",
    templateHTML: RuntimeManagerOutputTmpl,
    style: {
        system: RuntimeManagerOutputSYCSS
    }
})
export class RuntimeManagerOutputView extends ComponentViewElement {
    public render(): void {
        this.renderTmplEl();
    }

    private addMsg(data) {
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
    }

    public onAddApplicationMsg (data: IConsoleOutputMsg) {
        data.typeMsg = 'app';
        data.imgIcon = data.imgIcon
            || 'url(https://image.flaticon.com/icons/svg/1849/1849653.svg)';

        this.addMsg(data);
    }

    public onAddUserMsg(data: IConsoleOutputMsg) {
        data.typeMsg = 'user';
        data.imgIcon = data.imgIcon
            || 'url(https://image.flaticon.com/icons/svg/145/145867.svg)';

        this.addMsg(data);
    }
}
