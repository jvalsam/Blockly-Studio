import { PropertyType } from "./property-view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { View, IViewUserStyleData } from "../../../../component/view";
import * as _ from "lodash";
import { ProjectManagerItemView } from "../../../project-manager/project-manager-view/project-manager-elements-view/project-manager-application-instance-view/item-view/item-view";
import { IDEError } from './../../../../../shared/ide-error/ide-error';


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


function getTextValue (value): any {
    return value.default ? value.default.text + " " + ProjectManagerItemView.GetTotalGeneratedElems() : value.text;
}
function getImgValue (value): any {
    let img = value.default ? value.default : value;
    return img.path ? img.path : img.fa;
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
                value: getImgValue(value)
            };
        case "title":
            return {
                descriptionID: id,
                name: value.property+":",
                type: "text",
                description: "Select title of the item.",
                placeholder: "Enter "+value.property,
                value: getTextValue(value)
            };
        default:
            IDEError.raise (
                "PropertyView",
                "Not supported type of conversion ("+type+")",
                "ProjectManager"
            );
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

export function CreateRenderPartsWithData (renderParts: Array<any>, data) {
    let newItemParts: Array<any> = [];
    _.forEach(renderParts, (renderPart) => {
        let newItemPart: any = { type: renderPart.type };
        let value;
        switch(renderPart.type) {
            case "img":
                value = data.filter(x => x.hasOwnProperty(renderPart.id))[0][renderPart.id];
                newItemPart.value = _.includes(value, "fa-") ? { fa: value } : { path: value };
                break;
            case "title":
                value = data.filter(x => x.hasOwnProperty(renderPart.id))[0][renderPart.id];
                newItemPart.value = { text: value };
                break;
            case "state":
                break;
            default:
                IDEError.raise (
                    "PropertyView",
                    "Not supported type of conversion ("+renderPart.type+")",
                    "ProjectManager"
                );
        }
        newItemParts.push(newItemPart);
    });
    return newItemParts;
}
