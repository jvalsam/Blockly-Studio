import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata, IViewUserStyleData } from "../../../../../component/view";
import { IPropertyData, PropertyView } from "../property-view";
import { FontView } from "../font-view/font-view";

/// <reference path="../../../../../../../../node.d.ts"/>
import SelectViewTmpl from "./select-view.html";

export interface ISelectData extends IPropertyData {
    values: Array<string|number>;
    selected: string|number;
}

function ISelectDataConverter(data: any): ISelectData {
    if (!data.config) {
        return data;
    }
    let ISData: ISelectData;
    ISData["id"] = data.id;
    ISData.name = data.config.name;
    ISData.type = data.config.type;
    ISData.style = data.config.style;
    ISData.indepedent = data.indepedent;
    ISData.isExtra = typeof (data.isExtra) === "boolean" ? data.isExtra : false;
    ISData.values = data.config.values;
    ISData.selected = data.value;
    return ISData;
}


@ViewMetadata({
    name: "SelectView",
    templateHTML: SelectViewTmpl
})
export class SelectView extends PropertyView {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector, data);
        this.data = ISelectDataConverter(data);
    }

    public render(): void {
        this.renderTmplEl(this.data);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "change",
                selector: ".ts-change-enum-input",
                handler: () => this.onChange()
            }
        );
    }

    public setStyle(): void {
        if(this.data.style) {
            this.$el.find("#title_" + this.id).css(
                FontView.getStyle(this.data.style)
            );
        }
    }

    private onChange(): void {
        this.data.selected = $("#input_" + this.id).val();
        if (typeof (this.data.updateParent) !== "undefined") {
            this.data.updateParent(this.data.selected);
        }
    }

    public get value(): any {
        return this.data.selected;
    }
}