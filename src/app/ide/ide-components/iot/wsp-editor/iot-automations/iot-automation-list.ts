/// <reference path="../../../../../../../node.d.ts"/>
import IoTAutomationListTmpl from "./iot-automation-list.tmpl";
import IoTAutomationCategoryTmpl from "./iot-automation-category.tmpl";
import { ViewRegistry } from "../../../../components-framework/component/registry";
import { View, IViewElement, ViewMetadata, IViewUserStyleData } from "../../../../components-framework/component/view";
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
    private cTemplate: Function;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private app: IoTApplication
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.cTemplate = _.template(IoTAutomationCategoryTmpl);
    }

    public render(): void {
        this.renderTmplEl({ totalAutomations: Object.keys(this.app.automations).length });
        _.forEach(Object.keys(this.app.automations), (automationType) => {
            var $cEl: JQuery = $(this.cTemplate({
                category: automationType,
                totalAutomations: this.app.automations[automationType].length
            }));
            _.forEach(this.app.automations[automationType], (automation) => {
                const autoViewBox: IoTAutomationViewBox = <IoTAutomationViewBox>ViewRegistry.getEntry("IoTAutomationViewBox").create(this.parent, automation);
                autoViewBox.render();
                $cEl.find(".automations-group-view-list").append(autoViewBox.$el);
            });
            this.$el.find(".automations-view-area").append($cEl);
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

    public setStyle(): void { ; }

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