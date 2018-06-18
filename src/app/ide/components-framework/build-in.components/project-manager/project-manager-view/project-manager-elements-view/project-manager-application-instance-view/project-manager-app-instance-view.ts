import { assert } from "./../../../../../../shared/ide-error/ide-error";
import { ViewRegistry } from "./../../../../../component/registry";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewEventRegistration } from "../../../../../component/view";
import { ProjectManagerCategoryView as CategoryView } from "./category-view/category-view";
import { ProjectManagerActionsView as ActionsView } from "./actions-view/actions-view";
import { ProjectManagerMenuView as MenuView } from "./menu-view/menu-view";
import { IProjectManagerElementData } from "../../../project-manager";

import * as _ from "lodash";
import * as $ from "jstree";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ProjectManagerAppInstanceViewTmpl from "./project-manager-app-instance-view.html";


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
    private info: IAppInstanceData;
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
        this.info = (({ id, title, img, actions, menu }) => ({ id, title, img, actions, menu }))(data.project);
        this.initElem("actions", data);
        this.initElem("menu", data);
        _.forEach(data.meta, (category) => {
            let categoryIndex: number = data.project.map(e => e.type).indexOf(category.type);
            assert(categoryIndex >= 0);
            this.categories.push (
                <CategoryView>ViewRegistry.getEntry("ProjectManagerCategoryView").create (
                    this.parent,
                    {
                        "meta": category,
                        "project": data.project[categoryIndex]
                    }
                )
            );
        });
    }

    private initElem (type: string, data: any): void {
        if (data[type]) {
            let typeFU: string = type[0].toUpperCase() + type.substr(1);
            this[type] = ViewRegistry.getEntry("ProjectManager"+typeFU+"View").create(this.parent, data[type]);
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
        this.renderTmplEl(this.info);
        this.renderElem("actions");
        this.renderElem("menu");
        _.forEach(this.categories, (category) => {
            category.render();
            this.$el.find("#categories-"+this.id).append(category.$el);
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
