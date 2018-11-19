import { ProjectManagerValidation } from './project-manger-validation';
import { assert, IDEError } from './../../../shared/ide-error/ide-error';
import {
    ComponentsCommunication,
    ComponentCommAddFunction
} from './../../component/components-communication';
import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { ProjectManagerMetaDataHolder } from "./project-manager-meta-map";
import { ProjectManagerView } from './project-manager-view/project-manager-view';

import { IEventData } from "../../common-views/actions-view/actions-view";

import * as _ from "lodash";
import { ViewRegistry } from './../../component/registry';
import { ModalView } from '../../component/view';
import { ProjectManagerElementView } from './project-manager-view/project-manager-elements-view/project-manager-application-instance-view/project-manager-element-view';
import {
    RenderPartsToPropertyData,
    CreateRenderPartsWithData
} from '../configuration/configuration-view/property-views/property-view';
import { ProjectManagerItemView } from './project-manager-view/project-manager-elements-view/project-manager-application-instance-view/item-view/item-view';

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
        { date: "March 2018", name: "Yannis Valsamakis", email: "jvalsam@ics.forth.gr" }
    ],
    componentView: "ProjectManagerView",
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

        if (this.isOpen) {
            this.initialize();
        }

        _.forEach(ProjectManagerMetaDataHolder.getDomainNames(), (domain: string) => {
            let funcName = "onConfig"+domain;
            this[funcName] = () => this.onConfig(domain);
            ComponentCommAddFunction(this.name, funcName, 0);
        });

        this._modalActions = {
            "create": (data, projectID) => this.createNewElement(this.currEvent, data, this.newSystemID(projectID))
        };

        ComponentsCommunication.functionRequest(this.name, "Shell", "showToolbar");
    }
    @RequiredFunction("Shell", "showToolbar")
    
    @ExportedFunction
    initialize(): void {
        let metadata = ProjectManagerMetaDataHolder.getWSPDomainMetaData(this.domainType);
        metadata.style = ProjectManagerMetaDataHolder.getWSPDomainStyle(metadata.style);
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
        }
        assert(this.domainType === project.domainType);
        ComponentsCommunication.functionRequest(this.name, "Shell", "openComponent", [this]);
        this.loadProject(project);
    }

    @ExportedFunction
    public loadProject(project): void {
        this.loadedProjects[project._id] = project;
        (<ProjectManagerView>this._view).loadProject(project);
    }

    public saveProjectResponse(resp) {
        console.log("----------------------\n");
        console.log(resp);
        alert("Application saved successfully!\n");
    }

    public saveProject(projectID: string): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "ApplicationWSPManager",
            "updateApplication",
            [ this.loadedProjects[projectID], (resp) => this.saveProjectResponse(resp) ]
        );
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
                "onRequestEditorAction",
                [event, concerned.itemData()]
            );
        }
        else {
            let evtData = {
                mission: event.data.mission
            };
            if (event.data) {
                evtData["data"] = event.data;
            }
            ComponentsCommunication.functionRequest(this.name, event.providedBy, <string>event.action, [evtData, concerned]);
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
        alert("onShareProject not developed yet!");
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
        let index = renderParts ? renderParts.map(x => x.type).indexOf("title") : -1;
        return index > -1 ? renderParts[index] : null;
    }
    private getTitleOfRenderParts(renderParts): string {
        let data = this.getRenderDataTitle(renderParts);
        return data ? (data.value.default ? data.value.default.text : data.value.text) : "";
    }
    private createDialogueTitle(action: string, renderParts, type) {
        let renderPartsTitle = this.getTitleOfRenderParts(renderParts);
        return  action + ( renderPartsTitle ? renderPartsTitle : type );
    }
    private createDialogue(actionTitle: string, body: { formElems?: any, text?: any }, type, actions, dtype: string = "simple") {
        if (body.formElems) {
            body.formElems = RenderPartsToPropertyData(body.formElems);
        }
        return {
            type: dtype,
            data: {
                title: this.createDialogueTitle(actionTitle, body.formElems, type),
                body: body,
                actions: actions
            }
        };
    }

    private createNewItem(concerned: ProjectManagerElementView, newItem: any, src: any): void {
        let renderParts = CreateRenderPartsWithData(this.currModalData.itemData.renderParts, newItem);
        concerned.addNewElement(
            {
                renderParts: renderParts,
                editorData: src,
                systemID: src.systemID,
                type: this.currModalData.itemData.type
            },
            (elem) => {
                this.onClickProjectElement(elem);
                this.loadedProjects[concerned.projectID].elements.push(elem.itemData());
                this.saveProject(concerned.projectID);
            }
        );
    }

    @ExportedFunction
    public onAddProjectElement (event: IEventData, concerned: ProjectManagerElementView): void {
        this.currEvent = event;
        let dialoguesData = [];
        let validTypes = concerned.getValidChildren();
        let projInstView = (<ProjectManagerView>this._view).getProject(concerned.projectID);
        assert(projInstView !== null);
        this.currModalData.projectID = concerned.projectID;

        // specific element to select
        if (event.data.choices.length === 1) {
            let type = event.data.choices[0].type;
            this.currModalData.itemData = concerned.getChildElementData(type);
            let renderData = _.reverse(concerned.getReversedChildElementRenderData(type));

            dialoguesData.push(this.createDialogue(
                "Create New ",
                { formElems: renderData },
                type,
                [
                    {
                        choice:"Cancel",
                        type: "button",
                        providedBy:"self"
                    },
                    {
                        choice: "Create",
                        type: "submit",
                        providedBy: "creator",
                        validation: (data, callback) => ProjectManagerValidation.check(
                            data,
                            projInstView,
                            event.validation,
                            callback
                        ),
                        callback: (data) => {
                            let src = this.createNewElement(event, data, this.newSystemID(concerned.projectID));
                            this.createNewItem(concerned, data, src);
                        }
                    }
                ]
            ));
        }
        // first dialogue choose type of element
        else {
            let types = event.data.choices.map(x=>x.type);
            assert(_.difference(types, validTypes).length === 0, "Invalid type of choice is defined in the description domain.");

            let titles = [];
            let dialogues = [];
            let itemsData = [];
            _.forEach(types, (type)=> {
                let renderData = _.reverse(concerned.getReversedChildElementRenderData(type));
                itemsData.push(concerned.getChildElementData(type));
                let title = renderData[renderData.map(x=>x.type).indexOf("title")].value.default.text;
                titles.push(title);
                let dialogue = this.createDialogue(
                    "Create New ",
                    { formElems: renderData },
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
                            validation: (data, callback) => ProjectManagerValidation.check(
                                data,
                                projInstView,
                                event.validation,
                                callback
                            ),
                            callback: (data, index) => {
                                assert(index !== -1, "Invalid index in sequential dialogues in multi choice of dialogues!");
                                this.currModalData.itemData = itemsData[index]
                                let src = this.createNewElement(event, data, this.newSystemID(concerned.projectID));
                                this.createNewItem(concerned, data, src);
                            }
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
                            indepedent: true
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
        let modalActionView = <ModalView>ViewRegistry.getEntry("SequentialDialoguesModalView").create(this, dialoguesData);
        modalActionView.open();
    }

    @ExportedFunction
    public onDeleteAllElements(event: IEventData, concerned: any): void {
        alert("Delete all element function is not supported yet!");
    }

    public onClickMenuItem (event: IEventData, data: any): void {
        if (event.providedBy === "Platform") {
            this[<string>event.action] (data.itemId, data.projectId);
        }
        else {
            this.onOuterFunctionRequest(event, [{"itemId": data.itemId, "projectId": data.projectId}]);
        }
    }

    @ExportedFunction
    public onRemoveElement(event: IEventData, concerned: ProjectManagerItemView): void {
        this.currModalData = {
            itemData: Object.assign({}, concerned.itemData()),
            projectID: concerned.projectID
        };
        let title: string = this.getTitleOfRenderParts(concerned.itemData().renderParts);
        (<ModalView>ViewRegistry.getEntry("SequentialDialoguesModalView").create(
            this,
            [this.createDialogue (
                "Remove ",
                {
                    text: "Deleting <b>"+title+"</b> element has not undo action. Are you sure you would like to continue?"
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
                        callback: () => {
                            let currFocusSystemID = ComponentsCommunication.functionRequest (
                                this.name,
                                "EditorManager",
                                "onRemoveProjectElement",
                                [ (<ProjectManagerItemView>concerned).itemData().systemID ]
                            ).value;
                            // fix selection of current focus
                            if (currFocusSystemID) {
                                (<ProjectManagerView>this._view).changeSelectedItem(this.currModalData.projectID, currFocusSystemID);
                            }
                            //TODO: check response if element can be deleted
                            (<ProjectManagerView>this._view).removeElement(concerned.projectID, concerned.systemID);
                            // remove from project data
                            let index = this.loadedProjects[concerned.projectID].elements.map(x=>x.systemID).indexOf(concerned.systemID);
                            assert(index>-1, "not found element in project data to remove");
                            this.loadedProjects[concerned.projectID].elements.splice(index, 1);
                            this.saveProject(concerned.projectID);
                        }
                    }
                ]
            )]
        )).open();
    }

    @ExportedFunction
    public onRenameElement(event: IEventData, concerned: ProjectManagerItemView): void {
        let projInstView = (<ProjectManagerView>this._view).getProject(concerned.projectID);
        let renderParts = concerned.renderData();
        let renderData = [ this.getRenderDataTitle(renderParts) ];
        assert(projInstView !== null);
        this.currModalData = {
            itemData: Object.assign({}, concerned.itemData()),
            projectID: concerned.projectID
        };
        let title: string = this.getTitleOfRenderParts(renderParts);
        (<ModalView>ViewRegistry.getEntry("SequentialDialoguesModalView").create(
            this,
            [this.createDialogue (
                "Rename ",
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
                                "onRenameElement",
                                [
                                    data,
                                    concerned.systemID,
                                    (resp) => {
                                        let loadedProject = this.loadedProjects[concerned.projectID];
                                        alert("response of editor manager in project manager. TODO: complete save rename item");
                                        // edit name in title
                                        let index = loadedProject.elements.map(x=>x.systemID).indexOf(concerned.systemID);
                                        assert(index>-1, "Not found element in project to rename!");
                                        let rindex = loadedProject.elements[index].renderParts.map(x=>x.type).indexOf("title");
                                        loadedProject.elements[index].renderParts[rindex].value.text = data;
                                    }
                                ]
                            );
                        }
                    }
                ]
            )]
        )).open();
    }

    @ExportedFunction
    public onEditElement(event: IEventData, concerned: ProjectManagerItemView): void {
        alert("Not implemented yet edit element!");
    }

    public onClickProjectElement(element: ProjectManagerItemView): void {
        (<ProjectManagerView>this._view).onClickElement(element);
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
        let args = ( ({mission, providedBy}) => ({mission, providedBy}) ) (event.data.choices[index]);
        let response = ComponentsCommunication.functionRequest(
            "ProjectManager",
            args.providedBy ? args.providedBy : "EditorManager",
            "factoryNewElement",
            [ args.mission, data[data.length-1], systemID, [] ]
        );
        return response.value;
    }
}
