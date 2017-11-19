
/// <reference path="../../../../../../node.d.ts"/>
import ShellTmpl from "./shell.html";
import MenuGroupItemsTmpl from "./menu-templates/menu-group-items.html";
import MenuItemTmpl from "./menu-templates/menu-item.html";
import {
    ComponentView,
    ComponentViewElement,
    ComponentViewElementMetadata,
    ComponentViewMetadata,
} from "../../component/component-view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { View, ViewMetadata, ViewRegistry } from "../../view/view";
import * as _ from "lodash";


@ComponentViewMetadata({
    name: "ShellView",
    selector: ".ide-container",
    templateHTML: ShellTmpl
})
export class ShellView extends ComponentView {

    public render() {
        this.$el.html(this.template());
    }

    public show() {
        $(this.selector).empty();
        $(this.selector).append(this.$el);
    }
}
