/**
 * ApplicationListStartPage - Quick view of applications
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

/// <reference path="../../../../../../../../node.d.ts"/>
import ApplicationsListTmpl from "./application-list-s-p.html";

import * as _ from "lodash";

import { ComponentViewElementMetadata } from "../../../../component/component-view";
import { ViewRegistry } from "../../../../view/view";
import { ApplicationViewBox } from "./application-view-box/application-view-box";
import { ApplicationModel } from "../../../../../shared/models/application.model";
import { ApplicationsAdministration } from "../../../applications-admin-sc/applications-administration";
import { StartPageElementListSP } from "../start-page-element-list";


@ComponentViewElementMetadata({
    name: "ApplicationsListStartPage",
    selector: ".application-list-view-area",
    templateHTML: ApplicationsListTmpl
})
export class ApplicationListSP extends StartPageElementListSP<ApplicationModel> {
    public render(): void {
        this.requestElementsData();
        this.$el = $(this.template({totalApplications: this._elements.length}));
        this.registerEvents();
        _.forEach(this._elements, (application) => {
            const appViewBox: ApplicationViewBox = <ApplicationViewBox>ViewRegistry.getEntry("ApplicationViewBox").create(this.parent, application);
            appViewBox.render();
            this.$el.find(".applications-view-list").append(appViewBox.$el);
        });
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
        this._elements = ApplicationsAdministration.requestUserApplications();
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