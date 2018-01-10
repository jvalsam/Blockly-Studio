import MenuAggregateItemTmpl from "./templates/menu-aggregate-item.html";
import { MenuViewItem } from "./menu-view-item";
import {
    MenuItemLeafData,
    MenuItemData,
    MenuElem
} from "../menu";
import { IDEError } from "./../../../../../shared/ide-error/ide-error";
import { View, ViewMetadata } from "../../../../component/view";
import { ViewRegistry } from "../../../../component/registry";
import { IDEUIComponent } from "../../../../component/ide-ui-component";

import * as _ from "lodash";


export function renderMenuElem(parent: IDEUIComponent, menuElem: MenuElem): MenuViewItem | MenuAggregateViewItem {
    let viewItem: MenuViewItem | MenuAggregateViewItem;
    switch (menuElem.data.type) {
        case "divider":
        case "leaf":
            viewItem = <MenuViewItem>ViewRegistry.getEntry("MenuViewItem").create (
                parent,
                <MenuItemLeafData>(menuElem.data)
            );
            break;
        case "sub-menu":
            viewItem = <MenuAggregateViewItem>ViewRegistry.getEntry("MenuAggregateViewItem").create (
                parent,
                <MenuItemData>(menuElem.data)
            );
            break;
        default:
            IDEError.raise(
                "renderMenuElem",
                "Type in Menu Element "+menuElem.data.title + " of Component " + parent.name +
                " is not defined as leaf or sub-menu or divider!"
            );
    }
    return viewItem;
}


@ViewMetadata({
    name: "MenuAggregateViewItem",
    templateHTML: MenuAggregateItemTmpl
})
export class MenuAggregateViewItem extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        private menuItem: MenuItemData
    ) {
        super(parent, name, templateHTML);
        this.menuItem["id"] = this.id;
    }

    public render (): void {
        this.renderTmplEl(this.menuItem);
        this.registerEvents();
        _.forEach(this.menuItem.children, (menuElem: MenuElem) => {
            let view = renderMenuElem(this.parent, menuElem);
            view.render();
            this.$el.find("#"+this.id).append(view.$el);
        });

    }

    public registerEvents (): void {}
}