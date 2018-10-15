import { PropertyType } from "./property-view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { View, IViewUserStyleData } from "../../../../component/view";
import _ from "lodash";
import { ProjectManagerItemView } from "../../../project-manager/project-manager-view/project-manager-elements-view/project-manager-application-instance-view/item-view/item-view";


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
        style: Array<IViewUserStyleData>,
        selector: string,
        protected _data: any
    ) {
        super(parent, name, templateHTML, style, selector);
        // this.selector = "#input_"+this.id;
        this._data.id = this.id;
        this._renderInnerHTML = false;
    }

    set selector (newSel: string) { this._selector = newSel; }

    set renderInner(ri: boolean) { this._renderInnerHTML = ri; }

    set style (newStyle: any) { this._data.style= newStyle; }

    public renderTmplEl(data?:any): void {
        this.renderTmplElHelper(data);
        if (this._renderInnerHTML) {
            this.$el = this.$el.children();
        }
        this.attachTmplEl();
    }

    abstract get value(): any;
    abstract focus(): void;

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

function convertPart(id, type, value) {
    switch(type) {
        case "img":
            return {
                descriptionID: id,
                name: value.property+":",
                type: "file",
                ftype: "image",
                description: "Select image of the item.",
                value: value.default.path
            };
        case "title":
            return {
                descriptionID: id,
                name: value.property+":",
                type: "text",
                description: "Select title of the item.",
                placeholder: "Enter "+value.property,
                value: value.default.text + " " + ProjectManagerItemView.GetTotalGeneratedElems()
            };
    }
}
export function RenderPartsToPropertyData (renderParts: Array<any>) {
    let properties = [];
    if (renderParts && renderParts.length>0) {
        renderParts.forEach((part) => {
            if (part.selectedBy === "user") {
                properties.push(convertPart(part.id, part.type, part.value));
            }
        });
    }
    return properties;
}
