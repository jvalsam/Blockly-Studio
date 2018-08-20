import { assert } from './../../../shared/ide-error/ide-error';
import { ComponentsCommunication, ComponentCommAddFunction } from './../../component/components-communication';
import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { ProjectManagerMetaDataHolder } from "./project-manager-meta-map";
import { ProjectManagerView } from './project-manager-view/project-manager-view';

import * as _ from "lodash";

// initialize the metadata of the project manager component for registration in the platform
ProjectManagerMetaDataHolder.initialize();
var menuJson = ProjectManagerMetaDataHolder.getDomainsMenuJSON();
var configJson = ProjectManagerMetaDataHolder.getDomainsConfigJSON();

export interface IProjectManagerElementData {
    id: string;
    type: string;
    title: string;
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
        if (this.isOpen) {
            this.initialize();
        }
        _.forEach(ProjectManagerMetaDataHolder.getDomainNames(), (domain: string) => {
            let funcName = "onConfig"+domain;
            this[funcName] = () => this.onConfig(domain);
            ComponentCommAddFunction(this.name, funcName, 0);
        })
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
        (<ProjectManagerView>this._view).loadProject(project);
    }

    @ExportedFunction
    public loadProject(project): void {

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
    private onOuterFunctionRequest (providedBy: string, callback: string, data: Array<any>): void {
        ComponentsCommunication.functionRequest(this.name, providedBy, callback, data);
    }

    @ExportedFunction
    public onCreateNewProject(): void {
        alert("onCreateNewProject not developed yet!");
        this._view["openProject"]();
    }

    @ExportedFunction
    public onOpenProject(projectId: string): void {
        alert("onOpenProject not developed yet!");
    }

    @ExportedFunction
    public onCloseAllProjects(): void {
        alert("onCloseAllProjects not developed yet!");
        this._view["closeAllProjects"]();
    }

    @ExportedFunction
    public onDeleteProject(id: string): void {
        this.deleteProject(id);
        this._view["closeProject"](id);
    }

    @ExportedFunction
    public onDeleteAllProjects(): void {
        alert("onDeleteAllProjects not developed yet!");
        this._view["closeAllProjects"]();
    }

    @ExportedFunction
    public addProjectElement(projectId: string, path: string, elementData: IProjectManagerElementData): void {
        this._view["addElement"](projectId, path, elementData);
    }

    public onClickMenuItem (itemId: string, action: {callback: string, providedBy: string}, projectId: string): void {
        if (action.providedBy === "Platform") {
            this[action.callback] (itemId, projectId);
        }
        else {
            this.onOuterFunctionRequest(action.providedBy, action.callback, [{"itemId": itemId, "projectId": projectId}]);
        }
    }

    public onRemoveElement(elementId: string, projectId: string): boolean {
        return this._view["removeElement"] (projectId, elementId);
    }
}
