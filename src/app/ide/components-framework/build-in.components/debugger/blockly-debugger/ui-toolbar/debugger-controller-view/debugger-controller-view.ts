
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
    private continueDebuggerAction: Function;
    private pauseDebuggerAction: Function;
    private stopDebuggerAction: Function;
    private stepInDebuggerAction: Function;
    private stepOverDebuggerAction: Function;
    private stepParentDebuggerAction: Function;
    private stepOutDebuggerAction: Function;
    
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private data: {
            available: boolean,
            collaborative: boolean,
            state: "RUNNING" | "PAUSED",
            blocklyDebugger: any
        }
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        let debuggerWorker = this.data.blocklyDebugger.getDebuggeeWorker();
        //
        this.continueDebuggerAction = debuggerWorker.RegisterContinueDebuggerAction();
        // this.pauseDebuggerAction = debuggerWorker.RegisterContinueDebuggerAction();
        this.stopDebuggerAction = debuggerWorker.RegisterStopDebuggerAction();

        this.stepInDebuggerAction = debuggerWorker.RegisterStepInDebuggerAction();
        this.stepOverDebuggerAction = debuggerWorker.RegisterStepOverDebuggerAction();
        this.stepParentDebuggerAction = debuggerWorker.RegisterStepParentDebuggerAction();
        this.stepOutDebuggerAction = debuggerWorker.RegisterStepOutDebuggerAction();
    }

    public registerEvents(): void {
        let events = [
            {
                eventType: "click",
                selector: "#ContinueButton",
                handler: () => {
                    alert("continue");
                    this.continueDebuggerAction();
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

                    this.stopDebuggerAction();
                }
            },
            {
                eventType: "click",
                selector: "#StepInButton",
                handler: () => {
                    alert("step in");

                    this.stepInDebuggerAction();
                }
            },
            {
                eventType: "click",
                selector: "#StepOverButton",
                handler: () => {
                    
                    this.stepOverDebuggerAction();
                }
            },
            {
                eventType: "click",
                selector: "#StepParentButton",
                handler: () => {

                    this.stepParentDebuggerAction();
                }
            },
            {
                eventType: "click",
                selector: "#StepOutButton",
                handler: () => {

                    this.stepOutDebuggerAction();
                }
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
