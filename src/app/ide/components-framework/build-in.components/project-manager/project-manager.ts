import { ProjectManagerValidation } from "./project-manger-validation";
import { assert, IDEError } from "./../../../shared/ide-error/ide-error";
import {
    ComponentsCommunication,
    ComponentCommAddFunction
} from "./../../component/components-communication";
import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { ProjectManagerMetaDataHolder } from "./project-manager-meta-map";
import {
    ProjectManagerJSTreeView
} from "./project-manager-jstree-view/project-manager-jstree-view";

import { IEventData } from "../../common-views/actions-view/actions-view";

import * as _ from "lodash";
import { ViewRegistry } from "./../../component/registry";
import { ModalView } from "../../component/view";
import {
    CreateRenderPartsWithData
} from "../configuration/configuration-view/property-views/property-view";
import {
    ProjectManagerItemView
} from "./project-manager-view/project-manager-elements-view/project-manager-application-instance-view/item-view/item-view";
import { upload_files } from "../../../shared/upload-files";
import { RuntimeManager } from "../run-time-system-manager/run-time-manager";
import { ComponentRegistry } from "../../component/component-entry";
import {
    ProjectElement
} from "./project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-element";
import {
    ProjectCategory
} from "./project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-category";
import { EditorManager } from "../editor-manager/editor-manager";
import {
    ProjectItem
} from "./project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";
import { Editor } from "../editor-manager/editor";
import {
    createDialogue,
    getTitleValueofRenderParts,
    getTitleOfRenderParts
} from "../../common-views/sequential-dialogues-modal-view/dialogue-data";


// initialize the metadata of the project manager component for registration in the platform
ProjectManagerMetaDataHolder.initialize();
var menuJson = ProjectManagerMetaDataHolder.getDomainsMenuJSON();
var configJson = ProjectManagerMetaDataHolder.getDomainsConfigJSON();


export interface IProjectManagerElementData {
    systemID: string;
    path: string;
    orderNO: number;
    type: string;
    editorData: {};
    renderParts: {};
}

