/**
 * ApplicationListStartPage - Quick view of applications
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

/// <reference path="../../../../../../../../node.d.ts"/>
import ApplicationsListTmpl from "./application-list-s-p.html";
import { UIComponentMetadata } from "../../../../ide-ui-component";
import { ApplicationModel } from "../../../../../shared/models/application.model";
import { StartPageElementListSP } from "../start-page-element-list";


@UIComponentMetadata({
    name: "StartPageComponentsViewApplications",
    description: "",
    selector: "#app-list",
    templateHTML: ApplicationsListTmpl
})
export class ApplicationListSP extends StartPageElementListSP<ApplicationModel> {

    protected _requestElementsData (): void {
        this._elements = [
            new ApplicationModel("Remote Hospitality", "Automations using smart objects for remote hospitality purpuses"),
            new ApplicationModel("Morning Automations", "Automations using smart objects for the morning automations"),
            new ApplicationModel("Self-Caring Home", "Automations using smart objects for home care")
        ];
    }

}