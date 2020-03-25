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
import { IEventData } from "../../common-views/actions-view/actions-view";
import * as _ from "lodash";
import { assert } from './../../../shared/ide-error/ide-error';

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
    private editorInstancesMap: {[systemId:string]: Editor};
    private editorOnFocusId: string;
    
    // use it to implement browse previous editor instances viewed
    private focusNextStackEditorID: Array<string>;
    private focusPrevStackEditorID: Array<string>;

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
            this.editorInstancesMap[sourceId].view.selector =
                <string>ComponentsCommunication.functionRequest(
                    this.name,
                    "Shell",
                    "createComponentEmptyContainer",
                    [
                        this.editorInstancesMap[sourceId],
                        ".editors-area-container",
                        false
                    ]
                )
                .value;
            (<BlocklyVPL>this.editorInstancesMap[sourceId]).open(
                <any>src,
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

    // returns where the focus of which item is
    @ExportedFunction
    public onRemoveProjectElement(delSystemID: string): string {
        if (this.editorInstancesMap[delSystemID]) {
            this.editorInstancesMap[delSystemID].destroy();
            delete this.editorInstancesMap[delSystemID];
            if (this.editorOnFocusId === delSystemID) {
                let prevFocusEditorID = this.focusPrevStackEditorID.pop();
                this.onChangeEditorFocus(prevFocusEditorID);
            }
            else {
                _.remove(this.focusNextStackEditorID, id => id === delSystemID);
                _.remove(this.focusPrevStackEditorID, id => id === delSystemID);
            }
        }
        return this.editorOnFocusId;
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
    public onChangeEditorFocus(systemID): void {
        this.editorOnFocusId = systemID;
        (<EditorManagerView>this.view).update(this.editorInstancesMap[systemID]);
    }

    @ExportedFunction
    public onFocusPreviousEditor(): void {
        if (this.focusNextStackEditorID.length > 0) {
            let nextSystemID = this.focusNextStackEditorID.pop();
            this.focusPrevStackEditorID.push(this.editorOnFocusId);
            this.onChangeEditorFocus(nextSystemID);
        }
    }

    @ExportedFunction
    public onFocusNextEditor(): void {
        if (this.focusPrevStackEditorID.length > 0) {
            let nextSystemID = this.focusPrevStackEditorID.pop();
            this.focusNextStackEditorID.push(this.editorOnFocusId);
            this.onChangeEditorFocus(nextSystemID);
        }
    }

    @ExportedFunction
    public onRenameProjectElement(data: any, systemID: string, callback: Function) {
        alert( "Editor Manager is notified for rename action...\n" + JSON.stringify(data) );
        // TODO: editor if is open instance has to be notified...
        // Maybe open tabs if exist has to be renamed...

        callback (true);
    }

    @ExportedFunction
    public factoryNewElement(mission: string, args, systemID: string, projectID: string, restriction?:Array<string>) {
        let editors = EditorDataHolder.getEditors(mission);
        if (editors.length === 1) {
            let response = ComponentsCommunication.functionRequest(
                this.name,
                editors[0],
                mission,
                args
            );
            response.value = _.assign({}, response.value, Editor.createJSONArgs(editors[0], systemID, projectID, args));
            return response.value;
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
    public onRequestEditorAction (event: IEventData, itemData: any) {
        let editorName = itemData.systemID.split("_")[0];
        assert(editorName, "Invalid systemID exists on the item "+itemData);
        // check if there is instance with systemID
        if (!this.editorInstancesMap[itemData.systemID]) {
            // already pinned editor, later may convert to be able to pin to other editors
            this.editorInstancesMap[itemData.systemID] = <Editor>
                ComponentRegistry
                    .getEntry(editorName)
                    .create([".project-manager-visual-editors-area"]);
            //editable and setted only by the editor manager
            this.editorInstancesMap[itemData.systemID]
                ["_systemID"] = itemData.systemID;
            (<EditorManagerView>this.view).prepareEditorArea();
            let resp = this.editorInstancesMap
                [itemData.systemID]
                [event.data.mission] (itemData.editorData);
            return resp;
        }

        this.onChangeEditorFocus(itemData.systemID);
    }
}
