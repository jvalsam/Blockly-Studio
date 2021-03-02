
/// <reference path="../../../../../../../../node.d.ts"/>
import DebuggerToolbarViewTmpl from "./debugger-toolbar-view.tmpl";
import DebuggerToolbarViewSYCSS from "./debugger-toolbar-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../component/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { ActionsView } from "../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from '../../../../component/registry';
import * as _ from "lodash";
import { BreakpointsView } from "./breakpoints/breakpoints-view";
import { DebuggerInfoView } from "./debugger-info-view/debugger-info-view";
import { DebuggerControllerView } from "./debugger-controller-view/debugger-controller-view";

@ViewMetadata({
    name: "DebuggerToolbarView",
    templateHTML: DebuggerToolbarViewTmpl,
    style: { system: DebuggerToolbarViewSYCSS }
})
export class DebuggerToolbarView extends View {
    public controller: DebuggerControllerView;
    public debuggerInfodata: DebuggerInfoView;
    public breakpoints: BreakpointsView;
    public conditionalBreakpoints: View;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private environmentData,
        private data: {
            controller: any,
            debuggerData: any,
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
        },
        private blocklyDebugger
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        //
        this.controller = <DebuggerControllerView>ViewRegistry.getEntry("DebuggerControllerView").create(
            this.parent,
            "#debugger-control-area",
            {
                collaborative: false,
                state: "RUNNING",
                available: true,
                blocklyDebugger: this.blocklyDebugger
            }
        );
        this.debuggerInfodata = <DebuggerInfoView>ViewRegistry.getEntry("DebuggerInfoView").create(
            this.parent,
            "#debugger-data-area",
            {
                // data to load
                blocklyDebugger: this.blocklyDebugger
            }
        );
        this.breakpoints = <BreakpointsView>ViewRegistry.getEntry("BreakpointsView").create(
            this.parent,
            "#breakpoints-data-area",
            {

                blocklyDebugger: this.blocklyDebugger
            }
        );
        this.conditionalBreakpoints = <BreakpointsView>ViewRegistry.getEntry("BreakpointsView").create(
            this.parent,
            "#conditional-breakpoints-data-area",
            {

                blocklyDebugger: this.blocklyDebugger
            }
        );
    }

    public registerEvents(): void {}

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl();
        this.controller.render();
        this.debuggerInfodata.render();
        this.breakpoints.render();
        this.controller.render();
    }
}
