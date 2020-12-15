import {
    ProjectItemView
} from "./project-manager-elements-view/project-manager-application-instance-view/item-view/item-view";
import { ViewRegistry } from "./../../../component/registry";
import { View } from "../../../../components-framework/component/view";
import { ComponentView, ComponentViewMetadata } from "../../../../components-framework/component/component-view";
import {
    ProjectInstanceView,
    ProjectInstanceView as InstanceView
} from "./project-manager-elements-view/project-manager-application-instance-view/project-instance-view";
import { ActionsView } from "./../../../common-views/actions-view/actions-view";
import {
    ProjectMenuView as MenuView
} from "./project-manager-elements-view/project-manager-application-instance-view/menu-view/menu-view";
import {
    ProjectManagerElementView
} from "./project-manager-elements-view/project-manager-application-instance-view/project-manager-element-view";

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
    name: "ProjectManagerJSTreeView",
    templateHTML: ProjectManagerTmpl,
    style: {
        system: ProjectManagerSYCSS
    }
})
export class ProjectManagerJSTreeView extends ComponentView {
    private currClickedElement: ProjectItemView;
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
            ProjectManagerElementView
                .getElementStyle("title", this.skeletonDataProj.domain)
        );
        this.skeletonDataProj.defaultDomainImg = this.renderData.img;
        this.loadedProjects = new Array<InstanceView>();
        this.loadActions(this.renderData.actions);
    }

    public onClickElement(element: any) {
        if (this.currClickedElement) {
            this.currClickedElement.state = "used";
        }
        this.currClickedElement = element;
        this.currClickedElement.state = "onFocus";
        //
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

    public pitemRename(pitem, projectId, data, options): void {
        let project = this.loadedProjects.find(inst => inst.dbID);
        project.pitemRename(pitem, data, options);
    }

    public loadActions(data: any): void {
        this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView")
            .create(
                this.parent,
                ".project-manager-actions-area",
                [
                    {
                        selector: ".actions-view-title-fa",
                        styles: {
                            css: {
                                color: "white"
                            }
                        }
                    }
                ],
                {
                    "fa": "fa-bars",
                    "actions": data
                }
            );
    }

    public loadMenu(data: any): void {
        this.menu = <MenuView>ViewRegistry.getEntry("ProjectManagerMenuView")
            .create(
                this.parent,
                ".project-manager-menu-area",
                {
                    "menu": data
                }
            );
    }

    public loadProject(data: any): ProjectInstanceView {
        let projectView = <InstanceView>ViewRegistry
            .getEntry("ProjectInstanceView")
            .create(
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

        return projectView;
    }

    public updateProject(project: any): void {
        let projectView = this.getProject(project._id);
        projectView.updateProjectData(project);
        projectView.render();
    }

    public getProject(projectID): ProjectInstanceView {
        let project = this.loadedProjects
            .find(x => x["projectID"] === projectID);
        return project ? project : null;
    }

    public getProjectCategory(projectID: string, categID: string) {
        let project = this.getProject(projectID);
        return project.getProjectElement(categID);
    }

    public getPItem(projectID: string, pitemID: string) {
        let project = this.getProject(projectID);
        return project.getProjectElement(pitemID);
    }

    public loadProjects(data: any): void {
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

    public closeProject(projectId: string): void {
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

        assert(
            project !== null,
            "<ProjectManagerView> On Remove element not found project with ID: "
            + projectID
        );

        return project.removeElement(elementID);
    }
}