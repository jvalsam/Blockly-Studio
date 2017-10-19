

/// <reference path="../../../../../../../../../node.d.ts"/>
import ApplicationViewBoxTmpl from "./application-view-box.html";
import ApplicationMenuTmpl from "./application-menu.html";
import { View, ViewMetadata } from "../../../../../view/view";
import { ApplicationModel } from "../../../../../../shared/models/application.model";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";

@ViewMetadata({
    name: "ApplicationViewBox",
    templateHTML: ApplicationViewBoxTmpl
})
export class ApplicationViewBox extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        private application: ApplicationModel
    ) {
        super(parent, name, templateHTML);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-start-page-application-open",
                handler: () => this.onOpenApplication()
            },
            {
                eventType: "click",
                selector: ".ts-start-page-application-menu",
                handler: () => this.onClickApplicationMenu()
            },
            {
                eventType: "focusout",
                selector: ".ts-start-page-application-menu",
                handler: () => this.onFocusOutApplicationMenu()
            }
        );
    }

    public render(): void {
        this.$el = $(
            this.template({
                name: this.application.name,
                description: this.application.description,
                imagePath: this.application.imagePath,
                lastUpdated: this.application.lastUpdated.toLocaleString()
            })
        );
        this.registerEvents();
    }

    private onOpenApplication(): void {
        this.parent["openApplication"](this.application.id);
    }

    private onClickApplicationMenu(): void {
        alert("onClickApplicationMenu: not implemented yet.");
    }
    private onFocusOutApplicationMenu(): void {
        alert("onFocusOutApplicationMenu: not implemented yet.");
    }
}
