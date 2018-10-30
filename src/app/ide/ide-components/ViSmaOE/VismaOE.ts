import { Editor } from "../../components-framework/build-in.components/editor-manager/editor";
import {
    ExportedSignal,
    ExportedFunction,
    RequiredFunction,
    ListensSignal,
    PlatformEditorMetadata,
    ExportedStaticFunction
} from "../../components-framework/component/component-loader";
import suim from "../../../../../libs/SUIM/suim.js";

var menuJson: any = require("./conf_menu.json");
var confJson: any = require("./conf_props.json");

@PlatformEditorMetadata({
    description: "VPL handling Smart Objects",
    authors: [
      {
        name: "Marios Ntoulas",
        email: "ntoulasm@ics.forth.gr",
        date: "October 2018"
      }
    ],
    missions: [
        "CreateSmartObject",
        "CreateSmartEnvironment",
        "ViewAllSmartObjects",
        "ViewSmartEnvironment",
        "EditEnvironment",
        "ViewSmartObject",
        "EditSmartObject"
    ],
    componentView: "ViSmaOEView",
    menuDef: menuJson,
    configDef: confJson,
    version: "1.0"
})
export class ViSmaOE extends Editor {
    @ExportedFunction
    public onOpen(): void {}

    @RequiredFunction("Shell", "addTools")
    @ExportedFunction
    public open(src: string, toolbox?: string, isFirstInst:boolean =false): void {
        this._view.setRenderData({});
    }

    @ExportedFunction
    public onClose(): void {
    }

    public undo(): void {

    }
    public redo(): void {

    }

    public copy(): void {

    }

    public paste(): void {

    }

    public registerEvents(): void {

    }

    public update(): void {

    }

    public destroy(): void {

    }

    @ExportedStaticFunction
    public static CreateSmartObject(): string {
        return "{ 'SmartObjectElems': 'TODO create' }";
    }

    @ExportedStaticFunction
    public static CreateSmartEnvironment(): string {
        return "{ 'SmartEnvironmentElems': 'TODO create' }";
    }

    @ExportedFunction
    public ViewAllSmartObjects() {

    }

    @ExportedFunction
    public ViewSmartEnvironment() {

    }
    
    @ExportedFunction
    public EditEnvironment() {

    }

    @ExportedFunction
    public ViewSmartObject() {

    }

    @ExportedFunction
    public EditSmartObject() {

    }

    @ExportedFunction
    public onChangeConfig(values: any): void {
        alert("on change config data not developed yet in ViSmaOE Component");
    }
}