@UIComponentMetadata({
    description: "Project Manager of the IDE",
    authors: [
        {
            date: "March 2018",
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr"
        }
    ],
    componentView: "ProjectManagerJSTreeView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class ProjectManager extends IDEUIComponent {
    private projManagerDescr: any;
    private currEvent: IEventData;
    private currModalData: { itemData: any, projectID };
    private _modalActions: { [func: string]: Function };
    private loadedProjects: {[projectID: string]: any};
    private mainProject: string;
    private isOpen: Boolean;

    constructor(
        name: string,
        description: string,
        componentView: string,
        hookSelector: string,
        private domainType: string
    ) {
        super(name, description, componentView, hookSelector);
        this.isOpen = this.domainType ? true : false;
        this.loadedProjects = [];
        this.currModalData = <any>{};

        this.mainProject = null;

        if (this.isOpen) {
            this.initialize();
        }

        _.forEach(
            ProjectManagerMetaDataHolder.getDomainNames(),
            (domain: string) => {
                let funcName = "onConfig"+domain;
                this[funcName] = () => this.onConfig(domain);
                ComponentCommAddFunction(this.name, funcName, 0);
            });

        this._modalActions = {
            "create": (data, projectID) => this.createNewElement(
                this.currEvent,
                data,
                this.newSystemID(projectID))
        };

        ComponentsCommunication.functionRequest(
            this.name,
            "Shell",
            "showToolbar");
    }
    @RequiredFunction("Shell", "showToolbar")

    @RequiredFunction("DomainsManager", "loadDomain")
    @ExportedFunction
    public initialize(): void {
        let metadata = ProjectManagerMetaDataHolder
            .getWSPDomainMetaData(this.domainType);
        metadata.style = ProjectManagerMetaDataHolder
            .getWSPDomainStyle(metadata.style);
        this.projManagerDescr = metadata;
        this._view.setRenderData(metadata);
        this._view.initialize();
    }

    private getItemData (name: string) {
        let categories = this.projManagerDescr["project"]["categories"];
        _.forEach(categories, (category)=> {
            _.forEach(category.items, (item) => {
                if (item.type === name) {
                    return item;
                }
            });
        });
    }

    private getItemDataCreate (name, data) {
        // TODO: find in descr tree path the item and then mission and action

        // TODO: request from editor manager
    }

    @ExportedFunction
    public createProject(): void {
        // TODO: create new project and request to add it in user's account projects in DB
    }

    @ExportedFunction
    public deleteProject(id: string): void {
        // TODO: send request to delete it from user's account projects in DB
    }

    @RequiredFunction("Shell", "openComponent")
    @ExportedFunction
    public openProject(project): void {
        if (!this.isOpen) {
            this.domainType = project.domainType;
            this.initialize();

            assert(this.domainType === project.domainType);

            ComponentsCommunication.functionRequest(
                this.name,
                "Shell",
                "openComponent",
                [this]);

            // start domain manager (if it is not) and load the domain
            ComponentsCommunication.functionRequest(
                this.name,
                "DomainsManager",
                "loadDomain",
                [this.domainType]
            );

            let editorComponents = ComponentsCommunication.functionRequest(
                this.name,
                "DomainsManager",
                "getEditors"
            ).value;
            editorComponents.forEach(name => {
                let editor = <Editor>(ComponentRegistry.getEntry(name).create([
                    ".modal-platform-container"
                ]));

                if (editor.name === "BlocklyVPL" || editor.name === "ReteVPL") {
                    editor["loadDomain"](this.domainType);
                }
            });

            var console: RuntimeManager = <RuntimeManager>ComponentRegistry
                .getEntry("RuntimeManager")
                .create([".project-manager-runtime-console-area"]);

            ComponentsCommunication.functionRequest(
                this.name,
                "Shell",
                "openComponent",
                [console]);

            console.InitConsoleMsg();
        }

        this.loadProject(project);
    }

    @ExportedFunction
    public initializeSharedProject(project): void {
        // check if project is already loaded
        if (project) {}

    }

    @ExportedFunction
    public getMainApplicationData() {
        let mainProject = this.loadedProjects[this.mainProject];
        return { main: "srcMain", domain: "IoT" };
    }

    @ExportedFunction
    public loadProject(project): void {
        project.saveMode = "DB";
        this.loadedProjects[project._id] = project;
        this.mainProject = project._id;
        let projView = (<ProjectManagerJSTreeView>this._view).loadProject(project);

        ComponentsCommunication.functionRequest(
            this.name,
            "DomainsManager",
            "loadProject",
            [project._id, project.domainElements]
        );

        // set default values if there is no state
        if (!project.editorsState) {
            project.editorsState = {
                viewState: "normal",
                onFocusPItems: [
                    projView.firstPItemID
                ]
            };
        }

        let editorManager = <EditorManager>ComponentRegistry.getEntry("EditorManager").create([
            ".project-manager-visual-editors-area",
            project.editorsState.viewState,
            project.editorsState.onFocusPItems
        ]);
        editorManager.initializeEditorsView();
    }

    @ExportedFunction
    public getProjectItem(pitemId: string): ProjectItem {
        let projectId = pitemId.split("_")[0];
        let projView = (<ProjectManagerJSTreeView>this.view)
            .getProject(projectId);
        if (projView) {
            return <ProjectItem>projView.getProjectElement(pitemId);
        }
        return null;
    }

    public saveProjectResponse(resp) {
        console.log("----------------------\n");
        console.log(resp);
        // alert("Application saved successfully!\n");
    }

    private getProjectDataToSave(project) {
        let projectForSave = JSON.parse(JSON.stringify(project));
        _.forEach(projectForSave.projectItems, (element)=> {
            _.forEach(element.renderParts, (renderPart) => {
                renderPart.type = renderPart.type;
                delete renderPart.id;
                if (renderPart.value) {
                    delete renderPart.value.property;
                    delete renderPart.value.default;
                }
                delete renderPart.selectedBy;
                delete renderPart.formElemItemRenderNO;
            });
        });
        return projectForSave;
    }

    @ExportedFunction
    public saveProject(projectID: string): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "ApplicationWSPManager",
            "updateApplication",
            [
                this.getProjectDataToSave(this.loadedProjects[projectID]),
                (resp) => this.saveProjectResponse(resp)
            ]
        );
    }

    @ExportedFunction
    public getProject(projectID: string): any {
        return this.loadedProjects[projectID];
    }

    @ExportedFunction
    public getPItem(pitemID: string): any {
        let projectID = pitemID.split("_")[0];
        let project = this.loadedProjects[projectID];
        return project.projectItems.find(x => x.systemID === pitemID);
    }

    @ExportedFunction
    public saveProjectObj(projectObj: any, cb: Function): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "ApplicationWSPManager",
            "updateApplication",
            [
                this.getProjectDataToSave(projectObj),
                (resp) => cb(typeof resp === "object")
            ]
        );
    }

    @ExportedFunction
    public pitemUpdated(pitemId: any, type: any, data: any): boolean {
        let pitem = this.getPItem(pitemId);
        let projectId = pitemId.split("_")[0];

        switch(type) {
            case "src":
                return ComponentsCommunication.functionRequest(
                    this.name,
                    "EditorManager",
                    "pitemUpdated_src",
                    [
                        pitem,
                        data
                    ]
                ).value;
            case "rename":
                (<ProjectManagerJSTreeView>this._view).pitemRename(
                    pitem,
                    projectId,
                    data
                );
                ComponentsCommunication.functionRequest(
                    this.name,
                    "EditorManager",
                    "pitemRename",
                    [
                        pitem,
                        projectId,
                        data
                    ]
                );
            case "ownership":
                break;
            case "privileges":
                break;
        };
        return true;
    }

    private newSystemID (projectID): string {
        let systemIDs = ++this.loadedProjects[projectID].systemIDs;
        return projectID + "_" + systemIDs;
    }

    @ExportedFunction
    public registerEvents(): void { ; }

    @ExportedFunction
    public update(): void { ; }

    @ExportedFunction
    public onOpen(): void { ; }

    @ExportedFunction
    public onClose(): void {
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }

    @ExportedFunction
    public onChangeConfig(values: Object): void {
        alert("on change config data not developed yet in Menu Component");
    }

    // callback function of project manager view actions are provided by outer Components
    private onOuterFunctionRequest (event: IEventData, concerned: any): void {
        if (event.providedBy === "EditorManager") {
            ComponentsCommunication.functionRequest(
                this.name,
                event.providedBy,
                "onRequestAction",
                [event, concerned]
            );
        }
        else {
            let evtData = {
                mission: event.data.mission
            };
            if (event.data) {
                evtData["data"] = event.data;
            }
            ComponentsCommunication.functionRequest(
                this.name,
                event.providedBy,
                <string>event.action,
                [
                    evtData,
                    concerned
                ]);
        }
    }

    @ExportedFunction
    public onCreateNewProject(event: IEventData, concerned: any): void {
        alert("onCreateNewProject not developed yet!");
        this._view["openProject"]();
    }

    @ExportedFunction
    public onOpenProject(event: IEventData, concerned: any): void {
        alert("onOpenProject not developed yet!");
    }

    @ExportedFunction
    public onCloseAllProjects(event: IEventData, concerned: any): void {
        alert("onCloseAllProjects not developed yet!");
        this._view["closeAllProjects"]();
    }

    @ExportedFunction
    public onDeleteProject(event: IEventData, concerned: any): void {
        this.deleteProject(concerned.id);
        this._view["closeProject"](concerned.id);
    }

    @ExportedFunction
    public onDeleteAllProjects(event: IEventData, concerned: any): void {
        alert("onDeleteAllProjects not developed yet!");
        this._view["closeAllProjects"]();
    }

    @ExportedFunction
    public addProjectElement(event: IEventData, concerned: any): void {
        this._view["addElement"] (concerned.projectID, concerned.element);

    }

    @ExportedFunction
    public onRenameProject(event: IEventData, concerned: any): void {
        alert("onRenameProject not developed yet!");
    }

    @ExportedFunction
    public onShareProject(event: IEventData, concerned: any): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "CollaborationManager",
            "startSession",
            [
                $(".modal-platform-container"),
                concerned.data.project,
                $(".collaboration-manager-container"),
                (collabProject) => {
                    collabProject.saveMode = "SHARED";
                    this.loadedProjects[collabProject._id] = collabProject;
                    (<ProjectManagerJSTreeView>this.view).updateProject(collabProject);
                }
            ]
        );
    }

    @ExportedFunction
    public onClickProjectProperties(event: IEventData, concerned: any): void {
        alert("onClickProjectProperties not developed yet!");
    }

    @ExportedFunction
    public onCloseProject(event: IEventData, concerned: any): void {
        alert("onCloseProject not developed yet!");
    }

    private getRenderDataTitle(renderParts): any {
        let index = renderParts
            ? renderParts.map(x => x.type).indexOf("title")
            : -1;

        return index > -1
            ? renderParts[index]
            : null;
    }

    public getDefaultTitleofRenderParts(renderParts): string {
        let data = this.getRenderDataTitle(renderParts);
        return (data && data.value.default) || "";
    }

    private createNewItem(
        concerned: ProjectElement,
        newItem: any,
        src: any
    ): void {
        let renderParts = CreateRenderPartsWithData(
            this.currModalData.itemData.renderParts,
            newItem);

        concerned.project.addNewElement(
            {
                renderParts: renderParts,
                editorData: src,
                systemID: src.systemID,
                type: this.currModalData.itemData.type
            },
            concerned,
            (elem) => {
                this.onClickProjectElement(elem);
                this.loadedProjects[concerned.project.dbID].projectItems
                    .push(elem.itemData());
                this.saveProject(concerned.project.dbID);
                elem.trigger("click");
            }
        );
    }

    private saveEditorData_SHARED(
        editorId: string,
        pitem: ProjectItem,
        project: any,
        editor: string,
        event: any
    ): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "CollaborationManager",
            "pitemUpdated",
            [
                pitem.systemID,
                "EDITOR_SRC",
                {
                    editorId: editorId,
                    editor: editor,
                    event: event
                }
            ]
        );
    }

    private saveEditorData_DB(
        editorId: string,
        pitem: ProjectItem,
        project: any,
        editor: string,
        data: any
    ) {
        let projectItem = project.projectItems
            .find(x => x.systemID === pitem.systemID);

        if (!projectItem.editorsData) {
            projectItem.editorsData = [];
        }
        let index = projectItem.editorsData.map(x => x.id).indexOf(editorId);
        if (index < 0) {
            projectItem.editorsData.push({
                id: editorId,
                data: data
            });
        }
        else {
            projectItem.editorsData[index].data = data;
        }

        this.saveProject(project._id);
    }

    @ExportedFunction
    public saveEditorData(
        editorId: string,
        pitem: ProjectItem,
        editor: string,
        data: (mode: string) => any
    ): void {
        let projectId = pitem.project.dbID;
        let project = this.loadedProjects[projectId];

        this["saveEditorData_" + project.saveMode](
            editorId,
            pitem,
            project,
            editor,
            data(project.saveMode)
        );
    }

    private onSuccessUploadFiles(paths: Array<String>, data, event, concerned) {
            // update img path
            for (var i = 0; i < paths.length; i++) {
                for (const key of Object.keys(data.imgData)) {
                    let value = data.imgData[key];
                    if (value === i) {
                        data.json[key] = paths[i];
                        break;
                    }
                }
            }
            assert(
                paths.length === 0 || paths.length === 1,
                "Invalid number of paths in save img of Project Manager New Item"
            );
            let src = this.createNewElement(
                event,
                data,
                this.newSystemID(concerned.project["projectID"])
            );
            this.createNewItem(
                concerned,
                data,
                src
            );
    }
    private onCreateProjectItem(data, event, concerned, index =null, itemsData =null) {
        if (typeof index === "number") {
            assert(
                index !== -1,
                "Invalid index in sequential dialogues in multi choice of dialogues!"
            );
            this.currModalData.itemData = itemsData[index];
        }
        upload_files(
            data.form,
            (paths: Array<String>) => this.onSuccessUploadFiles(
                paths,
                data,
                event,
                concerned
            ),
            (resp) => {
                IDEError.raise("Error Project Manager Save Img", resp);
            }
        );
    }

    @ExportedFunction
    public onAddProjectElement (
        event: IEventData,
        concerned: ProjectElement
    ): void {
        this.currEvent = event;
        let dialoguesData = [];
        let validTypes = concerned.getValidChildren();
        let projectID = concerned.project["projectID"];
        let projInstView = (<ProjectManagerJSTreeView>this._view)
            .getProject(projectID);

        assert(projInstView !== null);

        this.currModalData.projectID = projectID;
        let systemIDs = this.loadedProjects[this.currModalData.projectID].systemIDs;

        // specific element to select
        if (event.data.choices.length === 1) {
            let type = event.data.choices[0].type;
            this.currModalData.itemData = (<ProjectCategory>concerned)
                .getChildElementData(type);
            let renderData = (<ProjectCategory>concerned)
                .getReversedChildElementRenderData(type);

            dialoguesData.push(
                createDialogue(
                    "Create New ",
                    {
                        formElems: renderData,
                        systemIDs: systemIDs
                    },
                    type,
                    [
                        {
                            choice:"Cancel",
                            type: "button",
                            providedBy:"self"
                        },
                        {
                            choice: "Create",
                            type: "button",
                            providedBy: "creator",
                            validation: (data, callback) =>
                                ProjectManagerValidation.check(
                                    data,
                                    projInstView,
                                    event.validation,
                                    callback
                                ),
                            callback: (data) => this.onCreateProjectItem(
                                data,
                                event,
                                concerned
                            )
                        }
                    ]
                ));
        }
        // first dialogue choose type of element
        else {
            let types = event.data.choices.map(x => x.type);

            assert(
                _.difference(types, validTypes).length === 0,
                "Invalid type of choice is defined in the description domain.");

            let titles = [];
            let dialogues = [];
            let itemsData = [];
            _.forEach(types, (type)=> {
                let renderData = _.reverse((<ProjectCategory>concerned)
                    .getReversedChildElementRenderData(type));

                itemsData.push((<ProjectCategory>concerned).getChildElementData(type));
                let title = renderData[renderData
                    .map(x=>x.type)
                    .indexOf("title")]
                    .value
                    .default;
                titles.push(title);
                let dialogue = createDialogue(
                    "Create New ",
                    {
                        formElems: renderData,
                        systemIDs: systemIDs
                    },
                    type,
                    [
                        {
                            choice:"Back",
                            type: "button",
                            providedBy:"self"
                        },
                        {
                            choice: "Create",
                            type: "submit",
                            providedBy: "creator",
                            validation: (data, callback) =>
                                ProjectManagerValidation.check(
                                    data,
                                    projInstView,
                                    event.validation,
                                    callback
                                ),
                            callback: (data, index) =>
                                this.onCreateProjectItem(
                                    data,
                                    index,
                                    itemsData,
                                    event,
                                    concerned
                                )
                        }
                    ]
                );
                dialogue["dependsValue"] = title;
                dialogues.push(dialogue);
            });
            // 1st dialogue choose item to create
            dialoguesData.push({
                type: "simple",
                data: {
                    title: "Select type of item",
                    body: {
                        formElems: [{
                            descriptionID: "select_type_new_item",
                            name: "Type",
                            style: "",
                            selected: titles[0],
                            values: titles,
                            type: "select",
                            renderName: true,
                            indepedent: true,
                            renderNO: 1
                        }]
                    },
                    actions: [
                        { choice:"Cancel", type: "button", providedBy:"self" },
                        { choice: "Next", type: "submit", providedBy: "self" }
                    ]
                }
            });
            // second dialogue which is based on the 1st selection
            dialoguesData.push({
                type: "depends_on",
                depedency: { dialogueNO: 0, propertyID: "select_type_new_item" },
                dialogues: dialogues
            });
        }

        let modalActionView = <ModalView>ViewRegistry
            .getEntry("SequentialDialoguesModalView")
            .create(this, dialoguesData);
        modalActionView.open();
    }

    @ExportedFunction
    public onDeleteAllElements(event: IEventData, concerned: any): void {
        alert("Delete all element function is not supported yet!");
    }

    public onClickMenuItem (event: IEventData, concerned: ProjectElement): void {
        if (event.providedBy === "Platform") {
            this[<string>event.action](event, concerned);
        }
        else {
            this.onOuterFunctionRequest(event, concerned);
        }
    }

    private onDeleteElement(concerned) {
        let currFocusSystemID = ComponentsCommunication.functionRequest(
            this.name,
            "EditorManager",
            "onRemoveProjectElement",
            [(<ProjectManagerItemView>concerned).itemData().systemID]
        ).value;
        (<ProjectManagerJSTreeView>this._view)
            .removeElement(concerned.projectID, concerned.systemID);

        let index = this.loadedProjects[concerned.projectID]
            .projectItems
            .map(x => x.systemID)
            .indexOf(concerned.systemID);

        assert(index > -1, "not found element in project data to remove");
        // fixing rendering order
        let element = this.loadedProjects[concerned.projectID].projectItems[index];
        this.loadedProjects[concerned.projectID]
            .projectItems
            .filter(
                x => {
                    return x.path === element.path && x.orderNO > element.orderNO;
                })
            .forEach(
                (elementInPath) => --elementInPath.orderNO
            );
        // remove from project data
        this.loadedProjects[concerned.projectID].projectItems.splice(index, 1);
        this.saveProject(concerned.projectID);
    }

    @ExportedFunction
    public onRemoveElement(event: IEventData, concerned: ProjectManagerItemView): void {
        this.currModalData = {
            itemData: Object.assign({}, concerned.itemData()),
            projectID: concerned.projectID
        };
        let title: string = getTitleValueofRenderParts(concerned.itemData().renderParts);
        (<ModalView>ViewRegistry.getEntry("SequentialDialoguesModalView").create(
            this,
            [createDialogue (
                "Remove ",
                {
                    text: "Deleting <b>"
                          + title
                          + "</b> element has not undo action. Are you sure you would like to continue?"
                },
                title ? title : "Element",
                [
                    {
                        choice:"No",
                        type: "button",
                        providedBy:"self"
                    },
                    {
                        choice: "Yes",
                        type: "submit",
                        providedBy: "creator",
                        callback: () => this.onDeleteElement(concerned)
                    }
                ]
            )]
        )).open();
    }

    private assignRenderPartValue (renderPart, value: string) {
        switch(renderPart.type) {
            case 'img':
                if (!value) {
                    value = renderPart.value.default;
                }

                if (value.includes(" fa-")) {
                    renderPart.value = { fa: value };
                }
                else {
                    renderPart.value = { path: value };
                }

                value = renderPart.value;
                break;
            case "title":
                renderPart.value = { text: value };
                break;
            case "colour":
                renderPart.value = { colour: value };
                break;
            default:
                IDEError.raise(
                    "Set new value in render part",
                    "RenderPart Value for type "
                    + renderPart.type
                    + " is not supported!"
                );
        }
        return value;
    }

    @ExportedFunction
    public onRenameElement(event: IEventData, concerned: ProjectManagerItemView): void {
        let projInstView = (<ProjectManagerJSTreeView>this._view).getProject(concerned.projectID);
        let renderData = concerned.renderData();

        assert(projInstView !== null);
        this.currModalData = {
            itemData: Object.assign({}, concerned.itemData()),
            projectID: concerned.projectID
        };
        let title: string = getTitleOfRenderParts(renderData);
        (<ModalView>ViewRegistry.getEntry("SequentialDialoguesModalView").create(
            this,
            [createDialogue (
                "Rename " + concerned.defaultTitle() + ": ",
                { formElems: renderData },
                title ? title : "Element",
                [
                    {
                        choice:"Cancel",
                        type: "button",
                        providedBy:"self"
                    },
                    {
                        choice: "Rename",
                        type: "submit",
                        providedBy: "creator",
                        validation: (data, callback) => ProjectManagerValidation.check(
                            data,
                            projInstView,
                            event.validation,
                            callback
                        ),
                        callback: (data) => {
                            ComponentsCommunication.functionRequest(
                                "ProjectManager",
                                "EditorManager",
                                "onRenameProjectElement",
                                [
                                    data,
                                    concerned.systemID,
                                    (resp) => {
                                        let loadedProject = this.loadedProjects[concerned.projectID];
                                        // edit name in title
                                        let index = loadedProject.projectItems.map(x=>x.systemID).indexOf(concerned.systemID);
                                        assert(index>-1, "Not found element in project to rename!");
                                        let element = loadedProject.projectItems[index];
                                        let viewData = {};
                                        Object.keys(data[0]).forEach((type) => {
                                            let value = data[0][type];
                                            let renderPart = element.renderParts[ element.renderParts.map(x=>x.id).indexOf(type) ];
                                            viewData[renderPart.type] = this.assignRenderPartValue(renderPart, value);
                                        });
                                        concerned.rename(viewData);
                                        this.saveProject(concerned.projectID);
                                    }
                                ]
                            );
                        }
                    }
                ]
            )]
        )).open();
    }

    public onClickProjectElement(element: any): void {
        (<ProjectManagerJSTreeView>this._view).onClickElement(element);
    }

    private onModalChoiceAction(data: any, cancelAction: any) {
        if (this.currEvent && typeof this.currEvent.action === "string") {
            let action: string = <string>this.currEvent.action;
            if (!this._modalActions[action]) {
                IDEError.warn (
                    "Not supported action is requested",
                    "Action " + action + " is not suppoerted by the Project Manager.",
                    "Project Manager"
                );
                cancelAction();
            }

            this._modalActions[action] (event, data);
        }
        else {
            let action: Function = <Function>this.currEvent.action;
            action (event, data);
        }
    }

    // modal actions are statically supported
    private createNewElement(event: IEventData, data: any, systemID: string): string {
        let index = event.data.choices.map(x=>x.type).indexOf(this.currModalData.itemData.type);
        assert(index !== -1, "Not defined event click for this specific element type.");
        let renderParts = {};
        let formData = typeof data === "object"
            ? data.json[0]
            : data[data.length - 1].json[0];
        for (const id of Object.keys(formData)) {
            let rp = this.currModalData.itemData.renderParts.find(x=> x.id === id);
            renderParts[rp.type] = formData[id];
        }

        let response = ComponentsCommunication.functionRequest(
            "ProjectManager",
            "EditorManager",
            "factoryNewProjectItem",
            [
                this.currModalData.itemData.type, // project-item-type
                renderParts,
                systemID,
                this.currModalData.projectID,
                []
            ]
        );
        return response.value;
    }
}
