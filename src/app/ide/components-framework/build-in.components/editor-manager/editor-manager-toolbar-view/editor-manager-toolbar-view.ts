import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "../../../component/component-view";

import EditorManagerToolbarTmpl from "./editor-manager-toolbar-view.tmpl";
import EditorManagerToolbarSYCSS from "./editor-manager-toolbar-view.sycss";

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

        let $el = this.findEl("." + name + "-split-btn", true);
        $el.removeClass(".editor-toolbar-split-btn")
           .addClass(".editor-toolbar-split-disabled-btn");

        this.getOthers(name).forEach(btn => {
            let $el = this.findEl("." + btn + "-split-btn", true);
            $el.removeClass(".editor-toolbar-split-disabled-btn")
               .addClass(".editor-toolbar-split-btn");

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