import { IDEError } from "../../../../../../../shared/ide-error/ide-error";
import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata } from "../../../../../../component/view";
import { IViewEventRegistration } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ActionsViewTmpl from "./actions-view.html";


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
        data: any
    ) {
        super(parent, name, templateHTML);
        data.id = this.id;
        this.info = (({id, actions}) => ({id, actions}))(data);
    }

    public render(): void {
        this.renderTmplEl(this.info);
        this.setStyle();
        this.registerEvents();
    }

    public registerEvents(): void {
        let events = new Array<IViewEventRegistration>();
        _.forEach(this.info.actions, (action) => {
            _.forEach(action.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: "#" + action.title + "_" + this.id,
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
