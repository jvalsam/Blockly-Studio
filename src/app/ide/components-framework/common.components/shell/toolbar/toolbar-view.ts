import ToolbarTmpl from "./toolbar.html";
import {
    ComponentView,
    ComponentViewMetadata,
    IViewElements,
} from "../../../component/component-view";
import { View } from "../../../view/view";

@ComponentViewMetadata({
    name: "ToolbarView",
    selector: ".toolbar-view-area",
    templateHTML: ToolbarTmpl
})
export class ToolbarView extends ComponentView {
    private tools: Array<any>;

    public addTools(tools: IViewElements): void {
        for (let index of Object.keys(tools)) {
            let toolElem: View = tools[index];
            this.inject({ selector: ".tool-container", view: toolElem });
        }
        this.templateJQ.find("div.toolbar-view-area").show();
    }

    public removeTools(tools: IViewElements): void {
        //TODO: implement


        if (this.tools.length === 0) {
            this.$el.hide();
        }
    }

    public registerEvents(): void {
        this.attachEvents({
            eventType: "click",
            selector: ".ts-close-toolbar-btn",
            handler: () => this.parent["onClose"]()
        });
    }

    public render(): void {
        this.$el.html(this.template());
        this.registerEvents();
    }
}
