import { IDEError } from "../../../../../../../shared/ide-error/ide-error";
import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../../component/view";
import { IViewEventRegistration } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ActionsViewTmpl from "./actions-view.tmpl";


interface IEventData {
    type: string;
    callback: string;
    providedBy: string;
}

interface IActionData {
    title: string;
    img?: string;
    help?: string;
    events: Array<IEventData>;
}

interface IActionsData {
    id: string;
    actions: Array<IActionData>;
}

@ViewMetadata({
    name: "ProjectManagerActionsView",
    templateHTML: ActionsViewTmpl
})
export class ProjectManagerActionsView extends View {
    private info: IActionsData;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.info = {
            id: this.id,
            actions: data.actions
        };
    }

    public render(): void {
        this.renderTmplEl(this.info);
    }

    public registerEvents(): void {
        let events = new Array<IViewEventRegistration>();
        _.forEach(this.info.actions, (action) => {
            _.forEach(action.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: "#" + action.title.replace(/ /g, '') + "_" + this.id,
                    handler: () => this.handleAction(event)
                });
            });
        });
        this.attachEvents(...events);
    }

    private handleAction(event: IEventData): void {
        if (event.providedBy === "Platform") {
            this.parent[event.callback]();
        }
        else {
            this.parent["onOuterFunctionRequest"](event.providedBy, event.callback);
        }
    }

    public setStyle(): void { ; }
}
