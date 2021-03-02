import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { ComponentsCommunication } from "../../component/components-communication";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { ViewRegistry } from "../../component/registry";
import { BlocklyDebugger } from "./blockly-debugger/index";
import { DebuggerToolbarView } from "./blockly-debugger/ui-toolbar/debugger-toolbar-view";


var menuJson; // todo: define them
var configJson; // todo: define them

type BreakpointSRC = "REMOTE" | "EDITOR" | "TOOLBAR";

@UIComponentMetadata({
    description: "Debugger of the Blockly Studio",
    authors: [
    ],
    componentView: "DebuggerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class Debugger extends IDEUIComponent {
    private environmentData: any;
    private blocklyDebugger: BlocklyDebugger;
    private toolbar: DebuggerToolbarView;

    private postMessage(msg, callback?: Function) {
        ComponentsCommunication.functionRequest(
            this.name,
            "RuntimeManager",
            "functionRequest",
            [
                this.name,
                "RuntimeEnvironmentDebug",
                "receiveFrontendMessage",
                msg,
                callback
            ]
        );
    }

    @ExportedFunction
    public frontendReceiveMessage(msg, callback?: Function) {
        this.blocklyDebugger.onmessage(msg, callback);
    }

    @ExportedFunction
    public initiate() {
        this.blocklyDebugger = new BlocklyDebugger(this);
        
        this.breakpoints = [];
    }

    @ExportedFunction
    public start(environmentData: any, onSuccess: Function) {
        alert("start debugging process...");
        this.environmentData = environmentData;
        
        this.toolbar = <DebuggerToolbarView>ViewRegistry.getEntry("DebuggerToolbarView")
            .create(
                this,
                ".debugger-toolbar-container",
                environmentData,
                {},//debuggerData
                this.blocklyDebugger
            );
        this.toolbar.render();
    }

    @RequiredFunction("BlocklyVPL", "getAllBlocklyWSPs")
    private getAllBlocklyWSPs() {
        return ComponentsCommunication.functionRequest(
            this.name,
            "BlocklyVPL",
            "getAllBlocklyWSPs",
            []
        ).value;
    }

    private getEnvironmentData(): any {
        return this.environmentData;
    }

    private stop() {
        alert("stop debugging process...");
    }

    public registerEvents(): void {
        throw new Error("Method not implemented.");
    }
    public update(): void {
        throw new Error("Method not implemented.");
    }
    public onOpen(): void {
        throw new Error("Method not implemented.");
    }
    public onClose(): void {
        throw new Error("Method not implemented.");
    }
    public destroy(): void {
        throw new Error("Method not implemented.");
    }

    // handling breakpoints

    private breakpoints: Array<any>;

    @ExportedFunction
    public addBreakpoint(breakpoint, src: "REMOTE" | "EDITOR") {
        if (src === "REMOTE") {
            this.breakpoints.push(breakpoint);
            // TODO: send through collaborative debugging component
        }
        else {
            let breakpointInfo = {};
            // retrive project element names etc.
            this.breakpoints.push(breakpointInfo);

            // TODO: check to send the breakpoint information to collaborative debugging
        }

        this.toolbar.breakpoints.addBreakpoint(breakpoint);
    }

    @ExportedFunction
    public removeBreakpoint(blockId: string, src: BreakpointSRC) {
        
    }

    @ExportedFunction
    public enableBreakpoint(blocklyId: string, src: BreakpointSRC) {

    }

    @ExportedFunction
    public disableBreakpoint(blocklyId: string, src: BreakpointSRC) {

    }
}
