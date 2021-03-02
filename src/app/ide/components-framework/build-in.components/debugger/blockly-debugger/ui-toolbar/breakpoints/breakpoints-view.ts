
/// <reference path="../../../../../../../../../node.d.ts"/>
import BreakpointsViewTmpl from "./breakpoints-view.tmpl";
import BreakpointsViewSYCSS from "./breakpoints-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from '../../../../../component/registry';
import * as _ from "lodash";
import { BreakpointInfo } from "./breakpoint-item/breakpoint-view-box";


@ViewMetadata({
    name: "BreakpointsView",
    templateHTML: BreakpointsViewTmpl,
    style: { system: BreakpointsViewSYCSS }
})
export class BreakpointsView extends View {
    private breakpoints: Array<BreakpointInfo>;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private blocklyDebugger: any,
        _breakpoints: Array<BreakpointInfo>
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.breakpoints = JSON.parse(JSON.stringify(_breakpoints));
    }

    public addBreakpoint(breakpoint: BreakpointInfo) {
        this.breakpoints.push(breakpoint);
        this.render();
    }

    public removeBreakpoint(blockId: string) {
        let index = this.breakpoints.findIndex(breakpoint => breakpoint.elemId === blockId);
        this.breakpoints.splice(index, 1);
        this.render();
    }

    public enableBreakpoint(blockId: string) {
        this.breakpoints.find(breakpoint => breakpoint.elemId === blockId).isEnabled = true;
        this.render();
    }

    public disableBreakpoint(blockId: string) {
        this.breakpoints.find(breakpoint => breakpoint.elemId === blockId).isEnabled = false;
        this.render();
    }

    public registerEvents(): void {}

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl({value: this.id});
        if (this.breakpoints.length > 0) {
            _.forEach(this.breakpoints, (breakpoint) => {
                const breakpointsViewBox: View = ViewRegistry.getEntry("BreakpointViewBox")
                    .create(
                        this.parent,
                        "#breakpoints"+this.id,
                        this.blocklyDebugger,
                        breakpoint);
                breakpointsViewBox.clearSelectorArea = false;
                breakpointsViewBox.render();
            });
        }
        else {
            this.$el.find(".breakpoints-list").empty();
            this.$el.find(".breakpoints-list").append('<div class="no-breakpoints">There are no breakpoints added.</div>');
        }
    }
}

