import { ProjectManagerValidation } from './project-manger-validation';
import { assert, IDEError } from './../../../shared/ide-error/ide-error';
import { ComponentsCommunication, ComponentCommAddFunction } from './../../component/components-communication';
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
import { RenderPartsToPropertyData } from '../configuration/configuration-view/property-views/property-view';

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
    private currItemsData: any;
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
        if (this.isOpen) {
            this.initialize();
        }

        _.forEach(ProjectManagerMetaDataHolder.getDomainNames(), (domain: string) => {
            let funcName = "onConfig"+domain;
            this[funcName] = () => this.onConfig(domain);
            ComponentCommAddFunction(this.name, funcName, 0);
        });

        this._modalActions = {
            "create": (data) => this.createNewElement(this.currEvent, data, this.currItemsData)
        };
    }

    @ExportedFunction
    initialize(): void {
        let metadata = ProjectManagerMetaDataHolder.getWSPDomainMetaData(this.domainType);
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
            ComponentsCommunication.functionRequest(this.name, event.providedBy, "onRequestEditorAction", [event, concerned]);
        }
        else {
            let evtData = {
                mission: event.mission
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

    private createDialogueTitle(renderData, type) {
        let index = renderData.map(x=>x.type).indexOf("title");
        return (index >= 0) ? renderData[index].value.default.text : type;
    }
    private createDialogue (renderData, type, actions) {
        return {
            type: "simple",
            data: {
                title: "Create New "+this.createDialogueTitle(renderData, type),
                formElems: RenderPartsToPropertyData(renderData),
                actions: actions
            }
        };
    }

    @ExportedFunction
    public onAddProjectElement (event: IEventData, concerned: ProjectManagerElementView): void {
        this.currEvent = event;
        let dialoguesData = [];
        let types = concerned.getValidChildren();
        let projInstView = (<ProjectManagerView>this._view).getProject(concerned.projectID);
        assert(projInstView !== null);

        // specific element to select
        if ( (event.data && event.data["type"]) || types.length === 1 ) {
            let type = types.length === 1 ? types[0] : event.data["type"];
            let itemData = concerned.getChildElementData(type);
            let renderData = _.reverse(concerned.getReversedChildElementRenderData(type));
            
            dialoguesData.push(this.createDialogue(
                renderData,
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
                        callback: (data) => this.createNewElement(event, data, itemData)
                    }
                ]
            ));
        }
        // first dialogue choose type of element
        else {
            if (types.length > 1) {
                let titles = [];
                let dialogues = [];
                let itemsData = [];
                _.forEach(types, (type)=> {
                    let renderData = _.reverse(concerned.getReversedChildElementRenderData(type));
                    itemsData.push(concerned.getChildElementData(type));
                    let title = renderData[renderData.map(x=>x.type).indexOf("title")].value.default.text;
                    titles.push(title);
                    let dialogue = this.createDialogue(
                        renderData,
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
                                    this.createNewElement(event, data, itemsData[index]);
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
                        formElems: [{
                            descriptionID: "select_type_new_item",
                            name: "Type",
                            style: "",
                            selected: titles[0],
                            values: titles,
                            type: "select",
                            renderName: true,
                            indepedent: true
                        }],
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
            else {
                IDEError.raise(
                    "Error in the Project Manager Description",
                    "Not defined valid children which means that add new Item could not be exist as a choice in the "+concerned.name + "."
                );
            }
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

    public onRemoveElement(event: IEventData, concerned: any): boolean {
        return this._view["removeElement"] (concerned.projectId, concerned.elementId);
    }

    public onClickProjectElement(data): void {
        alert("clicked proj elem: projID( "+data.projectID+" ), systemID( "+data.systemID+" )");
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
    private createNewElement(event: IEventData, data: any, itemsData: any): void {
        alert("create new element not supported yet.");
        let index = itemsData.events.map(x => x.type).indexOf("click");
        assert(index !== -1, "Not defined event click for this specific element type.");
        let args = ( ({mission, providedBy, action}) => ({mission, providedBy, action}) ) (itemsData.events [index]);
        args.action = "factoryNewElement";
        ComponentsCommunication.functionRequest("ProjectManager", args.providedBy, args.action, [args, data]);
    }
}
