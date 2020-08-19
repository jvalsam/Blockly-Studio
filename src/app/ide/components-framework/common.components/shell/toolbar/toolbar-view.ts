import ToolbarTmpl from "./toolbar.tmpl";
import {
    ComponentView,
    ComponentViewMetadata,
    IViewElements,
} from "../../../component/component-view";
import { ComponentViewElement } from "../../../component/component-view";
import { IDEUIComponent } from "../../../component/ide-ui-component";
import { IViewUserStyleData } from "../../../component/view";

@ComponentViewMetadata({
    name: "ToolbarView",
    //selector: ".toolbar-view-area",
    templateHTML: ToolbarTmpl
})
export class ToolbarView extends ComponentView {
    private tools: IViewElements;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        selector: string
    ) {
        super(parent, name, templateHTML, style, selector);
        this.tools = {};
    }

    public addTools(tools: IViewElements): void {
        for (let index of Object.keys(tools)) {
            this.tools[index] = tools[index];
        }
    }

    public addArea(order: number): string {
        let sel = "toolbar-area-" + order;
        $(".tools-view-container").append(
            "<div id=\"" + sel + "\"></div>"
        );
        return sel;
    }

    public deleteArea(selector: string): void {
        $("#"+selector).remove();
    }

    public removeTools(tools: IViewElements): void {
        //TODO: implement


        if (Object.keys(this.tools).length === 0) {
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
        this.renderTmplEl();
        for (let index of Object.keys(this.tools)) {
            this.tools[index].render();
            this.$el.find(this.tools[index].selector).append(this.tools[index].$el);
        }
    }
}
