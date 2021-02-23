
/// <reference path="../../../../../../../../../node.d.ts"/>
import BreakpointsViewTmpl from "./breakpoints-view.tmpl";
import BreakpointsViewSYCSS from "./breakpoints-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from '../../../../../component/registry';
import * as _ from "lodash";

@ViewMetadata({
    name: "BreakpointsView",
    templateHTML: BreakpointsViewTmpl,
    style: { system: BreakpointsViewSYCSS }
})
export class BreakpointsView extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private breakpoints: Array<{
                pelem: { label: string, icon: string, color: string },
                vplElem: { id: string },
                id: string
            }>
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    public registerEvents(): void {}

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl();
        if (this.breakpoints.length > 0) {
            _.forEach(this.breakpoints, (breakpoint) => {
                const breakpointsViewBox: View = ViewRegistry.getEntry("BreakpointViewBox")
                    .create(this.parent, "#"+this.id, breakpoint);
                breakpointsViewBox.clearSelectorArea = false;
                breakpointsViewBox.render();
            });
        }
        else {
            $("#"+this.id).empty();
            $("#"+this.id).append('<div class="no-breakpoints">There are no breakpoints added.</div>');
        }
    }
}

