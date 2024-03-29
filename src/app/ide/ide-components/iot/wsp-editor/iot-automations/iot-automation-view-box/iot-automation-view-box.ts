
/// <reference path="../../../../../../../../node.d.ts"/>
import AutomationViewBoxTmpl from "./iot-automation-view-box.tmpl";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../components-framework/component/view";
import { IDEUIComponent } from "../../../../../components-framework/component/ide-ui-component";
import { Automation } from "../../../application/automation"

@ViewMetadata({
    name: "IoTAutomationViewBox",
    templateHTML: AutomationViewBoxTmpl
})
export class IoTAutomationViewBox extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private automation: Automation
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-edit-automation",
                handler: () => {
                    this.parent["selectedAutomationId"] = this.automation.id;
                    $("#automation-view-" + this.automation.id).css("background-color", "#D3D3D3");
                    this.onOpenAutomation();
                }
            },
            {
                eventType: "mouseover",
                selector: ".ts-edit-automation",
                handler: () => $("#automation-view-" + this.automation.id).css("background-color", "rgb(196, 195, 195)")
            },
            {
                eventType: "mouseout",
                selector: ".ts-edit-automation",
                handler: () => {
                    if (this.parent["selectedAutomationId"] !== this.automation.id ) {
                        $("#automation-view-" + this.automation.id).css("background-color", "rgba(211, 211, 211, 0.541)");
                    }
                }
            }
        );
    }

    public setStyle(): void {}


    public render(): void {
        this.renderTmplEl({
            id: this.automation.id,
            name: this.automation.name
        });
    }

    /**
     *  Events Function Callbacks
     */
    private onOpenAutomation(): void {
        this.parent["openAutomation"](this.automation.id, this.automation.type);
    }
}
