import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "../../../component/component-view";

import EditorManagerToolbarTmpl from "./editor-manager-toolbar-view.tmpl";
import EditorManagerToolbarSYCSS from "./editor-manager-toolbar-view.sycss";

export interface ITool {
    icon: string;
    tooltip: string;
    action: Function;
}

@ComponentViewElementMetadata({
    name: "EditorManagerToolbarView",
    templateHTML: EditorManagerToolbarTmpl,
    style: {
        system: EditorManagerToolbarSYCSS
    }
})
export class EditorManagerToolbarView extends ComponentViewElement {
    private currSplit: string;
    public render(): void {
        this.currSplit = "normal";
        this.renderTmplEl();
    }

    private pitemToolSelectors = [];
    private removeToolItem(selector: any): void {
        let $pitem = $(selector);
        if ($pitem["nodeName"] === "A") {
            $pitem.unbind("click");
        }
        $pitem.remove();
    }

    private addToolItem(tool: ITool): void {
        let selector = "ts-pitem-tool-" + this.pitemToolSelectors.length;

        let html = "<a href=\"#\" class=\"navbar-brand navbar-left "
        + selector
        + " editor-toolbar-split-btn\""
        + "data-toggle=\"tooltip\" title =\""
        + tool.tooltip
        + "\""
        + "style=\"margin-right: 4px; padding: 0px;\">"
        + "<img src=\""
        + tool.icon
        + "\" style=\"width:22px;height:22px;max-width: 22px; max-height: 22px; margin-top:-7px;\">"
        + "</a>";

        selector = "." + selector;
        $(".component-toolbar-container").append(html);
        $(selector).bind("click", (evt) => tool.action(evt));

        this.pitemToolSelectors.push(selector);
    }
    private addSeparator(): void {
        $(".component-toolbar-container").append(
            "<span style=\"margin-right: 6px; border-right: solid 1px grey;\"></span>"
        );
    }
    public setPItemTools (tools: Array<ITool>): void {
        // clear previous items
        if (this.pitemToolSelectors.length>0) {
            this.pitemToolSelectors.forEach(sel => this.removeToolItem(sel));
            this.pitemToolSelectors.splice(0, this.pitemToolSelectors.length);
        }
        // add new items
        tools.forEach(tool => (typeof tool === "object")
            ? this.addToolItem(tool)
            : this.addSeparator());
    }

    private getOthers (name: string) {
        let btns = ["normal", "vertical", "horizontal"];
        let index = btns.indexOf(name);
        if (index !== -1) {
            btns.splice(index, 1);
        }
        return btns;
    }

    private onClickBtn(name: string): void {
        if (this.currSplit === name) {
            return;
        }

        this.currSplit = name;
        let $el = $(".ts-" + name + "-split-btn");
        $el.removeClass("editor-toolbar-split-btn")
            .addClass("editor-toolbar-split-disabled-btn");
        this.currSplit = name;

        this.getOthers(name).forEach(btn => {
            let $el = $(".ts-" + btn + "-split-btn");
            $el.removeClass("editor-toolbar-split-disabled-btn")
                .addClass("editor-toolbar-split-btn");
        });

        this.parent["onSplitEditorsBtn"](name);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-normal-split-btn",
                handler: () => this.onClickBtn("normal")
            },
            {
                eventType: "click",
                selector: ".ts-vertical-split-btn",
                handler: () => this.onClickBtn("vertical")
            },
            {
                eventType: "click",
                selector: ".ts-horizontal-split-btn",
                handler: () => this.onClickBtn("horizontal")
            }
        );
    }
}