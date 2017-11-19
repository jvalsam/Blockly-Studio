/**
 * MenuView - Menu View Component of the platform
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import MenuTmpl from "./templates/menu.html";
import { renderMenuElem } from "./menu-view-group-item";
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


@ComponentViewMetadata({
    name: "MenuView",
    selector: ".menu-view-area",
    templateHTML: MenuTmpl
})
export class MenuView extends ComponentView {
    private readonly itemsContainer = ".menu-items-container";

    public registerEvents (): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-menu-home-page-btn",
                handler: () => this.parent["onClickHomePage"]()
            }
        );
    }

    public render (): void {
        this.$el = $(this.template());
        this.registerEvents();
        for (let index of Object.keys(this.renderData)) {
            let view = renderMenuElem(this.parent, <MenuElem>this.renderData[index]);
            view.render();
            this.$el.find(this.itemsContainer).append(view.$el);
        }
    }
}
