import MenuTmpl from "./templates/menu.html";
import { renderMenuElem } from "./menu-aggregate-view-item";
import { MenuElem } from "../menu";
import { ComponentView, ComponentViewMetadata } from "../../../../component/component-view";
import * as _ from "lodash";


@ComponentViewMetadata({
    name: "MenuView",
    //selector: ".menu-view-area",
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
        this.renderTmplEl();
        this.registerEvents();
        for (let index of Object.keys(this.renderData)) {
            let view = renderMenuElem(this.parent, <MenuElem>this.renderData[index]);
            view.render();
            this.$el.find(this.itemsContainer).append(view.$el);
        }
    }
}
