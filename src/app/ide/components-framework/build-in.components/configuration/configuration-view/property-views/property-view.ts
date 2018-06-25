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
    style: Object;
    renderName?: boolean;
    indepedent?: boolean;
    isExtra?: boolean;
    updateParent?: (data:any) => void;
}

export abstract class PropertyView extends View {
    protected notifyParent: boolean;
    private _renderInnerHTML: boolean;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        selector: string,
        protected _data: any
    ) {
        super(parent, name, templateHTML, selector);
        // this.selector = "#input_"+this.id;
        this._data.id = this.id;
        this._renderInnerHTML = false;
    }

    set selector (newSel: string) { this._selector = newSel; }

    set renderInner(ri: boolean) { this._renderInnerHTML = ri; }

    public renderTmplEl(data?:any): void {
        this.renderTmplElHelper(data);
        if (this._renderInnerHTML) {
            this.$el = this.$el.children();
        }
        this.attachTmplEl();
    }

    abstract get value(): any;

    public get data(): any {
        return this._data;
    }

    public set data(val: any) {
        this._data = val;
    }

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

export function StyleObjectToString(data: any): string {
    if (typeof(data)!=="object") {
        return data;
    }
    let value: string = data.extra;
    switch (data.main) {
        case "number":
            value += "px";
            break;
        case "percentage":
            value += "%";
            break;
        default:
            value += data.main;
    }
    return value;
}