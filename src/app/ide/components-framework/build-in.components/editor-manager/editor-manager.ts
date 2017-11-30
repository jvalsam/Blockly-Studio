import { ComponentsCommunication } from "./../../component/components-communication";
import { BlocklyVPL } from "./../../../ide-components/blockly/blockly";
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { Editor } from "./editor";
import { ComponentRegistry } from "../../component/component-entry";
import { EditorManagerView } from "./editor-manager-view";

@UIComponentMetadata({
    description: "Handles requests to open editor instances for sources",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "November 2017"
        }
    ],
    componentView: "EditorManagerView"
})
export class EditorManager extends IDEUIComponent {
    private editorInstancesMap: {[id:string]: Editor};
    private editorOnFocusId: string;
    // use it to implement browse previous editor instances viewed
    private focusEditorHistory: Array<string>;

    constructor(
        name: string,
        description: string,
        compViewName: string
    ) {
        super(name, description, compViewName);
        this.editorInstancesMap = {};
        this.editorOnFocusId = "";
    }

    @RequiredFunction("Shell", "createComponentEmptyContainer")
    @ExportedFunction
    public open(sourceId: string, editorName: string, src: string, toolbox: string/* subject to change toolbox */): void {
        if (Object.keys(this.editorInstancesMap).length === 0) {
        }

        if (!this.editorInstancesMap[sourceId]) {
            this.editorInstancesMap[sourceId] = <Editor>ComponentRegistry.getEntry(editorName).create();
            (<EditorManagerView>this.view).prepareEditorArea();
            this.editorInstancesMap[sourceId].view.selector = <string>ComponentsCommunication.functionRequest(
                this.name,
                "Shell",
                "createComponentEmptyContainer",
                [this.editorInstancesMap[sourceId], ".editors-area-container", false]
            ).value;
            (<BlocklyVPL>this.editorInstancesMap[sourceId]).open(
                src,
                toolbox,
                this.totalEditorsOpen() === 1
            );
        }

        this.editorOnFocusId = sourceId;
        (<EditorManagerView>this.view).update(this.editorInstancesMap[sourceId]);
    }

    public totalEditorsOpen(): number {
        return Object.keys(this.editorInstancesMap).length;
    }

    public getOnFocusEditor(): Editor {
        return this.editorInstancesMap[this.editorOnFocusId];
    }

    @ExportedFunction
    public OnFocusEditorId(): string {
        return this.editorInstancesMap[this.editorOnFocusId].id;
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }

    @ExportedFunction
    public registerEvents(): void {}

    @ExportedFunction
    public update(): void {}

    @ExportedFunction
    public onOpen(): void {

    }

    @ExportedFunction
    public onClose(): void {}

}
