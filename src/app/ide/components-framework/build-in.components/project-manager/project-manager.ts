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
            "create": (data) => this.createNewElement(data)
        };
    }

    @ExportedFunction
    initialize(): void {
        let metadata = ProjectManagerMetaDataHolder.getWSPDomainMetaData(this.domainType);
        this._view.setRenderData(metadata);
        this._view.initialize();
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
    private onOuterFunctionRequest (event: IEventData, data: any): void {
        if (event.providedBy === "EditorManager") {
            ComponentsCommunication.functionRequest(this.name, event.providedBy, "onRequestEditorAction", [event, data]);
        }
        else {
            ComponentsCommunication.functionRequest(this.name, event.providedBy, <string>event.action, [{ mission: event.mission }, data]);
        }
    }

    @ExportedFunction
    public onCreateNewProject(data): void {
        alert("onCreateNewProject not developed yet!");
        this._view["openProject"]();
    }

    @ExportedFunction
    public onOpenProject(data): void {
        alert("onOpenProject not developed yet!");
    }

    @ExportedFunction
    public onCloseAllProjects(): void {
        alert("onCloseAllProjects not developed yet!");
        this._view["closeAllProjects"]();
    }

    @ExportedFunction
    public onDeleteProject(data): void {
        this.deleteProject(data.id);
        this._view["closeProject"](data.id);
    }

    @ExportedFunction
    public onDeleteAllProjects(): void {
        alert("onDeleteAllProjects not developed yet!");
        this._view["closeAllProjects"]();
    }

    @ExportedFunction
    public addProjectElement(data): void {
        this._view["addElement"] (data.projectID, data.element);
    }

    @ExportedFunction
    public onRenameProject(data): void {
        alert("onRenameProject not developed yet!");
    }

    @ExportedFunction
    public onShareProject(data): void {
        alert("onShareProject not developed yet!");
    }

    @ExportedFunction
    public onClickProjectProperties(data): void {
        alert("onClickProjectProperties not developed yet!");
    }

    @ExportedFunction
    public onCloseProject(data): void {
        alert("onCloseProject not developed yet!");
    }

    @ExportedFunction
    public onAddProjectElement (data): void {
        alert("onAddProjectElement not developed yet!");
    }

    @ExportedFunction
    public onDeleteAllElements(data): void {
        
    }

    public onClickMenuItem (event: IEventData, data): void {
        if (event.providedBy === "Platform") {
            this[<string>event.action] (data.itemId, data.projectId);
        }
        else {
            this.onOuterFunctionRequest(event, [{"itemId": data.itemId, "projectId": data.projectId}]);
        }
    }

    public onRemoveElement(data): boolean {
        return this._view["removeElement"] (data.projectId, data.elementId);
    }

    public onClickProjectElement(data): void {
        alert("clicked proj elem: projID( "+data.projectID+" ), systemID( "+data.systemID+" )");
    }

    private onModalChoiceAction(action, data, cancelAction) {
        if (!this._modalActions[action]) {
            IDEError.warn("Not supported action is requested", "Action "+action+" is not suppoerted by the Project Manager.", "Project Manager");
            cancelAction();
        }

        this._modalActions[action] (data);
    }

    // Modal Actions are statically supported
    private createNewElement(data) {

    }
}
