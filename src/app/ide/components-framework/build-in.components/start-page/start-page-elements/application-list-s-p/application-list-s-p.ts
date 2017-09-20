/**
 * ApplicationListStartPage - Quick view of applications
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

/// <reference path="../../../../../../../../node.d.ts"/>
import ApplicationsListTmpl from "./application-list-s-p.html";
import { ViewMetadata } from "../../../../view/view";
import { ApplicationModel } from "../../../../../shared/models/application.model";
import { StartPageElementListSP } from "../start-page-element-list";


@ViewMetadata({
    name: "ApplicationsListStartPage",
    selector: ".pos-app-list",
    templateHTML: ApplicationsListTmpl
})
export class ApplicationListSP extends StartPageElementListSP<ApplicationModel> {
    public render(): void {
        this.$el.html(this.template(
            // TODO: add data of the template
        ));
    }

    public registerEvents(): void {
        this.attachEvents(
            // TODO: attach related events of the template
        );
    }

    protected requestElementsData (): void {
        this._elements = [
            new ApplicationModel("Remote Hospitality", "Automations using smart objects for remote hospitality purpuses"),
            new ApplicationModel("Morning Automations", "Automations using smart objects for the morning automations"),
            new ApplicationModel("Self-Caring Home", "Automations using smart objects for home care")
        ];
    }

    public RegisterEvents(): void {
        
    }

}