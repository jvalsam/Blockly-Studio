import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { ComponentsCommunication } from "../../component/components-communication";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { ViewRegistry } from "../../component/registry";
import { BlocklyDebugger } from "./blockly-debugger/index";
import { DisableBreakpoint, EnableBreakpoint } from "./blockly-debugger/src/debugger/actions/breakpoints";
import { AddBreakpoint, RemoveBreakpoint } from "./blockly-debugger/src/generator/blockly/core/block_svg";
import { BreakpointInfo } from "./blockly-debugger/ui-toolbar/breakpoints/breakpoint-item/breakpoint-view-box";
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
        this.breakpointNO = 0;
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
                {
                    breakpoints: this.breakpoints
                },//debuggerData
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
    private breakpointNO: number;
    private breakpoints: Array<BreakpointInfo>;

    @ExportedFunction
    public addBreakpoint(breakpoint, src: "REMOTE" | "EDITOR") {
        let breakpointInfo: BreakpointInfo = null;
        
        if (src === "REMOTE") {
            breakpointInfo = breakpoint;
            
            // sync blockly editor view with breakpoint
            let block = ComponentsCommunication.functionRequest(
                this.name,
                "BlocklyVPL",
                "getBlock",
                [
                    breakpoint.elemId,
                    breakpoint.editorId
                ]
            );
            AddBreakpoint(block, true);
        }
        else {
            let pitem = breakpoint.workspace.pitem._jstreeNode;

            breakpointInfo = {
                id: this.breakpointNO++,
                elemId: breakpoint.id,
                editorId: breakpoint.workspace.editorId,
                pelem: {
                    id: pitem.id,
                    text: pitem.text,
                    icon: pitem.icon,
                    color: pitem.color
                },
                isEnabled: true
            };

            // TODO: collaborative debugging message

        }

        this.breakpoints.push(breakpointInfo);

        if (this.toolbar) {
            this.toolbar.breakpoints.addBreakpoint(breakpoint);
        }
    }

    @RequiredFunction("BlocklyVPL", "getBlock")

    @ExportedFunction
    public removeBreakpoint(blockId: string, src: BreakpointSRC) {
        let breakpointIndex = this.breakpoints
            .findIndex(breakpoint => breakpoint.elemId === blockId);
        let breakpoint = this.breakpoints[breakpointIndex];
        let block = ComponentsCommunication.functionRequest(
            this.name,
            "BlocklyVPL",
            "getBlock",
            [
                blockId,
                breakpoint.editorId
            ]
        );

        switch (src) {
            case "REMOTE":
                RemoveBreakpoint(block, true);
                
                if (this.toolbar) {
                    this.toolbar.breakpoints.removeBreakpoint(blockId);
                }

                this.breakpoints.splice(breakpointIndex, 1);
                break;
            case "EDITOR":
                if (this.toolbar) {
                    this.toolbar.breakpoints.removeBreakpoint(blockId);
                }
                this.breakpoints.splice(breakpointIndex, 1);

                // TODO: collaborative debugging message

                break;
            case "TOOLBAR":
                RemoveBreakpoint(block, true);
                this.breakpoints.splice(breakpointIndex, 1);

                // TODO: collaborative debugging message

                break;
            default:
                throw new Error("Not supported source requested action in debugger!");
        }
    }

    @ExportedFunction
    public enableBreakpoint(blockId: string, src: BreakpointSRC) {
        let breakpoint = this.breakpoints.find(breakpoint => breakpoint.elemId === blockId);
        breakpoint.isEnabled = true;

        let block = ComponentsCommunication.functionRequest(
            this.name,
            "BlocklyVPL",
            "getBlock",
            [
                blockId,
                breakpoint.editorId
            ]
        );

        switch (src) {
            case "REMOTE":
                EnableBreakpoint(block, true);
                
                if (this.toolbar) {
                    this.toolbar.breakpoints.enableBreakpoint(blockId);
                }

                break;
            case "EDITOR":
                // sync toolbar
                if (this.toolbar) {
                    this.toolbar.breakpoints.enableBreakpoint(blockId);
                }

                // TODO: collaborative debugging message

                break;
            case "TOOLBAR":
                // sync editor
                EnableBreakpoint(block, true);

                // TODO: collaborative debugging message

                break;
            default:
                throw new Error("Not supported source requested action in debugger!");
        }
    }

    @ExportedFunction
    public disableBreakpoint(blockId: string, src: BreakpointSRC) {
        let breakpoint = this.breakpoints.find(breakpoint => breakpoint.elemId === blockId);
        breakpoint.isEnabled = false;

        let block = ComponentsCommunication.functionRequest(
            this.name,
            "BlocklyVPL",
            "getBlock",
            [
                blockId,
                breakpoint.editorId
            ]
        );

        switch (src) {
            case "REMOTE":
                DisableBreakpoint(block, true);
                
                if (this.toolbar) {
                    this.toolbar.breakpoints.disableBreakpoint(blockId);
                }

                break;
            case "EDITOR":
                // sync toolbar
                if (this.toolbar) {
                    this.toolbar.breakpoints.disableBreakpoint(blockId);
                }

                // TODO: collaborative debugging message

                break;
            case "TOOLBAR":
                // sync editor
                DisableBreakpoint(block, true);

                // TODO: collaborative debugging message

                break;
            default:
                throw new Error("Not supported source requested action in debugger!");
        }
    }
}
