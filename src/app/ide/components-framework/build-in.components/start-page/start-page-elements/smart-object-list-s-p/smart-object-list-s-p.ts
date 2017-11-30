/// <reference path="../../../../../../../../node.d.ts"/>
import SmartObjectListTmpl from "./smart-object-list-s-p.html";
import { ComponentViewElementMetadata } from "../../../../component/component-view";
import { ViewRegistry } from "../../../../component/registry";
import { SmartObjectViewBox } from "./smart-object-view-box/smart-object-view-box";
import { SmartObjectModel, SOProperties } from "../../../../../shared/models/smart-object.model";
import { StartPageElementListSP } from "../start-page-element-list";
import * as _ from "lodash";

@ComponentViewElementMetadata({
    name: "SmartObjectListStartPage",
    selector: ".smart-object-list-view-area",
    templateHTML: SmartObjectListTmpl
})
export class SmartObjectListSP extends StartPageElementListSP<SmartObjectModel> {
    public render(): void {
        this.requestElementsData();
        this.renderTmplEl({ totalSmartObjects: this._elements.length });
        this.registerEvents();
        _.forEach(this._elements, (smartObject) => {
            const soViewBox: SmartObjectViewBox = <SmartObjectViewBox>ViewRegistry.getEntry("SmartObjectViewBox").create(this.parent, smartObject);
            soViewBox.render();
            this.$el.find(".smart-objects-view-list").append(soViewBox.$el);
        });
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-register-new-smart-object",
                handler: this.registerSmartObject
            },
            {
                eventType: "click",
                selector: ".ts-search-smart-object",
                handler: this.searchSmartObject
            }
        );
    }

    protected requestElementsData (): void {
        this._elements = [
            new SmartObjectModel("Alarm Clock", "", "../../../../../../../../images/alarm-clock.png", new SOProperties()),
            new SmartObjectModel("Air Condition", "", "../../../../../../../../images/air-condition.png", new SOProperties()),
            new SmartObjectModel("Coffee Machine", "", "../../../../../../../../images/coffee-machine.png", new SOProperties()),
            new SmartObjectModel("TV", "", "../../../../../../../../images/TV.png", new SOProperties())
        ];
    }

    /**
     *  Events Function Callbacks
     */

    private registerSmartObject(): void {
        alert("registerSmartObject: Not implemented yet.");
    }

    private searchSmartObject(): void {
        alert("searchSmartObject: Not implemented yet.");
    }

}
