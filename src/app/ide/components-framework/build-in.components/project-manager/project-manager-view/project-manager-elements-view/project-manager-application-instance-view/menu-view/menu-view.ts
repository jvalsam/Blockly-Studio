import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewStyleData } from "../../../../../../component/view";
import { IViewEventRegistration } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import MenuViewTmpl from "./menu-view.html";


interface IEventData {
    type: string;
    callback: string;
    providedBy: string;
}

interface IMenuItemData {
    title: string;
    img?: string;
    help?: string;
    events: Array<IEventData>;
}

interface IMenuData {
    id: string;
    menuItems: Array<IMenuItemData>;
}

@ViewMetadata({
    name: "ProjectManagerMenuView",
    templateHTML: MenuViewTmpl
})
export class ProjectManagerMenuView extends View {
    private info: IMenuData;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: IViewStyleData,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        data.id = this.id;
        this.info = (({ id, menuItems }) => ({ id, menuItems }))(data);
    }

    public render(): void {
        this.renderTmplEl(this.info);
    }

    public registerEvents(): void {
        let events = new Array<IViewEventRegistration>();
        _.forEach(this.info.menuItems, (menuItem) => {
            _.forEach(menuItem.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: "#" + menuItem.title + "_" + this.id,
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

    public onRightClick(e): void {
        $("#rcmenu_" + this.id)
            .data("invokedOn", $(e.target))
            .show()
            .css({
                position: "absolute",
                left: e.pageX,
                top: e.pageY
            });
        //TODO: remove html from template in case the following will be removed
        // $("#hidden_button_"+this.id).trigger("click");
    }

    public setStyle(): void { ; }
}
