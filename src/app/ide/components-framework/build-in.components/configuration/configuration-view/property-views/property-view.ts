import { PropertyType } from "./property-view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { View } from "../../../../component/view";

export type PropertyType =
    "number"    | "percentage" | "text" | "color" | "date" | "checkbox" | "file" | "image" | // input
    "select"    |
    "aggregate" |
    "font"      |
    "dynamic"   |
    "select-extra"
;

export interface IPropertyData {
    name: string;
    type: PropertyType;
    renderName?: boolean;
    indepedent?: boolean;
    updateParent?: (data:any) => void;
}

export abstract class PropertyView extends View {
    protected readonly selector: string;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        protected data: any
    ) {
        super(parent, name, templateHTML);
        this.selector = "#input_"+this.id;
        this.data.id = this.id;
    }

    abstract get value(): any;

    public get type(): PropertyType {
        return this["data"].type;
    }

    public get independent(): boolean {
        return typeof(this["data"].indepedent)!=="undefined"?this["data"].indepedent:false;
    }

    public get isNameHiden(): boolean {
        return typeof(this["data"].renderName)!=="undefined"?this["data"].renderName:false;
    }

    public static generateView(): JQuery {
        return $("<div>");
    }
}

export function TypeToNameOfPropertyView(type: string): string {
    switch (type) {
        case "select":
            return "SelectView";
        case "font":
            return "FontView";
        case "dynamic":
            return "DynamicExtraView";
        case "aggregate":
            return "AggregateView";
        default:
            return "InputView";
    }
}