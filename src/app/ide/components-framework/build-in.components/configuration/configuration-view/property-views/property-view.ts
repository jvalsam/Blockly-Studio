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

var convertDataMap = {
    img: {
        value: (value) => value.path ? value.path : (value.fa ? value.fa : undefined),
        type: "image"
    },
    title: {
        value: (value) => value.text ? value.text : undefined,
        type: "text"
    },
    colour: {
        value: (value) => value.colour ? value.colour : undefined,
        type: "color"
    }
};

function convertPart(part, total) {
    let convertData = convertDataMap[part.type];
    let respObj: any = {
        descriptionID: part.id,
        name: part.value.property+":",
        type: convertData.type,
        value: convertData.value(part.value),
        description: "Select " + part.type + " of the item.",
        defaultValue: part.value.default + " " + total,
        required: part.value.required ? part.value.required : false,
        renderNO: part.formElemItemRenderNO
    };
    switch(part.type) {
        case "img":
            respObj.type = "file";
            respObj.ftype = "image";
            break;
        case "title":
            respObj.placeholder = "Enter "+part.value.property;
            break;
        case "colour":
            break;
        default:
            IDEError.raise (
                "PropertyView",
                "Not supported type of conversion ("+part.type+")",
                "ProjectManager"
            );
    }
    return respObj;
}
export function RenderPartsToPropertyData (renderParts: Array<any>, total: number) {
    let properties = [];
    if (renderParts && renderParts.length>0) {
        renderParts.forEach((part) => {
            if (part.selectedBy === "user") {
                properties.push(convertPart(part, total));
            }
        });
    }
    return properties;
}

export function CreateRenderPartsWithData (renderParts: Array<any>, data) {
    let newItemParts: Array<any> = [];
    _.forEach(renderParts, (renderPart) => {
        let newItemPart: any = { type: renderPart.id };
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
            case "colour":
                value = data.filter(x => x.hasOwnProperty(renderPart.id))[0][renderPart.id];
                newItemPart.value = { colour: value }
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
