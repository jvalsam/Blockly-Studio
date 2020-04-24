import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "../../../component/component-view";

import EditorManagerToolbarTmpl from "./editor-manager-toolbar-view.tmpl";
import EditorManagerToolbarSYCSS from "./editor-manager-toolbar-view.sycss";

interface ITool {
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
    public render(): void {
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
    private addToolItem(tool: ITool) {
        let selector = "ts-pitem-tool-" + this.pitemToolSelectors.length;

        let html = "<a href=\"#\" class=\"navbar-brand navbar-left "
        + selector
        + " editor-tool-split-layout-btn\""
        + "data-toggle=\"tooltip\" title =\""
        + tool.tooltip
        + "\""
        + "style=\"margin-right: 2px;\">"
        + "<img src=\""
        + tool.icon
        + "\" >"
        + "</a>";

        selector = "." + selector;
        $(".component-toolbar-container").append(html);
        $(selector).bind("click", (evt) => tool.action(evt));

        this.pitemToolSelectors.push(selector);
    }
    public setPItemTools (tools: Array<ITool>): void {
        // clear previous items
        if (this.pitemToolSelectors.length>0) {
            this.pitemToolSelectors.forEach(sel => this.removeToolItem(sel));
            this.pitemToolSelectors.splice(0, this.pitemToolSelectors.length);
        }
        // add new items
        tools.forEach(tool => this.addToolItem(tool));
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
        this.detachAllEvents();

        let $el = $(".ts-" + name + "-split-btn");
        $el.removeClass("editor-toolbar-split-btn")
            .addClass("editor-toolbar-split-disabled-btn");

        this.getOthers(name).forEach(btn => {
            let $el = $(".ts-" + btn + "-split-btn");
            $el.removeClass("editor-toolbar-split-disabled-btn")
                .addClass("editor-toolbar-split-btn");

            this.attachEvents({
                    eventType: "click",
                    selector: ".ts-" + name + "-split-btn",
                    handler: () => this.onClickBtn(name)
                },
                {
                    eventType: "click",
                    selector: ".ts-" + name + "-split-btn",
                    handler: () => this.onClickBtn(name)
                });
        });

        this.parent["onSplitEditorsBtn"](name);
    }

    public registerEvents(): void {
        this.attachEvents({
                eventType: "click",
                selector: ".ts-vertical-split-btn",
                handler: () => this.onClickBtn("vertical")
            },
            {
                eventType: "click",
                selector: ".ts-horizontal-split-btn",
                handler: () => this.onClickBtn("horizontal")
            });
    }
}