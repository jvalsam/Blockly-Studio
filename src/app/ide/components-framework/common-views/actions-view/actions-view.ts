
/// <reference path="../../../../../../node.d.ts"/>
import ActionsViewTmpl from "./actions-view.tmpl";
import ActionsViewSYCSS from "./actions-view.sycss";
import { View, ViewMetadata, IViewEventRegistration, IViewUserStyleData } from "../../component/view";
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
    templateHTML: ActionsViewTmpl,
    style: {
        system: ActionsViewSYCSS
    }
})
export class ActionsView extends View {
    private position: { x: number, y: number };

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
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
        events.push({
            eventType: "shown.bs.dropdown",
            selector: "#test-"+this.id,
            handler: (evt) => {
                //TODO: fix position of the dropdown menu
                if (this.position) {
                    $("#dropdown-menu-"+this.id).parent().css({position: "relative"});
                    $("#dropdown-menu-"+this.id).css({position: "absolute"});
                    $("#dropdown-menu-"+this.id).offset({
                        top: this.position.y,
                        left: this.position.x
                    });
                    $("#dropdown-menu-"+this.id)["dropdown"]('update');
                }
            }
        });
        this.attachEvents(...events);
    }
    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.data);
    }

    public hide() {
        $("#target-"+this.id).hide();
    }
    
    public show() {
        $("#target-"+this.id).show();
    }

    public open(evt) {
        //TODO: fix position of the dropdown menu
        var e = evt.target;
        var dim = e.getBoundingClientRect();
        this.position = {
            x: evt.pageX - dim.left,
            y: evt.pageY
        };
        $("#dropdownMenu"+this.id).trigger("click");
    }

    public targetIsOnViewParts (targetId: string): boolean {
        return targetId === "dropdownMenu"+this.id || targetId === "target-"+this.id;
    }

    public isOnTarget(target): boolean {
        return  target.classList[0] === "page-folding-link-icon" ||
                target.classList[1] === "actions-view-title";
    }

}
