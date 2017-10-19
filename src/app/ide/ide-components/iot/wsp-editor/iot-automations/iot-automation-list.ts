

/// <reference path="../../../../../../../node.d.ts"/>
import IoTAutomationListTmpl from "./iot-automation-list.html";
import { ViewRegistry } from "../../../../components-framework/view/view-registry";
import { View, IViewElement, ViewMetadata } from "../../../../components-framework/view/view";
import { IDEUIComponent } from "../../../../components-framework/component/ide-ui-component";
import { IoTApplication } from "../../application/iot-application";
import { IoTAutomationViewBox } from "./iot-automation-view-box/iot-automation-view-box";

import * as _ from "lodash";

export interface IWSPEditorIoTAutomationsListViewElement extends IViewElement {
    view: IoTAutomationList;
}

@ViewMetadata({
    name: "IoTAutomationsWSPEditor",
    templateHTML: IoTAutomationListTmpl
})
export class IoTAutomationList extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        private app: IoTApplication 
    ) {
        super(parent, name, templateHTML);
    }
    
    public render(): void {
        this.$el = $(this.template({ totalAutomations: Object.keys(this.app.automations).length }));
        this.registerEvents();
        _.forEach(this.app.automations, (automation) => {
            const autoViewBox: IoTAutomationViewBox = <IoTAutomationViewBox>ViewRegistry.getViewEntry("IoTAutomationViewBox").create(this.parent, automation);
            autoViewBox.render();
            this.$el.find(".automations-view-list").append(autoViewBox.$el);
        });
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-create-automation",
                handler: this.createAutomation
            },
            {
                eventType: "click",
                selector: ".ts-search-automation",
                handler: this.searchAutomation
            }
        );
    }

    /**
     *  Events Function Callbacks
     */
    private createAutomation(): void {
        alert("createAutomations: Not implemented yet.");
    }

    private searchAutomation(): void {
        alert("searchAutomations: Not implemented yet.");
    }
}