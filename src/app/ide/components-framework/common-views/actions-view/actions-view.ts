
/// <reference path="../../../../../../node.d.ts"/>
import ActionsViewTmpl from "./actions-view.tmpl";
import ActionsViewSYCSS from "./actions-view.sycss";
import { View, ViewMetadata, IViewEventRegistration, IViewUserStyleData } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import * as _ from "lodash";

export interface IValidationData {
    rules: any;
    type: "system"|"custom";
}

export interface IEventData {
    type: string;
    action: string | Function;
    providedBy?: string;
    data: any;
    validation?: Array<IValidationData>;
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
        private data: { id:string, actions: Array<IActionData>, fa: string, style?: {}, concerned: any }
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.data.id = this.id;
        
        if (!this.data.fa) {
            this.data.fa = "fa-ellipsis-v";
        }

        // in font awesome icons add prefix fa in case there is no prefix
        _.forEach(this.data.actions, (action) =>
            action.img = ( action.img && _.includes(action.img, "fa-") && action.img.split(" ").length < 2 ) ? "fa " + action.img : action.img
        );
    }

    public registerEvents(): void {
        let events: IViewEventRegistration[] = [];
        _.forEach(this.data.actions, (action) => {
            _.forEach(action.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: "#" + action.title.replace(/ /g, '') + "_" + this.id,
                    handler: (evt) => {
                                        // this.hideMenu();
                                        typeof event.action === "string" ?
                                        (!event.providedBy || event.providedBy === "Platform" ?
                                            this.parent[event.action](event, this.data.concerned) :
                                            this.parent["onOuterFunctionRequest"](event, this.data.concerned)
                                        ) :
                                        event.action(this.data.concerned);
                                        evt.stopImmediatePropagation();
                    }
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

    public hideMenu() {
        $("#dropdown-menu-"+this.id).hide();
    }

    public showMenu() {
        $("#dropdown-menu-"+this.id).show();
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
        return  target === document.getElementById(this.id) ||
                target === document.getElementById("target-"+this.id) ||
                target === document.getElementById("dropdownMenu"+this.id) ||
                target === document.getElementById("dropdown-menu-"+this.id);
    }

}
