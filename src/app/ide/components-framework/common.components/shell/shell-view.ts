/// <reference path="../../../../../../node.d.ts"/>
import ShellTmpl from "./shell.tmpl";
import { ComponentView, ComponentViewMetadata } from "../../component/component-view";
import ShellSYCSS from "./shell.sycss";
import * as _ from "lodash";


@ComponentViewMetadata({
    name: "ShellView",
    //selector: ".ide-container",
    templateHTML: ShellTmpl,
    style: {
        system: ShellSYCSS
    }
})
export class ShellView extends ComponentView {

    public render(): void {
        this.renderTmplEl();
    }

    public show(): void {
        $(this.selector).empty();
        $(this.selector).append(this.$el);
    }
}
