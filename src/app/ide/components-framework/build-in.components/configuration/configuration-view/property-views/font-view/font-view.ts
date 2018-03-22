/// <reference path="../../../../../../../../../node.d.ts"/>
import FontViewTmpl from "./font-view.html";
import { IFontData } from "./font-view";
import { IInputData } from "../input-view/input-view";
import { IDynamicExtraData } from "../dynamic-extra-view/dynamic-extra-view";
import { ISelectData } from "../select-view/select-view";
import { ViewRegistry } from "../../../../../component/registry";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { IAggregateData, AggregateView } from "./../aggregate-view/aggregate-view";
import { ViewMetadata } from "./../../../../../component/view";
import { PropertyView, PropertyType, IPropertyData, StyleObjectToString } from "../property-view";

const font_family_values: Array<string> = [
    "Georgia", "Palatino Linotype", "Book Antiqua", "Times New Roman", "Arial",
    "Helvetica", "Arial Black", "Impact", "Lucida Sans Unicode", "Tahoma",
    "Verdana", "Courier New", "Lucida Console", "initial"
];


export interface IFontData {
    family: string;
    textColor: string;
    size: string | number;
    weight: string | number;
    style: string;

    type: PropertyType;
    updateParent?: (data: any) => void;
}

export interface IFontCData {
    name: string;
    renderName: boolean;
    style: boolean;
    indepedent: boolean;
    isExtra: boolean;
    font: IFontData;
}

interface IUpdateFuncs {
    [key: string]: (data: any) => void;
}

function IFontDataConverter(data: any): IFontCData {
    return {
        name: data.config.name,
        style: data.config.style,
        renderName: data.renderName,
        indepedent: data.indepedent,
        isExtra: typeof(data.isExtra) ==="boolean" ? data.isExtra : false,
        font: data.value
    };
}


@ViewMetadata({
    name: "FontView",
    templateHTML: FontViewTmpl
})
export class FontView extends AggregateView {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        data: any
    ) {
        data = IFontDataConverter(data);
        let aggregateData: IAggregateData = {
            name: "Font (" + data.name + ")",
            type: "font",
            style: data.style,
            renderName: data.renderName,
            indepedent: typeof (data.indepedent) !== "undefined" ? data.indepedent : false,
            props: {}
        };
        if (data.updateParent) {
            aggregateData.updateParent = data.updateParent;
        }
        super(parent, name, templateHTML, aggregateData);
        this.addFamily(data.font["Family"], data.style);
        this.addTextColor(data.font["Text Colour"], data.style);
        this.addSize(data.font["Size"], data.style);
        this.addWeight(data.font["Weight"], data.style);
        this.addStyle(data.font["Style"], data.style);
    }

    private addFamily(value: any, style: any): void {
        let familyData: ISelectData = {
            name: "Family",
            style: style,
            selected: value,
            values: font_family_values,
            type: "aggregate",
            renderName: true,
            indepedent: true
        };
        this.addProperty("Family", <PropertyView>ViewRegistry.getEntry("SelectView").create(this.parent, familyData));
    }

    private addTextColor(value: any, style: any): void {
        let textColorData: IInputData = {
            name: "Text Colour",
            style: style,
            value: value,
            type: "color",
            renderName: true,
            indepedent: true
        };
        this.addProperty("Text Colour", <PropertyView>ViewRegistry.getEntry("InputView").create(this.parent, textColorData));
    }

    private addSize(value: any, style: any): void {
        let values: { [key: string]: { type: PropertyType, value: IPropertyData } | number } = {
            "xx-small": 1,
            "x-small": 2,
            "small": 3,
            "medium": 4,
            "large": 5,
            "x-large": 6,
            "xx-large": 7,
            "smaller": 8,
            "larger": 9,
            "number": {
                type: "number",
                value: {
                    type: "number",
                    parent: this,
                    style: style,
                    name: "Size",
                    value: typeof(value)==="object" && value.main==="number" ? value.extra : 16,
                    renderName: false
                }
            },
            "rem": {
                type: "number",
                value: {
                    parent: this,
                    style: style,
                    name: "Size",
                    value: typeof (value) === "object" && value.main === "rem" ? value.extra : 1,
                    step: 0.0001,
                    min: 0,
                    type: "number",
                    renderName: false
                }
            },
            "percentage": {
                type: "percentage",
                value: {
                    parent: this,
                    style: style,
                    name: "Size",
                    value: typeof (value) === "object" && value.main === "percentage" ? value.extra : 20,
                    type: "percentage",
                    renderName: false
                }
            },
            "initial": 10
        };
        let main: ISelectData = {
            name: "Size",
            style: style,
            type: "select",
            values: Object.keys(values),
            selected: value.main,
            renderName: false,
            indepedent: false
        };
        let fontSizeData: IDynamicExtraData = {
            name: "Size",
            style: style,
            value: value,
            values: values,
            main: main,
            renderName: true,
            indepedent: true,
            type: "dynamic"
        };
        this.addProperty("Size", <PropertyView>ViewRegistry.getEntry("DynamicExtraView").create(this.parent, fontSizeData));
    }

    private addWeight(value: any, style: any): void {
        let values: { [key: string]: { type: PropertyType, value: IPropertyData } | number } = {
            "normal": 1,
            "bold": 2,
            "bolder": 3,
            "lighter": 4,
            "initial": 5,
            "number": {
                type: "number",
                value: {
                    parent: this,
                    style: style,
                    name: "Weight",
                    value: typeof (value) === "object" && value.main === "number" ? value.extra : 100,
                    step: 100,
                    min: 100,
                    max: 900,
                    type: "number",
                    renderName: false
                }
            }
        };
        let main: ISelectData = {
            name: "Weight",
            style: style,
            type: "select",
            values: Object.keys(values),
            selected: value.main,
            renderName: false,
            indepedent: false
        };
        let fontWeightData: IDynamicExtraData = {
            name: "Weight",
            style: style,
            value: value,
            values: values,
            main: main,
            renderName: true,
            indepedent: true,
            type: "dynamic"
        };
        this.addProperty("Weight", <PropertyView>ViewRegistry.getEntry("DynamicExtraView").create(this.parent, fontWeightData));
    }

    private addStyle(value: any, style: any): void {
        let fontStyleData: ISelectData = {
            name: "Style",
            style: style,
            values: ["normal", "italic", "oblique", "initial"],
            selected: value,
            renderName: true,
            indepedent: true,
            type: "aggregate"
        };
        this.addProperty("Style", <PropertyView>ViewRegistry.getEntry("SelectView").create(this.parent, fontStyleData));
    }

    public static getStyle(data: any): JQueryCssProperties {
        return {
            "font-family": StyleObjectToString(data.Family),
            "font-size": StyleObjectToString(data.Size),
            "font-style": StyleObjectToString(data.Style),
            "font-weight": StyleObjectToString(data.Weight),
            "color": StyleObjectToString(data["Text Colour"])
        };
    }
}
