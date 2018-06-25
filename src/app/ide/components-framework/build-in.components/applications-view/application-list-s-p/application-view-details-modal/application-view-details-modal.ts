/// <reference path="../../../../../../../../node.d.ts"/>
import ApplicationViewDetailsTmpl from "./application-view-details-modal.html";
import { ViewMetadata, View } from "../../../../component/view";


@ViewMetadata({
    name: "ApplicationViewDetailsModal",
    templateHTML: ApplicationViewDetailsTmpl
})
export class ApplicationViewDetailsModal extends View {
    private application;

    public initialize(): void {
        super.initialize();
    }

    public render(): void {
        this.renderTmplEl(this.application);
        this.setStyle();
        // $("div." + this.selector).empty();
        // $("div." + this.selector).append(this.$el);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-btn-config-cancel",
                handler: () => this.onCancel()
            },
            {
                eventType: "click",
                selector: ".ts-btn-config-reset",
                handler: () => this.onReset()
            },
            {
                eventType: "click",
                selector: ".ts-btn-config-save",
                handler: () => this.onSave()
            }
        );
    }

    public setStyle(): void {
    }

    private onSave(): void {
    }

    private onReset(): void {
        this.close();
        this.open();
    }

    private onCancel(): void {
        this.close();
    }

    public open(): void {
        this.render();
        $("#" + this.id)["modal"]("show");
    }

    private close(): void {
        $("#" + this.id + " .close").click();
    }
}