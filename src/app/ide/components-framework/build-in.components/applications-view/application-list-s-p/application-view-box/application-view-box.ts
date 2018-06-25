
/// <reference path="../../../../../../../../node.d.ts"/>
import ApplicationViewBoxTmpl from "./application-view-box.html";
import { View, ViewMetadata, IViewEventRegistration, ModalView } from "../../../../component/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import * as _ from "lodash";
import { ViewRegistry } from "../../../../component/registry";


@ViewMetadata({
    name: "ApplicationViewBox",
    templateHTML: ApplicationViewBoxTmpl
})
export class ApplicationViewBox extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        hookSelector: string,
        private application
    ) {
        super(parent, name, templateHTML, hookSelector);
        this.application.id = this.id;
        this.application.lastModified = new Date(this.application.lastModified).toUTCString();
    }

    public registerEvents(): void {
        let events: IViewEventRegistration[] = [];
        events.push({
            eventType: "click",
            selector: ".ts-application-action-box",
            handler: (evt) => {
                if (evt.target.id === "dropdownMenu"+this.id) {
                    return;
                }
                this.onOpenApplication();
            }
        });
        _.forEach(this.application.actions, (action) => {
            events.push({
                eventType: "click",
                selector: ".ts-application-action-"+action,
                handler: () => this["on"+_.startCase(action)+"Application"]()
            });
        });
        this.attachEvents(...events);
    }
    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.application);
    }

    private onOpenApplication(): void {
        this.parent["openApplication"](this.application._id);
    }

    private onDeleteApplication(): void {
        this.parent["deleteApplication"](this.application._id);
    }

    private onShareApplication(): void {
        this.parent["shareApplication"](this.application._id);
    }

    private onDetailsApplication(): void {
        let detailsBox = <ModalView>ViewRegistry.getEntry("ApplicationViewDetailsModal").create(
            this.parent,
            this.application
        );
        detailsBox.open();
    }
}
