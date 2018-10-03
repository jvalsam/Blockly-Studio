import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata, IViewUserStyleData } from "../../../../../component/view";
import { IPropertyData, PropertyView } from "../property-view";
import { FontView } from "../font-view/font-view";

/// <reference path="../../../../../../../../node.d.ts"/>
import InputViewTmpl from "./input-view.html";


export interface IInputData extends IPropertyData {
    value: string | number;
    step?: string | number;
    min?: string | number;
    max?: string | number;
}

function IInputDataConverter(data: any): IInputData {
    if (!data.config) {
        return data;
    }
    let inputData: IInputData = {
        name: data.config.name,
        type: data.config.type,
        style: data.config.style,
        indepedent: data.indepedent,
        isExtra: typeof (data.isExtra) === "boolean" ? data.isExtra : false,
        value: data.value,
        min: data.config.min,
        step: data.config.step,
        max: data.config.max
    };
    inputData["id"] = data.id;
    return inputData;
}

@ViewMetadata({
    name: "InputView",
    templateHTML: InputViewTmpl
})
export class InputView extends PropertyView {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(parent,name,templateHTML, style, hookSelector, data);
        this.data = IInputDataConverter(data);
    }

    public render(): void { this.renderTmplEl(this.data); }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "change",
                selector: ".ts-change-input",
                handler: () => this.onChange()
            }
        );
    }

    public setStyle(): void {
        this.$el.find("#title_" + this.id).css(
            FontView.getStyle(this.data.style)
        );
    }

    private readURL(input:any): void {
        if (input.files && input.files[0]) {
            var reader: FileReader = new FileReader();
            var id: string = this.id;
            reader.onload = function (e: Event): void {
                $("#img_"+id).attr("src", e.target["result"]);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    public onChange(): void {
        switch (this.data.type) {
            case "checkbox":
                this.data.value = $("#input_"+this.id)["checked"];
                break;
            case "image":
                this.data.value = $("#input_"+this.id).val();
                this.readURL(this);
                break;
            default:
                this.data.value = $("#input_"+this.id).val();
        }
        this.data.value = this.data.type !== "checkbox" ? $("#input_"+this.id).val() : $("#input_"+this.id)["checked"];
        if (this.data.updateParent) {
            this.data["updateParent"](this.data);
        }
    }

    public focus() {
        let input = $("#input_"+this.id);
        if (this.data.type === "text") {
            let len = input.val().length;
            input[0].focus();
            input[0]["setSelectionRange"](len, len);
        }
        else {
            input[0].focus();
        }
    }

    public get value(): any {
        return this.data.value;
    }
}