
/// <reference path="../../../../../../node.d.ts"/>
import ActionsViewTmpl from "./actions-view.tmpl";
import { View, ViewMetadata, IViewEventRegistration, IViewStyleData } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import * as _ from "lodash";

interface IEventData {
    type: string;
    callback: string | Function;
    providedBy?: string;
}

interface IActionData {
    title: string;
    img?: string;
    help?: string;
    events: Array<IEventData>;
}

@ViewMetadata({
    name: "ActionsView",
    templateHTML: ActionsViewTmpl
})
export class ActionsView extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: IViewStyleData,
        hookSelector: string,
        private data: { id:string, actions: Array<IActionData>, style?: {} }
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.data.id = this.id;
    }

    public registerEvents(): void {
        let events: IViewEventRegistration[] = [];
        _.forEach(this.data.actions, (action) => {
            _.forEach(action.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: "#" + action.title.replace(/ /g, '') + "_" + this.id,
                    handler: () => typeof event.callback === "string" ?
                                        (event.providedBy === "Platform" ?
                                            this.parent[event.callback]() :
                                            this.parent["onOuterFunctionRequest"](event.providedBy, event.callback)
                                        ) :
                                        event.callback()
                });
            });
        });
        this.attachEvents(...events);
    }
    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.data);
    }

    public targetIsOnViewParts (targetId: string): boolean {
        return targetId === "dropdownMenu"+this.id || targetId === "target-"+this.id;
    }
}
