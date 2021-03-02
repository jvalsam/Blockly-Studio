
/// <reference path="../../../../../../../../../../node.d.ts"/>
import BreakpointViewBoxTmpl from "./breakpoint-view-box.tmpl";
import BreakpointViewSYCSS from "./breakpoint-view-box.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../../../component/view";
import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { ActionsView } from "../../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from '../../../../../../component/registry';
import * as _ from "lodash";



export interface BreakpointInfo {
    id: number;
    editorId: string;
    elemId: string;
    pelem: {
        id: string,
        text: string,
        icon: string,
        color: string
    },
    isEnabled: boolean
};

export interface ConditionalBreakpoint {
    
}

@ViewMetadata({
    name: "BreakpointViewBox",
    templateHTML: BreakpointViewBoxTmpl,
    style: { system: BreakpointViewSYCSS }
})
export class BreakpointViewBox extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private visualDebugger: any,
        private breakpoint: BreakpointInfo
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: "#DeleteButton-"+this.id,
                handler: (evt) => {
                    alert("delete breakpoint");
                }
            },
            {
                eventType: "change",
                selector: "#breakpointHandler-"+this.id,
                handler: (evt) => {
                    if ($("#breakpointHandler-"+this.id).prop('checked') ? 'checked' : 'unchecked') {

                    }
                }
            }
        );
    }

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.breakpoint);
    }
}
