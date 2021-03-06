import { ViewRegistry } from "./../../component/registry";
import {
    ComponentsCommunication,
    PostsSignal
} from "./../../component/components-communication";
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

    // two enties: index is the location and value is the pitemID
    private pitemOnFocusIds: Array<string>;
    private onFocusLocation: number;

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
        this.initData();
    }

    public initData() {
        this.projectItemsMap = {};
        this.pitemOnFocusIds = [];
        this.focusPrevStackEditorID = [];
        this.focusNextStackEditorID = [];
        this.onFocusLocation = 0;
    }

    private focusPItemArea(): number {
        return this.onFocusLocation + 1;
    }

    private locationOfPItemArea (pitemArea: number): number {
        return pitemArea - 1;
    }

    private swapPItemEditorsArea(): void {
        $(this.pitemEditorsSel+"1").eq(0)
            .before($(this.pitemEditorsSel+"2").eq(0));
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
            if (this.focusPItemArea() === 2) {
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
    public initializeEditorsView(firstPItem) {
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

        if (this.initialPItemsFocused.length > 0) {
            this.initialPItemsFocused.forEach((pitemId, index) => {
                let pitem = ComponentsCommunication.functionRequest(
                    this.name,
                    "ProjectManager",
                    "getProjectItem",
                    [pitemId]
                ).value;

                this.onFocusLocation = index;
                this.open(pitem, this.focusPItemArea());
            });
        }
        else {
            if (firstPItem) {
                let pitem = ComponentsCommunication.functionRequest(
                    this.name,
                    "ProjectManager",
                    "getProjectItem",
                    [firstPItem.systemID]
                ).value;

                this.open(pitem);
            }
        }
    }

    public loadEditorInstances(project, pitems: Array<ProjectItem>) {
        project.projectItems.forEach(pitem => {
            let pitemInst = pitems.find(x => x["_jstreeNode"].id === pitem.id);
            let editorItems = pitem.editorsData.items;
            for(const key in editorItems) {
                ComponentsCommunication.functionRequest(
                    this.name,
                    editorItems[key].editorName,
                    "loadSource",
                    [editorItems[key], pitemInst]
                );
            }
        });
    }

    public totalEditorsOpen(): number {
        return Object.keys(this.projectItemsMap).length;
    }

    // public getOnFocusEditor(): Editor {
    //     return this.projectItemsMap[this.editorOnFocusId];
    // }

    @ExportedFunction
    public OnFocusEditorId(location: number=0): string {
        return this.projectItemsMap[
            this.pitemOnFocusIds[
                location
            ]
        ].id;
    }

    // returns where the focus of which item is
    @ExportedFunction
    public onRemoveProjectElement(delSystemID: string): string {
        if (this.projectItemsMap[delSystemID]) {
            this.projectItemsMap[delSystemID].destroy();
            delete this.projectItemsMap[delSystemID];
            if (this.isOnFocus(delSystemID)) {
                let prevFocusEditorID = this.focusPrevStackEditorID.pop();

                if (prevFocusEditorID) {
                    this.onChangePItemFocus(prevFocusEditorID);
                }
                else {
                    
                }
            }
            else {
                _.remove(this.focusNextStackEditorID, id => id === delSystemID);
                _.remove(this.focusPrevStackEditorID, id => id === delSystemID);
            }
        }
        return this.pitemOnFocusIds[this.onFocusLocation];
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
    public onChangePItemFocus(systemID): void {
        this.pitemOnFocusIds[this.onFocusLocation] = systemID;
        // TODO: open or inject
        (<EditorManagerView>this.view).update(this.projectItemsMap[systemID]);
    }

    @ExportedFunction
    public onFocusPreviousEditor(): void {
        if (this.focusNextStackEditorID.length > 0) {
            let nextSystemID = this.focusNextStackEditorID.pop();
            this.focusPrevStackEditorID
                .push(this.pitemOnFocusIds[
                    this.onFocusLocation
                ]);
            this.onChangePItemFocus(nextSystemID);
        }
    }

    @ExportedFunction
    public onFocusNextEditor(): void {
        if (this.focusPrevStackEditorID.length > 0) {
            let nextSystemID = this.focusPrevStackEditorID.pop();
            this.focusNextStackEditorID
                .push(this.pitemOnFocusIds[
                    this.onFocusLocation
                ]);
            this.onChangePItemFocus(nextSystemID);
        }
    }

    private pitemOnFocus(pitemID: string): boolean {
        return this.pitemOnFocusIds[0] === pitemID
            || this.pitemOnFocusIds[1] === pitemID;
    }
    private areaOfPItem(pitemID: string): number {
        return this.pitemOnFocusIds[0] === pitemID
            ? 1
            : this.pitemOnFocusIds[1] === pitemID
                ? 2
                : -1;
    }

    @ExportedFunction
    public onRenameProjectElement(pi: ProjectItem, callback: Function) {
        let pitemData = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [pi.jstreeNode.type]
        ).value;

        for (const key in pi.editorsData.items) {
            let item = pi.editorsData.items[key];

            let confName = item.confName;
            let econfig = pitemData.editorConfigs[confName][0];

            ComponentsCommunication.functionRequest(
                this.name,
                econfig.name,
                "updatePItemData",
                [
                    item.editorId,
                    pi
                ]
            );
        }

        if (this.pitemOnFocus(pi.systemID)) {
            this.open(pi, this.areaOfPItem(pi.systemID));
        }

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
        options,
        systemID: string,
        projectID: string,
        restriction?: Array<string>
    ) {
        let pitem = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [name]).value;
        let editorConfigs = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItemEditorsConfig",
            [name]).value;

        let projectItem = {
            systemID: systemID,
            projectID: projectID,
            options: options,
            items: {}
        };

        for (const ec of editorConfigs) {
            // assume only one editor is defined per mission
            // in case there are more than one
            // TODO: has to extend inner of the configData:
            // instances: { describe the elements }
            // in case of dynamically change of the user
            // factory is not responsible -> this action
            // happens during the development...
            let editorId = projectItem.systemID + '_' + ec.selector;
            let editorConfig = pitem.editorConfigs[ec.config][0];
            let response = ComponentsCommunication.functionRequest(
                this.name,
                editorConfig.name,
                "factoryNewItem",
                [
                    name,
                    ec.config,
                    args,
                    editorConfig,
                    {
                        editorId: editorId,
                        pitemId: projectItem.systemID,
                        projectId: projectID
                    }
                ]
            );
            
            projectItem.items[editorId] = _.assign(
                {},
                response.value,
                Editor.createJSONArgs(
                    editorConfig.name,
                    systemID,
                    projectID,
                    args
                ));
            // pin mission
            projectItem.items[editorId].tmplSel = ec.selector;
            projectItem.items[editorId].editorId = editorId;
            projectItem.items[editorId].confName = ec.config;
            projectItem.items[editorId].editorName = editorConfig.name;
        }

        return projectItem;
    }

    public onSplitEditorsBtn(btn: string): void {
        alert("split " + btn);
        // this.updateSplit(EditorsViewState.)
    }

    @ExportedFunction
    public closePItem(pitemArea: number) {
        let pitem = this.projectItemsMap[this.pitemOnFocusIds[this.locationOfPItemArea(pitemArea)]];
        
        if (pitem) {
            this.focusPrevStackEditorID.push(this.pitemOnFocusIds[this.locationOfPItemArea(pitemArea)]);
            pitem.destroy();
        }
    }

    @ExportedFunction
    public closeAllPItems(): void {
        for (const systemId in this.projectItemsMap) {
            this.projectItemsMap[systemId].destroy();
        }
        this.initData();
    }

    @ExportedSignal("editor-manager-open-pitem-completed")
    @ExportedFunction
    public open(pi: ProjectItem, pitemArea: number =1, editorsData?: any): void {
        let project = pi.project["data"].project;

        let pitemData = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [pi.jstreeNode.type]
        ).value;
        let editorConfigs = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItemEditorsConfig",
            [name]).value;

        // TODO: for dynamic templates add load pitem-view from the DB.
        // Save the tmpl on dynamicTmpl property of the project item

        let selector = ".pitem-editors-area-" + pitemArea;

        this.closePItem(pitemArea);
        
        // TODO: reuse map{this.projectItemsMap}, not create instance again...
        const pitemView: PItemView = <PItemView>ViewRegistry
            .getEntry("PItemView")
            .create(
                this,
                selector,
                pi,
                pitemData.view
            );
        pitemView.render();

        let tools = [];

        if (pi.project.getProjectDB().componentsData.CollaborationManager) {
            tools = ComponentsCommunication.functionRequest(
                this.name,
                "CollaborationManager",
                "pitemTools",
                [ pi.systemID ]
            ).value;
            tools.push("separator");
        }

        let _editorsData = editorsData || pi.editorsData;

        for (const key in _editorsData.items) {
            let item = _editorsData.items[key];

            if (item.noRenderOnPitemLoading) continue;
            // only one editor is supported
            // if domain author give more
            // TODO: selection by the end-user... now we just choose the 1st
            let confName = item.confName;
            let econfig = pitemData.editorConfigs[confName][0];

            let args = [
                item,
                pitemView,
                this.convertEconf(confName),
                // deactivate caching data mechanism of the VPL Editor
                project.saveMode !== "COLLAB_DEBUG" 
            ];

            ComponentsCommunication.functionRequest(
                this.name,
                econfig.name,
                "open",
                args
            );
            pitemView.addEditor(item.editorId, econfig.name);
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
        this.projectItemsMap[pi.systemID] = pitemView;
        this.pitemOnFocusIds[this.locationOfPItemArea(pitemArea)] = pi.systemID;

        ComponentsCommunication.postSignal(
            this.name,
            "editor-manager-open-pitem-completed",
            [pi]
        );
    }

    private dialogueNo: number = 1;

    @ExportedFunction
    public openPItemInDialogue(
        pi: ProjectItem,
        selector: string,
        isEditable: string,
        posize: any) {
        let pitemData = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [pi.jstreeNode.type]
        ).value;
        let editorConfigs = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItemEditorsConfig",
            [name]).value;

        const pitemView: PItemView = <PItemView>ViewRegistry
            .getEntry("PItemView")
            .create(
                this,
                selector,
                pi,
                pitemData.view,
                this.dialogueNo
            );
        pitemView.render();

        for (const key in pi.editorsData.items) {
            let item = pi.editorsData.items[key];

            let confName = item.confName;
            let econfig = pitemData.editorConfigs[confName][0];

            item.editorId = item.editorId + "_dialogue_" + this.dialogueNo;
            item.zIndex = 99999999999999999999;
            item.posize = posize;

            ComponentsCommunication.functionRequest(
                this.name,
                econfig.name,
                "openInDialogue",
                [
                    item,
                    pitemView,
                    this.convertEconf(confName),
                    item.editorId,
                    isEditable ? "EDITING" : "READ_ONLY",
                    "BlocklyStudioIDE"
                ]);

            pitemView.addEditor(item.editorId, econfig.name);
        }

        ++this.dialogueNo;
    }

    @ExportedFunction
    public refresh(project) {
        let pitem1 = project.getProjectElement(this.pitemOnFocusIds[0]);
        this.open(pitem1, this.areaOfPItem(pitem1.systemID));

        if (this.pitemOnFocusIds[1]) {
            let pitem2 = project.getProjectElement(this.pitemOnFocusIds[1]);
            this.open(pitem2, this.areaOfPItem(pitem2.systemID));
        }
    }

    private updatePrivileges(pitem: any): void {
        let pitemData = ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "getProjectItem",
            [pitem.jstreeNode.type]
        ).value;

        let _items = pitem.editorsData.items;
        for (const key in _items) {
            let item = _items[key];

            let econfig = pitemData.editorConfigs[item.confName][0];

            ComponentsCommunication.functionRequest(
                this.name,
                econfig.name,
                "update_privileges",
                [item, pitem.privileges]
            );
        }
    }

    @ExportedFunction
    public refreshPItem(pitem) {
        if (this.projectItemsMap[pitem.systemID]) {
            this.updatePrivileges(pitem);
            this.open(pitem, this.areaOfPItem(pitem.systemID));
        }
    }

    public isOnFocus(id: string, type: string = "pitem"): boolean {
        return this.pitemOnFocusIds[this.onFocusLocation] === id;
    }

    @ExportedFunction
    public pitemUpdated_src(pitem: any, data: any): void {
        ComponentsCommunication.functionRequest(
            this.name,
            data.editor,
            "update_src",
            [
                data,
                pitem,
                this.isOnFocus(pitem.systemID)
            ]
        );
    }

    @ExportedFunction
    public pitemRename(pitem, projectId, data) {
        if (this.isOnFocus(pitem.systemID)) {
            
        }
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

    @ExportedFunction
    public closeEditorInstance (editorId: string, editorName: string): void {
        ComponentsCommunication.functionRequest(
            this.name,
            editorName,
            "closeSRC",
            [ editorId ]
        );
    }
}
