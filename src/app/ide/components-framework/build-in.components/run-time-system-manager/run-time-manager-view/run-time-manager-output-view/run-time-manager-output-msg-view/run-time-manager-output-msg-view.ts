import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "../../../../../component/component-view";

/// <reference path="../../../../../../node.d.ts"/>
import RuntimeManagerOutputMsgTmpl from "./run-time-manager-output-msg-view.tmpl";
import RuntimeManagerOutputMsgSYCSS from "./run-time-manager-output-msg-view.sycss";

@ComponentViewElementMetadata({
    name: "RuntimeManagerOutputMsgView",
    templateHTML: RuntimeManagerOutputMsgTmpl,
    style: {
        system: RuntimeManagerOutputMsgSYCSS
    }
})
export class RuntimeManagerOutputMsgView extends ComponentViewElement {
    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".msg-bubble",
                handler: () => this.renderData.onClickMsg()
            },
            {
                eventType: "click",
                selector: ".msg-img",
                handler: () => this.renderData.onClickIcon()
            }
        );
    }

    public editMsg(msg: any): void {
        let $textEl = $("#" + this._id).find(".msg-text");
        $textEl.empty();
        $textEl.append(msg.text);

        let $timeEl = $("#" + this._id).find(".msg-info-time");
        $timeEl.empty();
        $timeEl.append(msg.time);

        $("#" + this._id).find(".msg-bubble").css({ "background": msg.color });
        $("#" + this._id).find(".msg-bubble").hover(
            function (): void { $(this).css({ "background": msg.hoverColor }); }
        );
    }
}
