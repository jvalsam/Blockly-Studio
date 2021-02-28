import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { ComponentsCommunication } from "../../component/components-communication";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { ViewRegistry } from "../../component/registry";
import { BlocklyDebugger } from "./blockly-debugger/index";


var menuJson; // todo: define them
var configJson; // todo: define them


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
    }

    @ExportedFunction
    public start(environmentData: any, onSuccess: Function) {
        alert("start debugging process...");
        this.environmentData = environmentData;
        
        let toolbar = ViewRegistry.getEntry("DebuggerToolbarView")
            .create(
                this,
                ".debugger-toolbar-container",
                environmentData,
                {},//debuggerData
                this.blocklyDebugger
            );
        toolbar.render();
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
}
