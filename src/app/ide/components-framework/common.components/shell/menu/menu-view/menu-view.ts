import MenuTmpl from "./templates/menu.tmpl";
import { renderMenuElem } from "./menu-aggregate-view-item";
import { MenuElem } from "../menu";
import {
    ComponentView,
    ComponentViewMetadata
} from "../../../../component/component-view";


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
        this.renderTmplEl({
            home_img: document["localPath"]
                ? document["localPath"] + "/images/blocks.png"
                : "../../../../../../../../../images/blocks.png"
        });
        for (let index of Object.keys(this.renderData)) {
            let view = renderMenuElem(this.parent, this.itemsContainer, <MenuElem>this.renderData[index]);
            view.render();
        }
    }
}
