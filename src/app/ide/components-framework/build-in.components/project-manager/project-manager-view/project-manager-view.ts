import {
    ProjectItemViewState,
    ProjectManagerItemView
} from './project-manager-elements-view/project-manager-application-instance-view/item-view/item-view';
import { ViewRegistry } from "./../../../component/registry";
import { View } from "../../../../components-framework/component/view";
import { ComponentView, ComponentViewMetadata } from "../../../../components-framework/component/component-view";
import {
    ProjectManagerAppInstanceView as InstanceView,
    ProjectManagerAppInstanceView
} from "./project-manager-elements-view/project-manager-application-instance-view/project-manager-app-instance-view";
import { ActionsView } from "./../../../common-views/actions-view/actions-view";
import {
    ProjectManagerMenuView as MenuView
} from "./project-manager-elements-view/project-manager-application-instance-view/menu-view/menu-view";
import { IProjectManagerElementData } from "../project-manager";
import { ProjectManagerElementView } from "./project-manager-elements-view/project-manager-application-instance-view/project-manager-element-view";

/// <reference path="../../../../../../../node.d.ts"/>
import ProjectManagerTmpl from "./project-manager.tmpl";
import ProjectManagerSYCSS from "./project-manager.sycss";

import * as _ from "lodash";
import { assert } from "./../../../../shared/ide-error/ide-error";


interface IProjectManagerEvent {
    type: string;
    callback: string;
    providedBy: string;
}

interface IProjectManagerAction {
    title: string;
    img: string;
    help: string;
    events: Array<IProjectManagerEvent>;
}

interface IProjectManagerData {
    id: string;
    title: string;
    img: string;
    actions: Array<IProjectManagerAction>;
}

@ComponentViewMetadata({
    name: "ProjectManagerView",
    templateHTML: ProjectManagerTmpl,
    style: {
        system: ProjectManagerSYCSS
    }
})
export class ProjectManagerView extends ComponentView {
    private currClickedElement: ProjectManagerItemView;
    private readonly appInstancesSelector = ".project-manager-app-instances-view-area";
    private info: IProjectManagerData;
    private skeletonDataProj: any;

    private actions: ActionsView;
    private menu: MenuView;
    private loadedProjects: Array<InstanceView>;

    public initialize(): void {
        this.renderData.id = this.id;
        this.info = (({ id, title, img, actions }) =>
                ({ id, title, img, actions }))(this.renderData);
        this.skeletonDataProj = this.renderData.project;
        this.skeletonDataProj.domain = this.renderData.domain;
        ProjectManagerElementView.setElementsStyle(this.renderData.style);
        this._styles = View.MergeStyle(
            this._styles,
            ProjectManagerElementView.getElementStyle("title", this.skeletonDataProj.domain)
        );
        this.skeletonDataProj.defaultDomainImg = this.renderData.img;
        this.loadedProjects = new Array<InstanceView>();
        this.loadActions(this.renderData.actions);
    }

    public onClickElement(element: ProjectManagerItemView) {
        if (this.currClickedElement) {
            this.currClickedElement.state = "used";
        }
        this.currClickedElement = element;
        this.currClickedElement.state = "onFocus";
    }

    public changeSelectedItem (projectID: string, systemID: string) {
        let indexProj = this.loadedProjects.map(x=>x["projectID"]).indexOf(projectID);
        let newClickedElement = <ProjectManagerItemView>this.loadedProjects[indexProj].findElementWSystemID(systemID);
        assert(newClickedElement !== null, "Not found item with systemID: "+systemID + " to change selected item in the Project Manager.");
        this.onClickElement(newClickedElement);
    }

    public onRemoveElement(element: ProjectManagerElementView) {
        element.destroy();
    }

    public render(callback?: Function): void {
        this.renderTmplEl(this.info);
        this.actions.render();
        //this.menu.render();
        // clear project manager instances
        $(this.appInstancesSelector).empty();
        _.forEach(this.loadedProjects, (loadedProject: InstanceView) => {
            loadedProject.render();
        });
    }

    public registerEvents(): void {
        this.attachEvents({
            eventType: "contextmenu",
            selector: ".project-manager-info-actions-area",
            handler: (e) => this.menu.onRightClick(e)
        });
    }

    public loadActions (data: any): void {
        this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView").create(
            this.parent,
            ".project-manager-actions-area",
            [ {selector: ".actions-view-title-fa", styles: { css: { color: "white" } }} ],
            { "fa": "fa-bars", "actions": data }
        );
    }

    public loadMenu (data: any): void {
        this.menu = <MenuView>ViewRegistry.getEntry("ProjectManagerMenuView").create(
            this.parent,
            ".project-manager-menu-area",
            { "menu": data }
        );
    }

    public loadProject (data: any): void {
        let projectView = <InstanceView>ViewRegistry.getEntry("ProjectManagerAppInstanceView").create (
            this.parent,
            this.appInstancesSelector,
            {
                "project": data,
                "meta": this.skeletonDataProj
            }
        );
        projectView["projectID"] = data._id;
        projectView.clearSelectorArea = false;

        this.loadedProjects.push(projectView);

        projectView.render();
    }

    public getProject(projectID): ProjectManagerAppInstanceView {
        let index = this.loadedProjects.map(x=>x["projectID"]).indexOf(projectID);
        return index > -1 ? this.loadedProjects[index] : null;
    }

    public loadProjects (data: any): void {
        _.forEach(data.projects, (project) => {
            this.loadProject(project);
        });
    }

    public openProject(data: any): void {
        this.loadProject(data);
        let loadedProject = _.last(this.loadedProjects);
        loadedProject.render();
    }

    public setState (state: ProjectItemViewState, projectID: string, systemID: string): boolean {
        let project = this.getProject(projectID);
        assert(project !== null, "<ProjectManagerView> On setState item not found project with ID: " + projectID);
        return project.setState(state, systemID);
    }

    private removeProject(index: number): void {
        this.loadedProjects[index].destroy();
        $("#" + this.loadedProjects[index].id).remove();
        this.loadedProjects.splice(index, 1);
    }

    public closeProject (projectId: string): void {
        let index = this.loadedProjects.map(e => e.id).indexOf(projectId);
        this.removeProject(index);
    }

    public closeAllProjects(): void {
        while (this.loadedProjects.length !== 0) {
            this.removeProject(0);
        }
    }

    public removeElement(projectID: string, elementID: string): boolean {
        let project = this.getProject(projectID);
        assert(project !== null, "<ProjectManagerView> On Remove element not found project with ID: " + projectID);
        return project.removeElement(elementID);
    }

    public addElement(projectId: string, element: IProjectManagerElementData): void {
        let index = this.loadedProjects.map(proj=>proj.id).indexOf(projectId);
        this.loadedProjects[index].addElement(element);
    }
}