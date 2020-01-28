import { ProjectItemViewState } from './item-view/item-view';
import { ViewRegistry } from "./../../../../../component/registry";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../component/view";
import { ProjectManagerCategoryView as CategoryView } from "./category-view/category-view";
import { ActionsView } from "./../../../../../common-views/actions-view/actions-view";
import { IProjectManagerElementData } from "../../../project-manager";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ProjectManagerAppInstanceViewTmpl from "./project-manager-app-instance-view.tmpl";
import { PageFoldingView } from './../../../../../common-views/page-folding-view/page-folding-view';
import { ProjectManagerElementView } from "./project-manager-element-view";


interface IAppInstanceEvent {
    type: string;
    callback: string;
    providedBy: string;
}

interface IAppInstanceAction {
    title: string;
    img: string;
    help?: string;
    events: Array<IAppInstanceEvent>;
};
interface IAppInstanceMenuItem extends IAppInstanceAction {};

interface IAppInstanceData {
    id: string;
    title: string;
    img: string;
    actions: Array<IAppInstanceAction>;
    menu: Array<IAppInstanceMenuItem>;
};

@ViewMetadata({
    name: "ProjectManagerAppInstanceView",
    templateHTML: ProjectManagerAppInstanceViewTmpl
})
export class ProjectManagerAppInstanceView extends View {
    private readonly categoriesViewSelector;
    private foldingView: PageFoldingView;

    private renderData: any;
    private actions: ActionsView;
    private categories: Array<CategoryView>;
    private constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(
            parent,
            name,
            templateHTML,
            View.MergeStyle(
                style,
                ProjectManagerElementView
                    .getElementStyle("title", data.meta.domain)
            ),
            hookSelector
        );
        data.id = this.id;
        this.categoriesViewSelector = "#categories-" + this.id;
        this.renderData = {
            id: this.id,
            instance: {
                id: data.project._id,
                title: data.project.title,
                img: data.project.img,
            },
            defaultDomainImg: data.meta.defaultDomainImg
        };

        this.foldingView = <PageFoldingView>ViewRegistry
            .getEntry("PageFoldingView")
            .create(this.parent, "#project-folding-"+this.id);
        this.foldingView
            .setPFSelector("#folding-app-instance-categories-"+this.id);

        this.initActions(data.meta.actions);

        this.initElem("menu", data.meta.actions);
        this.categories = new Array<CategoryView>();

        _.forEach(data.meta.categories, (category) => {
            category.isSubCategory = false;
            category.nesting = 1;

            let categView = <CategoryView>ViewRegistry
                .getEntry("ProjectManagerCategoryView")
                .create (
                    this.parent,
                    this.categoriesViewSelector,
                    {
                        "meta": category,
                        "project": data.project,
                        "path": "/"
                    }
                );
            categView.clearSelectorArea = false;
            this.categories.push(categView);
        });
    }

    private initActions(data) {
        if (data.length > 0) {
            this.actions = <ActionsView>ViewRegistry
                .getEntry("ActionsView")
                .create(
                    this.parent,
                    "#app-instance-actions-"+this.id,
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
                        "actions": data
                    }
                );
        }
    }

    private initElem (type: string, data: any): void {
        if (data[type]) {
            let typeFU: string = type[0].toUpperCase() + type.substr(1);
            this[type] = ViewRegistry
                    .getEntry("ProjectManager"+typeFU+"View")
                    .create(
                        this.parent,
                        this.categoriesViewSelector,
                        data[type]
                    );
            return;
        }
        this[type] = null;
    }

    public setState(state: ProjectItemViewState, systemID: string): boolean {
        let setted: boolean = false;
        _.forEach(this.categories, (category) => {
            setted = category.setState(state, systemID);
            if (setted) {
                return false;
            }
        });
        return setted;
    }

    private renderElem(type: string): void {
        if (this[type] !== null) {
            this[type].render();
            this.appendLocal(".app-instance-"+type, this[type].$el);
        }
    }

    public render(): void {
        this.renderTmplEl(this.renderData);
        this.foldingView.render();
        this.renderElem("actions");
        this.renderElem("menu");

        $(this.categoriesViewSelector).empty();
        _.forEach(this.categories, (category) => {
            category.render();
        });

        // bootstrap adds hidden in overflow which destroys z-index in dropdown menu
        $("#folding-app-instance-categories-"+this.id).css("overflow", "");
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "contextmenu",
                selector: ".project-manager-app-instance-info-actions-area",
                handler: (evt) => {
                    evt.preventDefault();
                    this.actions.open(evt);
                }
            },
            {
                eventType: "click",
                selector: ".project-manager-app-instance-info-actions-area",
                handler: (evt) => {
                    if (!this.actions.isOnTarget(evt.target)) {
                        if(this.foldingView) {
                            this.foldingView.onClick();
                        }
                    }
                }
            },
            {
                eventType: "mouseover",
                selector: ".project-manager-app-instance-info-actions-area",
                handler: (evt) => {
                    // TODO: check if functionality of actions hidden is enable
                    if (this.actions) this.actions.show();

                    // TODO: check if mouseover changes colour in current domain meta and set respective style
                    $("#project-manager-app-instance-info-"+this.id)
                        .css("background-color", "rgb(117, 115, 115)");
                }
            },
            {
                eventType: "mouseout",
                selector: ".project-manager-app-instance-info-actions-area",
                handler: (evt) => {
                    // check if functionality of actions hidden is enable
                    if (this.actions) {
                        this.actions.hide();
                    }
                    // check if mouseover changes colour in current domain meta and set respective style
                    $("#project-manager-app-instance-info-"+this.id)
                        .css("background-color", "rgb(80, 80, 80)");
                }
            }
        );
    }

    public setStyle(): void {
        ;
    }

    public destroy(): void {
        super.destroy();
        $("#" + this.id).find("div:jstree").each(function (): void {
            $(this).jstree("destroy");
        });
    }

    public removeElement(elementID: string): boolean {
        let removed: boolean = false;
        _.forEach(this.categories, (category) => {
            removed = category.removeElement(elementID);
            if (removed) {
                return false;
            }
        });
        return removed;
    }

    public addElement(element: IProjectManagerElementData): void {
        let ids = element.path.split("/");
        this.categories.map(cat=>cat.id)
            .indexOf(ids.shift())["addElement"](ids, element);
    }

    public hasElement(name: string): boolean {
        let found = false;
        _.forEach(this.categories, (category) => {
            if (category.name === name || category.hasElement(name)) {
                found = true;
                return false;
            }
        });
        return found;
    }

    private findElementHelper(data: string, type: string): ProjectManagerElementView {
        let element: ProjectManagerElementView = null;
        _.forEach(this.categories, (category)=> {
            element = category.findElement(name, type);
            if (element) {
                return false;
            }
        });
        return element;
    }
    public findElementWSystemID(systemID: string): ProjectManagerElementView {
        return this.findElementHelper(systemID, "systemID");
    }
    public findElementWPath(path: string): ProjectManagerElementView {
        return this.findElementHelper(path, "path");
    }
    public findElementWName(name: string): ProjectManagerElementView {
        return this.findElementHelper(name, "name");
    }

    public hasChild(name: string, parentPath: string): boolean {
        let parent = null;
        _.forEach(this.categories, (category) => {
            let parent = this.findElementWPath(parentPath);
            if (parent) {
                return false;
            }
        });
        if (parent) {
            return parent.findElementWName(name);
        }
        return false;
    }
}
