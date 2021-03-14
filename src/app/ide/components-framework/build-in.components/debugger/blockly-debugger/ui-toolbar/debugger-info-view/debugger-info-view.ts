
/// <reference path="../../../../../../../../../node.d.ts"/>
import DebuggerInfoViewTmpl from "./debugger-info-view.tmpl";
import DebuggerInfoViewSYCSS from "./debugger-info-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import * as _ from "lodash";

@ViewMetadata({
    name: "DebuggerInfoView",
    templateHTML: DebuggerInfoViewTmpl,
    style: { system: DebuggerInfoViewSYCSS }
})
export class DebuggerInfoView extends View {
    // variables data
    private envTree: any;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private info: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    public registerEvents(): void {}

    public setStyle(): void {}

    public setEnvironmentData(envTree) {
        this.envTree = envTree;
        this.render();
    }

    public render(): void {
        this.renderTmplEl();
        //TODO: create new elements for the tabs view
    }
}
