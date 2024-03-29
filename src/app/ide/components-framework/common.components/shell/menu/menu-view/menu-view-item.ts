import MenuItemTmpl from "./templates/menu-item.tmpl";
import { MenuItemLeafData } from "../menu";
import { View, ViewMetadata, IViewEventRegistration, IViewUserStyleData } from "../../../../component/view";
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
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private menuElem: MenuItemLeafData
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.events = new Array<IViewEventRegistration>();
        this.menuElem["id"] = this.id;
        if (this.menuElem.type === "leaf") {
            for (let evtData of this.menuElem.events) {
                let evts = Object.keys(evtData);
                if (!evtData["type"] || !evtData["handler"]) {
                    IDEError.raise(
                        "MenuViewItem",
                        "Invalid event definition for view item in " + this.name +
                        " in Component " + this.parent.name
                    );
                }
                this.events.push({
                    eventType: evtData["type"],
                    selector: this.menuItemBtn,
                    handler: evtData["args"] ?
                        () => ComponentsCommunication.functionRequest(this.parent.name, this.menuElem.compName, evtData["handler"], evtData["args"]) :
                        () => ComponentsCommunication.functionRequest(this.parent.name, this.menuElem.compName, evtData["handler"])
                });
            }
        }
    }

    public render (): void {
        this.renderTmplEl(this.menuElem);
    }

    public registerEvents (): void {
        this.attachEvents(...this.events);
    }

    public setStyle(): void {}
}
