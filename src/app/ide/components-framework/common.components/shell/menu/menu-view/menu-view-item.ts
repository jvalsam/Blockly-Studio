/**
 * MenuView - Menu View Component of the platform
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import MenuItemTmpl from "./templates/menu-item.html";
import { MenuItemLeafData } from "../menu";
import { View, ViewMetadata, IViewEventRegistration } from "../../../../view/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { ComponentsCommunication } from "./../../../../component/components-communication";
import { IDEError } from "../../../../../shared/ide-error/ide-error";

@ViewMetadata({
    name: "MenuViewItem",
    templateHTML: MenuItemTmpl
})
export class MenuViewItem extends View {
    private menuItemBtn = ".ts-menu-item-btn";
    private events: Array<IViewEventRegistration>;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        private menuElem: MenuItemLeafData
    ) {
        super(parent, name, templateHTML);
        this.events = new Array<IViewEventRegistration>();
        for (let evtData of this.menuElem.events) {
            let evts = Object.keys(evtData);
            if (evts.length !== 1) {
                IDEError.raise("MenuViewItem", "Invalid event definition for view item in "+this.name, +" in Component "+this.parent.name);
            }
            let eventName = evts[0];
            let callback = evtData[evts[0]];
            this.events.push({
                eventType: eventName,
                selector: this.menuItemBtn,
                handler: () => ComponentsCommunication.functionRequest(this.parent.name, this.menuElem.compName, callback)
            });
        }
    }

    public render (): void {
        this.$el = $(this.template(this.menuElem));
        this.registerEvents();
    }

    public registerEvents (): void {
        this.attachEvents(...this.events);
    }
}
