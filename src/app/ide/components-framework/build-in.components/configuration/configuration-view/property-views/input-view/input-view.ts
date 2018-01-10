import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata } from "../../../../../component/view";
import { IPropertyData, PropertyView } from "../property-view";

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
    return {
        name: data.config.name,
        type: data.config.type,
        indepedent: data.indepedent,
        value: data.config.value,
        min: data.config.min,
        step: data.config.step,
        max: data.config.max
    };
}

@ViewMetadata({
    name: "InputView",
    templateHTML: InputViewTmpl
})
export class InputView extends PropertyView {
    protected data: IInputData;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        data: any
    ) {
        super(parent,name,templateHTML);
        this.data = IInputDataConverter(data);
        this.data["id"] = this.id;
    }

    public render(): void {
        this.renderTmplEl(this.data);
        this.registerEvents();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "change",
                selector: ".ts-change-input",
                handler: () => {
                    switch (this.data.type) {
                        case "checkbox":
                            this.data.value = $("#value_" + this.id)["checked"];
                            break;
                        case "image":
                            this.data.value = $("#value_" + this.id).val();
                            this.readURL(this);
                            break;
                        default:
                            this.data.value = $("#value_" + this.id).val();
                    }
                    this.data.value = this.data.type !== "checkbox" ? $("#value_" + this.id).val():$("#value_" + this.id)["checked"];
                    if (this.data.updateParent) {
                        this.data["updateParent"](this.data);
                    }
                }
            }
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

    public get value(): any {
        return this.data.value;
    }
}