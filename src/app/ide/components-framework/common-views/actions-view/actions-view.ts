
/// <reference path="../../../../../../node.d.ts"/>
import ActionsViewTmpl from "./actions-view.html";
import { View, ViewMetadata, IViewEventRegistration } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import * as _ from "lodash";

@ViewMetadata({
    name: "ActionsView",
    templateHTML: ActionsViewTmpl
})
export class ActionsView extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        hookSelector: string,
        private data
    ) {
        super(parent, name, templateHTML, hookSelector);
        this.data.id = this.id;
    }

    public registerEvents(): void {
        let events: IViewEventRegistration[] = [];
        _.forEach(this.data.actions, (action) => {
            _.forEach(action.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: ".ts-application-action-"+action.title,
                    handler: () => event.callback()
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
