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

import { ComponentViewElementMetadata, ComponentViewElement } from "../../../component/component-view";
import { ViewRegistry } from "../../../component/registry";
import { ApplicationsAdministration } from "../../applications-admin-sc/applications-administration";
import { View } from "../../../component/view";

@ComponentViewElementMetadata({
    name: "ApplicationsListStartPage",
    //selector: ".application-list-view-area",
    templateHTML: ApplicationsListTmpl
})
export class ApplicationListSP extends ComponentViewElement {
    private applications: Array<any>;

    public renderOnResponse(applications): void {
        this.applications = applications;
        this.renderTmplEl({ totalApplications: applications.length });
        // TODO: application type request to pin data for the actions...
        _.forEach(applications, (application) => {
            application.actions = this.renderData.domain.actions;
            const appViewBox: View = ViewRegistry.getEntry("ApplicationViewBox").create(this.parent, application);
            appViewBox.render();
            this.$el.find(".applications-view-list").append(appViewBox.$el);
        });
    }

    public render(callback?: Function): void {
        ApplicationsAdministration.requestApplications(
            this.renderData.filters,
            (elements) => {
                this.renderOnResponse(elements);
                callback();
            }
        );
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

    public setDomain(domain, callback): void {

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