import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "./../../../../component/component-view";

/// <reference path="../../../../../node.d.ts"/>
import RuntimeManagerToolbarTmpl from "./run-time-manager-toolbar-view.tmpl";
import RuntimeManagerToolbarSYCSS from "./run-time-manager-toolbar-view.sycss";

@ComponentViewElementMetadata({
    name: "RuntimeManagerToolbarView",
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
        let $runEl = this.findEl(".ts-runtime-toolbar-run-btn", true);
        $runEl.css({
            "color": "green",
            "cursor": "pointer"
        });
        $runEl.hover(
            function () { $(this).css({ "color": "rgb(21, 160, 21)", "cursor": "pointer" }); },
            function () { $(this).css({ "color": "green", "cursor": "pointer" }); }
        );

        let $debugEl = this.findEl(".ts-runtime-toolbar-debug-btn", true);
        $debugEl.css({
            "opacity": "1.0",
            "cursor": "pointer"
        });
        $debugEl.hover(
            function () { $(this).css({ "opacity": "0.8" }); },
            function () { $(this).css({ "opacity": "1.0" }); }
        );

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

    private activateStopBtn(): void {
        // enable stop btn
        let $stopEl = this.findEl(".ts-runtime-toolbar-stop-btn", true);
        $stopEl.css({
            "color": "red",
            "cursor": "pointer"
        });
        $stopEl.hover(
            function () { $(this).css({ "color": "rgb(255, 98, 98)" }); },
            function () { $(this).css({ "color": "red" }); }
        );
        this.attachEvent({
            eventType: "click",
            selector: ".ts-runtime-toolbar-stop-btn",
            handler: () => this.parent["onStopApplicationBtn"]()
        });
    }

    private disableButtons(): void {
        this.detachAllEvents();

        // disable run and debug btns
        let $startEl = this.findEl(".ts-runtime-toolbar-run-btn", true);
        $startEl.css({
            "color": "lightgrey",
            "cursor": "not-allowed"
        });
        $startEl.hover(
            function () { $(this).css({ "color": "lightgrey" }); },
            function () { $(this).css({ "color": "lightgrey" }); }
        );

        let $debugEl = this.findEl(".ts-runtime-toolbar-debug-btn", true);
        $debugEl.css({
            "opacity": "0.5",
            "cursor": "not-allowed"
        });
        $debugEl.hover(
            function () { $(this).css({ "opacity": "0.5" }); },
            function () { $(this).css({ "opacity": "0.5" }); }
        );

        let $stopEl = this.findEl(".ts-runtime-toolbar-stop-btn", true);
        $stopEl.css({
            "color": "lightgrey",
            "cursor": "not-allowed"
        });
        $stopEl.hover(function () { $(this).css({ "color": "lightgrey" }); });
    }

    private onClickRunApplicationBtn(): void {
        this.detachAllEvents();

        // disable run and debug btns
        let $startEl = this.findEl(".ts-runtime-toolbar-run-btn", true);
        $startEl.css({"color": "lightgrey", "cursor": "not-allowed"});
        $startEl.hover(
            function () { $(this).css({ "color": "lightgrey" }); },
            function () { $(this).css({ "color": "lightgrey" }); }
        );

        let $debugEl = this.findEl(".ts-runtime-toolbar-debug-btn", true);
        $debugEl.css({
            "opacity": "0.5",
            "cursor": "not-allowed"
        });
        $debugEl.hover(
            function () { $(this).css({ "opacity": "0.5" }); },
            function () { $(this).css({ "opacity": "0.5" }); }
        );

        this.activateStopBtn();
    }

    private onClickDebugApplicationBtn() {
        this.onClickRunApplicationBtn();
    }

    private onClickStopApplicationBtn() {
        // disable stop btn
        this.detachAllEvents();

        let $stopEl = this.findEl(".ts-runtime-toolbar-stop-btn", true);
        $stopEl.css({
            "color": "lightgrey",
            "cursor": "not-allowed"
        });
        $stopEl.hover(function () { $(this).css({ "color": "lightgrey" }); });

        this.activateRunDebugBtns();
    }

    public registerEvents(): void {
        this.activateRunDebugBtns();
    }

}