import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata } from "../../../../../component/view";
import { IPropertyData, PropertyView } from "../property-view";

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
    ISData.indepedent = data.indepedent;
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
        data: any
    ) {
        super(parent, name, templateHTML, data);
        this.data = ISelectDataConverter(data);
    }

    public render(): void {
        this.renderTmplEl(this.data);
        this.registerEvents();
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

    private onChange(): void {
        this.data.selected = $("#input_" + this.id).val();
        if (typeof (this.data.updateParent) !== "undefined") {
            this.data.updateParent(this.data);
        }
    }

    public get value(): any {
        return this.data.selected;
    }
}