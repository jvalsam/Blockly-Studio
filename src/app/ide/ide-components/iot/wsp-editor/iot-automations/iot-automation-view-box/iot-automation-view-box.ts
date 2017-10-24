
/// <reference path="../../../../../../../../node.d.ts"/>
import AutomationViewBoxTmpl from "./iot-automation-view-box.html";
import { View, ViewMetadata } from "../../../../../components-framework/view/view";
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
        private automation: Automation
    ) {
        super(parent, name, templateHTML);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-edit-automation",
                handler: () => this.onOpenAutomation()
            }
        );
    }

    public render(): void {
        this.$el = $(
            this.template({
                name: this.automation.name
            })
        );
        this.registerEvents();
    }

    /**
     *  Events Function Callbacks
     */
    private onOpenAutomation(): void {
        this.parent["openAutomation"](this.automation.id, this.automation.type);
    }
}
