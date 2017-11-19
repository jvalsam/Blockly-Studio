/**
 * MenuGroupViewItem
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import MenuGroupItemsTmpl from "./templates/menu-group-items.html";
import { MenuViewItem } from "./menu-view-item";
import {
    MenuItemLeafData,
    MenuItemData,
    MenuItem,
    MenuElem,
    MenuItemLeaf,
    isMenuItemLeaf
} from "../menu";
import { View, ViewMetadata, ViewRegistry } from "../../../../view/view";
import {
    ComponentView,
    ComponentViewElement,
    ComponentViewElementMetadata,
    ComponentViewMetadata,
} from "../../../../component/component-view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";

import * as _ from "lodash";


export function renderMenuElem(parent: IDEUIComponent, menuElem: MenuElem): MenuViewItem | MenuGroupViewItem {
    let viewItem: MenuViewItem | MenuGroupViewItem;
    if (isMenuItemLeaf(menuElem)) {
        viewItem = <MenuViewItem>ViewRegistry.getEntry("MenuViewItem").create(parent, <MenuItemLeafData>(menuElem.data));
    }
    else {
        viewItem = <MenuGroupViewItem>ViewRegistry.getEntry("MenuGroupViewItem").create(parent, <MenuItemData>(menuElem.data));
    }
    return viewItem;
}


@ViewMetadata({
    name: "MenuGroupViewItem",
    templateHTML: MenuGroupItemsTmpl
})
export class MenuGroupViewItem extends View {
    private readonly itemsGroupContainer = ".menu-group-items-container";
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        private menuItem: MenuItem
    ) {
        super(parent, name, templateHTML);
    }

    public render (): void {
        this.$el.html(this.template(this.menuItem.data));
        this.registerEvents();
        _.forEach(this.menuItem.data.children, (menuElem: MenuElem) => {
            let view = renderMenuElem(this.parent, menuElem);
            view.render();
            this.$el.find(this.itemsGroupContainer).append(view.$el);
        });
    }

    public registerEvents (): void {

    }
}