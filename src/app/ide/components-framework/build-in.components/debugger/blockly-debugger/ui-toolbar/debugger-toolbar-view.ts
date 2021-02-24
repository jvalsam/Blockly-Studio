
/// <reference path="../../../../../../../../node.d.ts"/>
import DebuggerToolbarViewTmpl from "./debugger-toolbar-view.tmpl";
import DebuggerToolbarViewSYCSS from "./debugger-toolbar-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../component/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { ActionsView } from "../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from '../../../../component/registry';
import * as _ from "lodash";

@ViewMetadata({
    name: "DebuggerToolbarView",
    templateHTML: DebuggerToolbarViewTmpl,
    style: { system: DebuggerToolbarViewSYCSS }
})
export class DebuggerToolbarView extends View {
    private controller;
    private debuggerData: View;
    private breakpoints: View;
    private conditionalBreakpoints: View;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private data: {
            
            breakpoints: Array<{
                pelem: { label: string, icon: string, color: string },
                vplElem: { id: string, orderNO },
                id: string
            }>,
            conditionalBreakpoints: Array<{
                pelem: { label: string, icon: string, color: string },
                vplElem: { id: string, info: any }, /* info includes the data of conditional breakpoint */
                id: string
            }>
        }
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    public registerEvents(): void {}

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl();
        this.controller = ViewRegistry.getEntry("DebuggerControllerView").create(
            this.parent,
            "#debugger-control-area",
            {} /* state of the debugger, usefull to build it in case of collaborative */
        );
        this.debuggerData = ViewRegistry.getEntry("DebuggerDataView").create(
            this.parent,
            "#debugger-data-area",
            {}
        );
        this.breakpoints = ViewRegistry.getEntry("BreakpointsView").create(
            this.parent,
            "#breakpoints-data-area",
            {}
        );
        this.conditionalBreakpoints = ViewRegistry.getEntry("BreakpointsView").create(
            this.parent,
            "#conditional-breakpoints-data-area",
            {}
        );
    }
}
