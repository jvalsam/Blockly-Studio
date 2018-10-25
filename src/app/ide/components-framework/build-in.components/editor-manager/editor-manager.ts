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
import { IDEError } from "../../../shared/ide-error/ide-error";
import { EditorDataHolder } from "../../holders";

@UIComponentMetadata({
    description: "Handles requests to open editor instances for sources",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "November 2017"
        }
    ],
    componentView: "EditorManagerView",
    isUnique: true
})
export class EditorManager extends IDEUIComponent {
    private loadedEditors: { [systemID: string]: Editor };
    private editorInstancesMap: {[id:string]: Editor};
    private editorOnFocusId: string;
    // use it to implement browse previous editor instances viewed
    private focusEditorHistory: Array<string>;

    constructor(
        name: string,
        description: string,
        compViewName: string,
        selector: string
    ) {
        super(name, description, compViewName, selector);
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

    @ExportedFunction
    public factoryNewElement(mission: string, args, projID: string, restriction?:Array<string>) {
        let editors = EditorDataHolder.getEditors(mission);
        if (editors.length === 1) {
            let response = ComponentsCommunication.functionRequest(
                this.name,
                editors[0],
                mission,
                args
            );
            let value = response.value;
            value.systemID = editors[0] + projID;
        }
        else {
            // TODO:    view restrictions, user choice, domain choice etc, if there are more than one in filter then
            //          create dialogues to choose which will be the editor
            IDEError.raise (
                "Multiple Visual Editors",
                "There are more than one editors are able to handle mission "+mission+". This is not supported by the platform yet.",
                "Editor Manager"
            );
        }
    }

    @ExportedFunction
    public missionDispatcher(data: { action, mission }, args) {
        alert("Mission Dispatcher of Editor Manager is not supported yet!");
        let responsibleEditors = EditorDataHolder.getEditors(data.mission);
        // TODO: add functionality for the filtering of which visual editor will give the respective
        if (this[data.action]) {
            this[data.action] (data, args);
        }
        else {

        }

        // there is no instance of editor, how can request for functionality


        // 1st check if thre is instance in the map of instances
        // check if it is in open/view mode
        // if yes then just update view

        // find which editor and decide if there are more

        // check if action is static
        // if yes call
        // else
        // create new instance then call

        // TODO: thing for interactions of rules for a project
        // interested catch up signals could work only with instances of the elements
        
    }

}
