import { ViewRegistry } from "./../../../component/registry";
import { ComponentView, ComponentViewMetadata } from "../../../../components-framework/component/component-view";
import { ProjectManagerAppInstanceView as InstanceView, ProjectManagerAppInstanceView } from "./project-manager-elements-view/project-manager-application-instance-view/project-manager-app-instance-view";
import { ActionsView } from "./../../../common-views/actions-view/actions-view";
import { ProjectManagerMenuView as MenuView } from "./project-manager-elements-view/project-manager-application-instance-view/menu-view/menu-view";
import { IProjectManagerElementData } from "../project-manager";
import { ProjectManagerElementView } from "./project-manager-elements-view/project-manager-application-instance-view/project-manager-element-view";

/// <reference path="../../../../../../../node.d.ts"/>
import ProjectManagerTmpl from "./project-manager.tmpl";
import ProjectManagerSYCSS from "./project-manager.sycss";

import * as _ from "lodash";
import { runInDebugContext } from "vm";


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
    private currClickedElement: ProjectManagerElementView;
    private readonly appInstancesSelector = ".project-manager-app-instances-view-area";
    private info: IProjectManagerData;
    private skeletonDataProj: any;

    private actions: ActionsView;
    private menu: MenuView;
    private loadedProjects: Array<InstanceView>;

    public initialize(): void {
        this.renderData.id = this.id;
        this.info = (({ id, title, img, actions }) => ({ id, title, img, actions }))(this.renderData);
        this.skeletonDataProj = this.renderData.project;
        this.skeletonDataProj.defaultDomainImg = this.renderData.img;
        this.loadedProjects = new Array<InstanceView>();
        this.loadActions(this.renderData.actions);
        //this.menu = <MenuView>ViewRegistry.getEntry("ProjectManagerMenuView").create(this.parent, this.renderData.menu);
    }

    public onClickElement(element: ProjectManagerElementView) {
        //TODO: correct render functionality in order to be clean
        if (this.currClickedElement) {
            this.currClickedElement.select(false);
        }
        this.currClickedElement = element;
        this.currClickedElement.select(true);
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

    public removeElement(projectId: string, elementId: string): boolean {
        return this.loadedProjects.map(proj=>proj.id).indexOf(projectId)["removeElement"](elementId);
    }

    public addElement(projectId: string, element: IProjectManagerElementData): void {
        this.loadedProjects.map(proj=>proj.id).indexOf(projectId)["addElement"](element);
    }
}