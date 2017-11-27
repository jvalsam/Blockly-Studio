
/// <reference path="../../../../../../node.d.ts"/>
import ShellTmpl from "./shell.html";
import { ComponentView, ComponentViewMetadata } from "../../component/component-view";
import * as _ from "lodash";


@ComponentViewMetadata({
    name: "ShellView",
    selector: ".ide-container",
    templateHTML: ShellTmpl
})
export class ShellView extends ComponentView {

    public render(): void {
        this.$el = $(this.template());
    }

    public show(): void {
        $(this.selector).empty();
        $(this.selector).append(this.$el);
    }
}
