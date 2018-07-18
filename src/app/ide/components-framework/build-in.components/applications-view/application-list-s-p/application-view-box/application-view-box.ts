
/// <reference path="../../../../../../../../node.d.ts"/>
import ApplicationViewBoxTmpl from "./application-view-box.html";
import { View, ViewMetadata, ModalView } from "../../../../component/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { ActionsView } from "../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from './../../../../component/registry';
import * as _ from "lodash";

@ViewMetadata({
    name: "ApplicationViewBox",
    templateHTML: ApplicationViewBoxTmpl
})
export class ApplicationViewBox extends View {
    private actions: ActionsView;
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
        var data = { actions: [] };
        _.forEach(this.application.actions, (action) => {
            data.actions.push({
                title: action,
                events: [
                    {
                        type: "click",
                        callback: () => this.parent["action_"+action](action==="details" ? this.application : this.application._id)
                    }
                ]
            });
        });
        this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView").create(this.parent, "#application-box-actions-"+this.id, data);
    }

    public registerEvents(): void {
        this.attachEvents({
            eventType: "click",
            selector: ".ts-application-action-box",
            handler: (evt) => {
                if (!this.actions.targetIsOnViewParts(evt.target.id))
                    this.parent["action_open"](this.application._id);
            }
        });
    }
    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.application);
        this.actions.render();
    }

    private onDeleteApplication(): void {
        this.parent["deleteApplication"](this.application._id);
    }

    private onShareApplication(): void {
        this.parent["shareApplication"](this.application._id);
    }
}
