/**
 * ApplicationListStartPage - Quick view of applications
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 * 
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Refactoring: general view of Applications (based on domains and privelleges) 
 *              used by Project Manager and Start Page Component
 */

/// <reference path="../../../../../../../node.d.ts"/>
import ApplicationsListTmpl from "./application-list-s-p.html";

import * as _ from "lodash";

import { ComponentViewElementMetadata } from "../../../component/component-view";
import { ViewRegistry } from "../../../component/registry";
import { ApplicationModel } from "../../../../shared/models/application.model";
import { ApplicationsAdministration, AppFilter } from "../../applications-admin-sc/applications-administration";
import { ElementsList } from "../../elements-list-view/elements-view";
import { View } from "../../../component/view";

@ComponentViewElementMetadata({
    name: "ApplicationsListStartPage",
    selector: ".application-list-view-area",
    templateHTML: ApplicationsListTmpl
})
export class ApplicationListSP extends ElementsList<ApplicationModel, AppFilter> {
    public renderOnResponse(applications): void {
        this.renderTmplEl({ totalApplications: applications.length });
        this.registerEvents();
        _.forEach(this._elements, (application) => {
            const appViewBox: View = ViewRegistry.getEntry("ApplicationViewBox").create(this.parent, application);
            appViewBox.render();
            this.$el.find(".applications-view-list").append(appViewBox.$el);
        });
    }

    public render(): void {
        this.requestElementsData();
        this.renderTmplEl();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-start-page-new-application",
                handler: this.openApplication
            },
            {
                eventType: "click",
                selector: ".ts-start-page-search-application",
                handler: this.searchApplication
            }
        );
    }

    protected requestElementsData (): void {
        ApplicationsAdministration.requestApplications (
            this.renderData.filters,
            (elements) => this.reloadApplications(elements)
        );
    }

    protected reloadApplications(elements: Array<ApplicationModel>) {

    }

    public setDomain(domain): void {

    }

    /**
     *  Events Function Callbacks
     */

    private openApplication(): void {
        alert("openApplication: Not implemented yet.");
    }

    private searchApplication(): void {
        alert("searchApplication: Not implemented yet.");
    }
}