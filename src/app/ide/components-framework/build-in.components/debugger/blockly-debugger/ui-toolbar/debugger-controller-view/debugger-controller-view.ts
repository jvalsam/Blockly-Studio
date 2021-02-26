
/// <reference path="../../../../../../../../../node.d.ts"/>
import DebuggerToolbarViewTmpl from "./debugger-controller-view.tmpl";
import DebuggerToolbarViewSYCSS from "./debugger-controller-view.sycss";
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
        let events = [
            {
                eventType: "click",
                selector: "#ContinueButton",
                handler: () => {
                    alert("continue");
                }
            },
            {
                eventType: "click",
                selector: "#PauseButton",
                handler: () => {
                    alert("pause");
                }
            },
            {
                eventType: "click",
                selector: "#StopButton",
                handler: () => {
                    alert("stop");
                }
            },
            {
                eventType: "click",
                selector: "#StepInButton",
                handler: () => {
                    alert("step in");
                }
            },
            {
                eventType: "click",
                selector: "#StepOverButton",
                handler: () => {
                    
                }
            },
            {
                eventType: "click",
                selector: "#StepParentButton",
                handler: () => {}
            },
            {
                eventType: "click",
                selector: "#StepOutButton",
                handler: () => {}
            }
        ];
        if (this.data.collaborative) {
            events.push({
                eventType: "click",
                selector: "#ControlMasterButton",
                handler: () => {}
            });
        }

        this.attachEvents(...events);
    }

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.data);
        if (this.data.collaborative) {
            $("#debugger-control").css('width', '295px');
        }
    }
}
