import { IFontData } from './font-view';
/// <reference path="../../../../../../../../../node.d.ts"/>
import FontViewTmpl from "./font-view.html";
import { IInputData } from "../input-view/input-view";
import { IDynamicExtraData } from "../dynamic-extra-view/dynamic-extra-view";
import { ISelectData } from "../select-view/select-view";
import { ViewRegistry } from "../../../../../component/registry";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { IAggregateData, AggregateView } from "./../aggregate-view/aggregate-view";
import { ViewMetadata } from "./../../../../../component/view";
import { PropertyView, PropertyType, IPropertyData } from "../property-view";

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

interface IUpdateFuncs {
    [key: string]: (data: any) => void;
}

function IFontDataConverter(data:any): { indepedent: boolean, font: IFontData } {
    return {
        indepedent: data.indepedent,
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
            name: "Font",
            type: "font",
            renderName: true,
            indepedent: typeof (data.indepedent) !== "undefined" ? data.indepedent : false,
            props: {}
        };
        if (data.updateParent) {
            aggregateData.updateParent = data.updateParent;
        }
        super(parent, name, templateHTML, aggregateData);
        this.addFamily(data.font.family);
        this.addTextColor(data.font.textColor);
        this.addSize(data.font.size);
        this.addWeight(data.font.weight);
        this.addStyle(data.font.style);
    }

    private addFamily(value: any): void {
        let familyData: ISelectData = {
            name: "Family",
            selected: value,
            values: font_family_values,
            type: "aggregate",
            renderName: true,
            indepedent: true
        };
        this.addProperty("Family", <PropertyView>ViewRegistry.getEntry("SelectView").create(this.parent, familyData));
    }

    private addTextColor(value: any): void {
        let textColorData: IInputData = {
            name: "Text Colour",
            value: value,
            type: "color",
            renderName: true,
            indepedent: true
        };
        this.addProperty("Text Colour", <PropertyView>ViewRegistry.getEntry("InputView").create(this.parent, textColorData));
    }

    private addSize(value: any): void {
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
                    name: "Size",
                    value: "9",
                    renderName: false
                }
            },
            "percentage": {
                type: "percentage",
                value: {
                    parent: this,
                    name: "Size",
                    value: 0,
                    type: "percentage",
                    renderName: false
                }
            },
            "initial": 10
        };
        let main: ISelectData = {
            name: "Font size",
            type: "select",
            values: Object.keys(values),
            selected: value,
            renderName: false,
            indepedent: false
        };
        let fontSizeData: IDynamicExtraData = {
            name: "Font size",
            values: values,
            main: main,
            renderName: true,
            indepedent: true,
            type: "dynamic"
        };
        this.addProperty("Font size", <PropertyView>ViewRegistry.getEntry("DynamicExtraView").create(this.parent, fontSizeData));
    }

    private addWeight(value: any): void {
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
                    name: "Weight:",
                    value: "100",
                    step: 100,
                    min: 100,
                    max: 900,
                    type: "number",
                    renderName: false
                }
            }
        };
        let main: ISelectData = {
            name: "Font Weight",
            type: "select",
            values: Object.keys(values),
            selected: value,
            renderName: false,
            indepedent: false
        };
        let fontWeightData: IDynamicExtraData = {
            name: "Font weight",
            values: values,
            main: main,
            renderName: true,
            indepedent: true,
            type: "dynamic"
        };
        this.addProperty("Font weight", <PropertyView>ViewRegistry.getEntry("DynamicExtraView").create(this.parent, fontWeightData));
    }

    private addStyle(value: any): void {
        let fontStyleData: ISelectData = {
            name: "Font style",
            values: ["normal", "italic", "oblique", "initial"],
            selected: value,
            renderName: true,
            indepedent: true,
            type: "aggregate"
        };
        this.addProperty("Font style", <PropertyView>ViewRegistry.getEntry("SelectView").create(this.parent, fontStyleData));
    }
}
