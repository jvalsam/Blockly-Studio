

/// <reference path="../../../../../../../../../node.d.ts"/>
import SmartObjectViewBoxTmpl from "./smart-object-view-box.html";
import SmartObjectMenuTmpl from "./smart-object-menu.html";
import { View, ViewMetadata } from "../../../../../view/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { SmartObjectModel } from "../../../../../../shared/models/smart-object.model";

@ViewMetadata({
    name: "SmartObjectViewBox",
    templateHTML: SmartObjectViewBoxTmpl
})
export class SmartObjectViewBox extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        private smartObject: SmartObjectModel
    ) {
        super(parent, name, templateHTML);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-start-page-smart-object-open",
                handler: this.onClickSmartObject
            },
            {
                eventType: "click",
                selector: ".ts-start-page-smart-object-menu",
                handler: this.onClickSmartObjectMenu
            },
            {
                eventType: "focusout",
                selector: ".ts-start-page-smart-object-menu",
                handler: this.onFocusOutSmartObjectMenu
            }
        );
    }

    public render(): void {
        this.$el = $(
            this.template({
                name: this.smartObject.name,
                description: this.smartObject.description,
                imagePath: this.smartObject.imagePath,
                lastAction: this.smartObject.lastAction.toLocaleString()
            })
        );
        this.registerEvents();
    }

    private onClickSmartObject(): void {
        alert("onClickSmartObject: not implemented yet.");
    }

    private onClickSmartObjectMenu(): void {
        alert("onClickSmartObjectMenu: not implemented yet.");
    }
    private onFocusOutSmartObjectMenu(): void {
        alert("onFocusOutSmartObjectMenu: not implemented yet.");
    }
}
