import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from "../../component/ide-ui-component";


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

    private start() {
        // render UI for the toolbars (IDE and sidebar)
        alert("start debugging process...");
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
