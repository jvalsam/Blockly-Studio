
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
    private _replica: DebuggerControllerView;

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
        private blocklyDebugger: any,
        private data: {
            available: boolean,
            collaborative: boolean,
            state: "RUNNING" | "PAUSED"
        }
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        let debuggerWorker = this.blocklyDebugger.getDebuggeeWorker();
        //
        this.continueDebuggerAction = debuggerWorker.RegisterContinueDebuggerAction();
        // this.pauseDebuggerAction = debuggerWorker.RegisterContinueDebuggerAction();
        this.stopDebuggerAction = debuggerWorker.RegisterStopDebuggerAction();

        this.stepInDebuggerAction = debuggerWorker.RegisterStepInDebuggerAction();
        this.stepOverDebuggerAction = debuggerWorker.RegisterStepOverDebuggerAction();
        this.stepParentDebuggerAction = debuggerWorker.RegisterStepParentDebuggerAction();
        this.stepOutDebuggerAction = debuggerWorker.RegisterStepOutDebuggerAction();
    }

    public createReplica(selector) {
        this.data.state = "PAUSED";
        this._replica = new DebuggerControllerView(
            this.parent,
            this.name,
            this._templateHTML,
            this._styles,
            selector,
            this.blocklyDebugger,
            this.data);
        this._replica.render();
        $("#debugger-control")
            .css("box-shadow", "1px 1px 1px 1px grey");

        this.render();
    }

    public destroyReplica() {
        this.data = this._replica.data;
        this.render();
        this._replica.destroy();
    }

    public registerEvents(): void {
        let events = [
            {
                eventType: "click",
                selector: "#ContinueButton",
                handler: () => {
                    this.onContinueExecution();
                    this.continueDebuggerAction();
                }
            },
            {
                eventType: "click",
                selector: "#PauseButton",
                handler: () => {
                    alert("pause not implemented");
                }
            },
            {
                eventType: "click",
                selector: "#StopButton",
                handler: () => {
                    this.stopDebuggerAction();
                }
            },
            {
                eventType: "click",
                selector: "#StepInButton",
                handler: () => {
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

    public onContinueExecution() {
        this.data.state = "RUNNING";

        $("#ContinueButton")
            .addClass('not-enable-fa-btn')
            .removeClass('enable-fa-btn');
        $("#PauseButton")
            .addClass('enable-fa-btn')
            .removeClass('not-enable-fa-btn');
        $("#StopButton")
            .addClass('enable-fa-btn')
            .removeClass('not-enable-fa-btn');
        //
        $("#StepInButton")
            .addClass('not-enable-icon-btn')
            .removeClass('enable-icon-btn');
        $("#StepOverButton")
            .addClass('not-enable-icon-btn')
            .removeClass('enable-icon-btn');
        $("#StepParentButton")
            .addClass('not-enable-icon-btn')
            .removeClass('enable-icon-btn');
        $("#StepOutButton")
            .addClass('not-enable-icon-btn')
            .removeClass('enable-icon-btn');
        $("#ControlMasterButton")
            .addClass('not-enable-icon-btn')
            .removeClass('enable-icon-btn');
    }

    public onPauseExecution() {
        this.data.state = "PAUSED";

        $("#ContinueButton")
            .removeClass('not-enable-fa-btn')
            .addClass('enable-fa-btn');
        $("#PauseButton")
            .removeClass('enable-fa-btn')
            .addClass('not-enable-fa-btn');
        $("#StopButton")
            .removeClass('enable-fa-btn')
            .addClass('not-enable-fa-btn');
        //
        $("#StepInButton")
            .removeClass('not-enable-icon-btn')
            .addClass('enable-icon-btn');
        $("#StepOverButton")
            .removeClass('not-enable-icon-btn')
            .addClass('enable-icon-btn');
        $("#StepParentButton")
            .removeClass('not-enable-icon-btn')
            .addClass('enable-icon-btn');
        $("#StepOutButton")
            .removeClass('not-enable-icon-btn')
            .addClass('enable-icon-btn');
        $("#ControlMasterButton")
            .removeClass('not-enable-icon-btn')
            .addClass('enable-icon-btn');
    }

    public setStyle(): void {}

    public render(): void {
        this.renderTmplEl(this.data);
        if (this.data.collaborative) {
            $("#debugger-control").css('width', '295px');
        }
    }
}
