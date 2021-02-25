
/// <reference path="../../../../../../../../../node.d.ts"/>
import DebuggerToolbarViewTmpl from "./debugger-toolbar-view.tmpl";
import DebuggerToolbarViewSYCSS from "./debugger-toolbar-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from '../../../../../component/registry';
import * as _ from "lodash";

@ViewMetadata({
    name: "DebuggerControllerView",
    templateHTML: DebuggerToolbarViewTmpl,
    style: { system: DebuggerToolbarViewSYCSS }
})
export class DebuggerControllerView extends View {

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private data: {
            available: boolean,
            collaborative: boolean,
            state: "RUNNING" | "PAUSED"
        }
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    public registerEvents(): void {
        this.attachEvents(
            // TODO
        );
    }

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl();
    }
}
