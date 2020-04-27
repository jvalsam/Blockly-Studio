import { ViewRegistry } from "./../../component/registry";
import { DomainsManager } from "./../../../domain-manager/domains-manager";
import { ComponentsCommunication, PostsSignal } from "./../../component/components-communication";
import { BlocklyVPL } from "./../../../ide-components/blockly/blockly";
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction,
    ExportedSignal
} from "../../component/component-loader";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { Editor } from "./editor";

import { ComponentRegistry } from "../../component/component-entry";
import { EditorManagerView } from "./editor-manager-view";
import { IEventData } from "../../common-views/actions-view/actions-view";
import * as _ from "lodash";
import { View } from "../../component/view";
import { PItemView } from "./project-item/pitem-view";
import { ProjectItem } from "../project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";
import { assert } from "../../../shared/ide-error/ide-error";
import { EditorManagerToolbarView } from "./editor-manager-toolbar-view/editor-manager-toolbar-view";

enum EditorsViewState {
    NO_SPLIT = "normal",
    VERTICAL_SPLIT = "vertical",
    HORIZONTAL_SPLIT = "horizontal"
};

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
    private readonly pitemEditorsSel = ".pitem-editors-area-";
    private projectItemsMap: {[systemId:string]: PItemView};
    private focusPItemArea: number;

    private pitemOnFocusId: string;

    // use it to implement browse previous editor instances viewed
    private focusNextStackEditorID: Array<string>;
    private focusPrevStackEditorID: Array<string>;

    constructor(
        name: string,
        description: string,
        compViewName: string,
        selector: string,
        private currentViewState: EditorsViewState = EditorsViewState.NO_SPLIT,
        private initialPItemsFocused?: Array<string> // 1 or 2 pitemIds
    ) {
        super(name, description, compViewName, selector);
        this.projectItemsMap = {};
    }

    private swapPItemEditorsArea(): void {
        $(this.pitemEditorsSel+"1").eq(0).before($(this.pitemEditorsSel+"2").eq(0));
        // swap class selectors
        $(this.pitemEditorsSel + "1")
    }

    public updateSplit(newViewState: EditorsViewState): void {
        if (this.currentViewState === newViewState) {
            return;
        }
        // remove current classes style of split
        let removeClassName =
            this.pitemEditorsSel.substr(1)
            + this.currentViewState
            + "-split-";
        $(this.pitemEditorsSel + "1").removeClass(removeClassName + "1");
        $(this.pitemEditorsSel + "2").removeClass(removeClassName + "2");
        // check if new style will be no-split, to regulate the view
        if (newViewState === EditorsViewState.NO_SPLIT) {
            if (this.focusPItemArea === 2) {
                this.swapPItemEditorsArea();
            }
        }
        else {
            // look up in history if exists
        }

        // add new classes for style of split
        let addClassName =
            this.pitemEditorsSel.substr(1)
            + newViewState
            + "-split-";
        $(this.pitemEditorsSel + "1").removeClass(addClassName + "1");
        $(this.pitemEditorsSel + "2").removeClass(addClassName + "2");
    }

    @RequiredFunction("ProjectManager", "getProjectItem")
    public initializeEditorsView() {
        this.view.render();
        let className =
            this.pitemEditorsSel.substr(1)
            + this.currentViewState
            + "-split-";

        $(this.pitemEditorsSel+"1").addClass(className + "1");
        $(this.pitemEditorsSel+"2").addClass(className + "2");

        assert(
            this.initialPItemsFocused.length<=2,
            "invalid number of initial focused pitems in Editor Manager"
        );

        this.initialPItemsFocused.forEach((pitemId, index) => {
            let pitem = ComponentsCommunication.functionRequest(
                this.name,
                "ProjectManager",
                "getProjectItem",
                [pitemId]
            ).value;

            this.focusPItemArea = index + 1;
            this.open(pitem, this.focusPItemArea);
        });
    }

    public totalEditorsOpen(): number {
        return Object.keys(this.projectItemsMap).length;
    }

    // public getOnFocusEditor(): Editor {
    //     return this.projectItemsMap[this.editorOnFocusId];
    // }

    @ExportedFunction
    public OnFocusEditorId(): string {
        return this.projectItemsMap[this.pitemOnFocusId].id;
    }

    // returns where the focus of which item is
    @ExportedFunction
    public onRemoveProjectElement(delSystemID: string): string {
        if (this.projectItemsMap[delSystemID]) {
            this.projectItemsMap[delSystemID].destroy();
            delete this.projectItemsMap[delSystemID];
            if (this.pitemOnFocusId === delSystemID) {
                let prevFocusEditorID = this.focusPrevStackEditorID.pop();
                this.onChangeEditorFocus(prevFocusEditorID);
            }
            else {
                _.remove(this.focusNextStackEditorID, id => id === delSystemID);
                _.remove(this.focusPrevStackEditorID, id => id === delSystemID);
            }
        }
        return this.pitemOnFocusId;
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }

    @ExportedFunction
    public registerEvents(): void {

    }

    @ExportedFunction
    public update(): void {

    }

    @ExportedFunction
    public onOpen(): void {

    }

    @ExportedFunction
    public onClose(): void {

    }

    @ExportedFunction
    public onChangeEditorFocus(systemID): void {
        this.pitemOnFocusId = systemID;
        (<EditorManagerView>this.view).update(this.projectItemsMap[systemID]);
    }

    @ExportedFunction
    public onFocusPreviousEditor(): void {
        if (this.focusNextStackEditorID.length > 0) {
            let nextSystemID = this.focusNextStackEditorID.pop();
            this.focusPrevStackEditorID.push(this.pitemOnFocusId);
            this.onChangeEditorFocus(nextSystemID);
        }
    }

    @ExportedFunction
    public onFocusNextEditor(): void {
        if (this.focusPrevStackEditorID.length > 0) {
            let nextSystemID = this.focusPrevStackEditorID.pop();
            this.focusNextStackEditorID.push(this.pitemOnFocusId);
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

    private convertEconf(name) {
        return (name.indexOf("__") !== -1)
            ? name.substring(0, name.indexOf("__"))
            : name;
    }

    @RequiredFunction("DomainsManager", "getProjectItem")
    @ExportedFunction
    public factoryNewProjectItem(
        name: string,
        args,
        systemID: string,
        projectID: string,
        restriction?:Array<string>
    ) {
        let editorConfigs = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [name]).value.editorConfigs;

        let projectItem = {
            systemID: systemID,
            projectID: projectID,
            items: {}
        };

        for (const ec_name of Object.keys(editorConfigs)) {
            // assume only one editor is defined per mission
            let editorConfig = editorConfigs[ec_name][0];
            let response = ComponentsCommunication.functionRequest(
                this.name,
                editorConfig.name,
                "factoryNewItem",
                [
                    name,
                    this.convertEconf(ec_name),
                    args,
                    editorConfig
                ]
            );
            projectItem.items[ec_name] = _.assign(
                {},
                response.value,
                Editor.createJSONArgs(
                    editorConfig.name,
                    systemID,
                    projectID,
                    args
                ));
        }

        return projectItem;
    }

    public onSplitEditorsBtn(btn: string): void {
        alert("split " + btn);
        // this.updateSplit(EditorsViewState.)
    }

    @ExportedSignal("editor-manager-open-pitem-completed")
    @ExportedFunction
    public open(pi: ProjectItem, pitemArea?: number): void {
        let pitemData = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [pi.jstreeNode.type]
        ).value;
        // TODO: check if the project item is already open in the view
        // in case it is viewed -> just set as focus area its pitem-area

        // check if there is instance with systemID
        if (!this.projectItemsMap[pi.systemID]) {
            let econfigs = pitemData.editorConfigs;
            let editorsSel = Object.keys(econfigs);

            let selector = ".pitem-editors-area-1";
            // if (this.onFocusData) {}

            const pitemView: PItemView = <PItemView>ViewRegistry
                .getEntry("PItemView")
                .create(
                    this,
                    selector,
                    pi,
                    editorsSel,
                    pitemData.view
                );
            pitemView.render();

            let tools = ComponentsCommunication.functionRequest(
                this.name,
                "CollaborationManager",
                "pitemTools",
                [ pi.systemID ]
            ).value;
            tools.push("separator");

            for (let mission of editorsSel) {
                let sel = "pi_" + pi.systemID + "_" + mission;
                // only one editor is supported
                // if domain author give more
                // TODO: selection by the end-user... now we just choose the 1st
                let econfig = econfigs[mission][0];

                ComponentsCommunication.functionRequest(
                    this.name,
                    econfig.name,
                    "open",
                    [
                        sel,
                        pitemView,
                        this.convertEconf(mission)
                    ]
                );
                pitemView.addEditor(sel, econfig.name);
            }

            let editorTools = ComponentsCommunication.functionRequest(
                this.name,
                pitemView.getOnFocusEditor(),
                "tools",
                [pitemView.getFocusEditorId()]
            ).value;

            let toolsView = (<EditorManagerToolbarView>this._view
                .toolElems["EditorManagerToolbarView"]);
            toolsView.setPItemTools(tools.concat(editorTools));
            // request from the collaboration
            // collect from the vpl editors
            // identify which is on focus...
        }

        ComponentsCommunication.postSignal(
            this.name,
            "editor-manager-open-pitem-completed",
            [pi]
        );
    }

    @RequiredFunction("DomainsManager", "getProjectItem")
    @ExportedFunction
    public onRequestAction (event: IEventData, pi: ProjectItem): any {
        let reqAction = event.action;
        if (typeof reqAction === "string") {
            this[reqAction] (pi);
        }
        else {
            reqAction (pi);
        }
    }
}
