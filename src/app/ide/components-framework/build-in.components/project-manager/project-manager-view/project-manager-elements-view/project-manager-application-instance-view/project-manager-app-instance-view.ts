import { assert } from "./../../../../../../shared/ide-error/ide-error";
import { ViewRegistry } from "./../../../../../component/registry";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewEventRegistration } from "../../../../../component/view";
import { ProjectManagerCategoryView as CategoryView } from "./category-view/category-view";
import { ProjectManagerActionsView as ActionsView } from "./actions-view/actions-view";
import { ProjectManagerMenuView as MenuView } from "./menu-view/menu-view";
import { IProjectManagerElementData } from "../../../project-manager";

import * as _ from "lodash";

//import * as $ from "../../../../../../../../../node_modules/jstree/dist/jstree";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ProjectManagerAppInstanceViewTmpl from "./project-manager-app-instance-view.html";
import { PageFoldingView } from './../../../../../common-views/page-folding-view/page-folding-view';


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
    private menu: MenuView;
    private categories: Array<CategoryView>;
    private constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, hookSelector);
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

        this.foldingView = <PageFoldingView>ViewRegistry.getEntry("PageFoldingView").create(this.parent, "#project-folding-"+this.id);
        this.foldingView.setDefault();

        this.initElem("actions", data.meta.actions);
        this.initElem("menu", data.meta.actions);
        this.categories = new Array<CategoryView>();
        _.forEach(data.meta.categories, (category) => {
            category.isSubCategory = false;
            let categoryIndex: number = data.project.categories.map(e => e.type).indexOf(category.type);
            assert(categoryIndex >= 0);
            let categView = <CategoryView>ViewRegistry.getEntry("ProjectManagerCategoryView").create (
                this.parent,
                this.categoriesViewSelector,
                {
                    "meta": category,
                    "project": data.project.categories[categoryIndex]
                }
            );
            categView.clearSelectorArea = false;
            this.categories.push(categView);
        });
    }

    private initElem (type: string, data: any): void {
        if (data[type]) {
            let typeFU: string = type[0].toUpperCase() + type.substr(1);
            this[type] = ViewRegistry.getEntry("ProjectManager"+typeFU+"View").create(
                this.parent,
                this.categoriesViewSelector,
                data[type]
            );
            return;
        }
        this[type] = null;
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
    }

    public registerEvents(): void {
        this.attachEvents({
            eventType: "contextmenu",
            selector: ".project-manager-app-instance-info-actions-area",
            handler: (e) => this.menu.onRightClick(e)
        });
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

    public removeElement(elementId: string): boolean {
        let ids = elementId.split("$");
        return this.categories.map(cat=>cat.id).indexOf(ids.shift())["removeElement"](ids);
    }

    public addElement(path: string, elementData: IProjectManagerElementData): void {
        let ids = path.split("$");
        this.categories.map(cat=>cat.id).indexOf(ids.shift())["addElement"](ids, elementData);
    }
}
