import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "./../../../../component/component-view";

/// <reference path="../../../../../node.d.ts"/>
import RuntimeManagerToolbarTmpl from "./run-time-manager-toolbar-view.tmpl";
import RuntimeManagerToolbarSYCSS from "./run-time-manager-toolbar-view.sycss";

@ComponentViewElementMetadata({
    name: "RuntimeToolbarView",
    templateHTML: RuntimeManagerToolbarTmpl,
    style: {
        system: RuntimeManagerToolbarSYCSS
    }
})
export class RuntimeManagerToolbarView extends ComponentViewElement {
    public render(): void {
        this.renderTmplEl();
    }

    private activateRunDebugBtns(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-runtime-toolbar-run-btn",
                handler: () => this.parent["onStartRunApplicationBtn"]()
            },
            {
                eventType: "click",
                selector: ".ts-runtime-toolbar-debug-btn",
                handler: () => this.parent["onStartDebugApplicationBtn"]()
            }
        );
    }

    private onClickRunApplicationBtn(): void {
        // disable run and debug btns
        this.findEl(".ts-runtime-toolbar-run-btn", true).css({
            "color": "lightgrey"
        });
        this.findEl(".ts-runtime-toolbar-debug-btn", true).css({
            "color": "lightgrey"
        });
        this.detachAllEvents();

        // enable stop btn
        this.findEl(".ts-runtime-toolbar-stop-btn", true).css({
            "color": "red"
        });
        this.attachEvent({
            eventType: "click",
            selector: ".ts-runtime-toolbar-stop-btn",
            handler: () => this.parent["onStopApplicationBtn"]()
        });
    }

    private onClickDebugApplicationBtn() {
        this.onClickRunApplicationBtn();
    }

    private onClickStopApplicationBtn() {
        // disable stop btn
        this.detachAllEvents();
        this.findEl(".ts-runtime-toolbar-stop-btn", true).css({
            "color": "lightgrey"
        });

        // enable run and debug btns
        this.findEl(".ts-runtime-toolbar-run-btn", true).css({
            "color": "green"
        });
        this.findEl(".ts-runtime-toolbar-debug-btn", true).css({
            "color": "lightblue"
        });
        this.activateRunDebugBtns();
    }

    public registerEvents(): void {
        this.activateRunDebugBtns();
    }

}