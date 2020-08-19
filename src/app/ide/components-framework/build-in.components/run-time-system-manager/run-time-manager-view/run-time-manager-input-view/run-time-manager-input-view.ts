import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "./../../../../component/component-view";

/// <reference path="../../../../../node.d.ts"/>
import RuntimeManagerInputTmpl from "./run-time-manager-input-view.tmpl";
import RuntimeManagerInputSYCSS from "./run-time-manager-input-view.sycss";

@ComponentViewElementMetadata({
    name: "RuntimeManagerInputView",
    templateHTML: RuntimeManagerInputTmpl,
    style: {
        system: RuntimeManagerInputSYCSS
    }
})
export class RuntimeManagerInputView extends ComponentViewElement {
    public render(): void {
        this.renderTmplEl();
    }

    public getInputValue() {
        return this.findEl(".runtime-manager-console-input-text").val();
    }

    private onEnableInput(callback) {
        // enable input area - text
        let $elText = this.findEl('.runtime-manager-console-input-text');
        $elText.removeAttr("disabled");
        $elText.css({
            "flex": 1,
            "background": "#ddd",
            "cursor": "text"
        });
        $elText.attr("placeholder", "Enter your input...");

        // enable input area - btn
        let $elBtn = this.findEl('.runtime-manager-console-input-btn');
        $elBtn.css({
            "margin-left": "10px",
            "background": "rgb(0, 196, 65)",
            "color": "#fff",
            "font-weight": "bold",
            "cursor": "pointer",
            "transition": "background 0.23s"
        });
        $elBtn.hover(function() {
            $(this).css("background","rgb(0, 180, 50);");
        });
        $elBtn.removeAttr("disabled");

        this.attachEvents(
            {
                eventType: "click",
                selector: ".runtime-manager-console-input-btn",
                handler: () => this.parent["onSendInput"](callback)
            }
        );
    }

    private onDisableInput() {
        // disable input area - text
        let $elText = this.findEl('.runtime-manager-console-input-text');
        $elText.css({
            "flex": 1,
            "background": "#ddd",
            "cursor": "not-allowed"
        });
        $elText.removeAttr("placeholder");

        // disable input area - btn
        let $elBtn = this.findEl('.runtime-manager-console-input-btn');
        $elBtn.css({
            "margin-left": "10px",
            "background": "#EBEBE4",
            "color": "#fff",
            "font-weight": "bold",
            "cursor": "not-allowed",
            "transition": "background 0.23s"
        });
        $elBtn.hover(function() {
            $(this).css("background","#EBEBE4");
        });
        $elBtn.attr("disabled", "disabled");

        this.detachAllEvents();
    }

    private onClickSendInput() {
        this.onDisableInput();
    }
}