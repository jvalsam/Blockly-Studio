/**
 * ApplicationListStartPage - Quick view of applications
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

/// <reference path="../../../../../../../../node.d.ts"/>
import SmartObjectListTmpl from "./smart-object-list-s-p.html";
import {
    UIComponentMetadata
} from "../../../../ide-ui-component";
import { SmartObjectModel, SOProperties } from "../../../../../shared/models/smart-object.model";
import { StartPageElementListSP } from "../start-page-element-list";


@UIComponentMetadata({
    name: "StartPageComponentsViewSmartObjects",
    description: "",
    selector: "#so-list",
    templateHTML: SmartObjectListTmpl
})
export class SmartObjectListSP extends StartPageElementListSP<SmartObjectModel> {

    protected _requestElementsData (): void {
        this._elements = [
            new SmartObjectModel("Alarm Clock", "", "./alarm_clock.png", new SOProperties()),
            new SmartObjectModel("Air-conditioning", "", "./air_conditioning.png", new SOProperties()),
            new SmartObjectModel("Coffee Machine", "", "./coffee_machine.png", new SOProperties()),
            new SmartObjectModel("TV", "", "./tv.png", new SOProperties())
        ];
    }

}
