import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import CategoryViewTmpl from "./category-view.tmpl";
import { ViewRegistry } from "../../../../../../component/registry";
import { ProjectManagerItemView } from "../item-view/item-view";

import { ProjectManagerElementView } from "../project-manager-element-view";

interface IMenuItem {
    title: string;
    img: string;
    help?: string;
    action: Array<IEventData>;
    submenu?: Array<IMenuItem>;
}

interface IEventData {
    callback: string;
    providedBy: string;
}

interface IEventItem extends IEventData {
    type: string;
}

interface ICategoryItem {
    type: string;
    title: string;
    img: string;
    menu: Array<IMenuItem>;
    events: Array<IEventItem>;
    validChildren?: Array<string>; // only for not leaf items
}

interface ICategoryMetaData {
    id: string;
    type: string;
    isLeaf: boolean;
    isSubCategory: boolean;
    nesting: number;
    renderParts: {};

    // elements for leaf category (not include categories element)
    validChildren?: Array<string>;
    items?: Array<ICategoryItem>;
}

interface IProjectCategoryElementData {
    type: string;
    title: string;
    img: string;
    children: Array<IProjectCategoryElementData>;
    innerdata: Array<any>;
}

interface IProjectCategoryItemData {
    type: string;
    title: string;
    img: string;
    menu: Array<IMenuItem>;
    validChildren: Array<string>;
    events: Array<IEventItem>;
}

//////////////////////////////////////////////


@ViewMetadata({
    name: "ProjectManagerCategoryView",
    templateHTML: CategoryViewTmpl
})
export class ProjectManagerCategoryView extends ProjectManagerElementView {
    private readonly menuSel;
    private readonly actionsSel;
    private readonly elemsSel;
    private info: ICategoryMetaData;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        protected data: any
    ) {
        super(
            parent,
            name,
            templateHTML,
            style,
            hookSelector,
            data.meta,
            data.path + data.meta.type + "/",
            data.parentTree,
            data.project._id
        );
        data.meta.isLeaf = ("categories" in data.meta) && data.meta.categories.length > 0;
        data.meta.id = this.id;
        this.menuSel = "#category-menu-"+this.id;
        this.actionsSel = "#category-actions-"+this.id;
        this.elemsSel = "#category-elements-"+this.id;
        this.info = (
            ({
                id,
                type,
                renderParts,
                isLeaf,
                isSubCategory,
                nesting
            }) => (
                {
                    id,
                    type,
                    renderParts,
                    isLeaf,
                    isSubCategory,
                    nesting
                }
            )
        ) (data.meta);
        let renderParts = {};
        _.forEach(this.info.renderParts, (elem) => renderParts[elem["type"]] = elem );

        this.info.renderParts = renderParts;

        let faType = this.info.isSubCategory ? "angle" : "caret";
        this.initFolding(
            "#category-folding-"+this.id,
            "#category-elements-"+this.id,
            { plus: "fa fa-"+faType+"-right", minus: "fa fa-"+faType+"-down" }
        );
        this.initActions(
            "#category-actions-"+this.id,
            [ {selector: ".actions-view-title-fa", styles: { css: { color: "white" } }} ]
        );
        //TODO: fix right click menu

        if (this.info.isLeaf) {
            this.initCategories();
        }
        // in case try to load project
        if (data.project && data.project.elements) {
            this.initElements(data.project.elements, data.meta, data.project._id);
        }
    }

    private addCategory (category): void {
        category.isSubCategory = true;
        category.nesting = this.info.nesting + 1;
        let categView = <ProjectManagerCategoryView>ViewRegistry.getEntry("ProjectManagerCategoryView").create(
            this.parent,
            this.elemsSel,
            {
                "parentTree": this,
                "meta": category,
                "project": this.data.project,
                "path": this.path
            }
        );
        categView.clearSelectorArea = false;
        this._children.categories.push(categView);
    }

    private initCategories (): void {
        this._children.categories = new Array<ProjectManagerElementView>();
        _.forEach(this.data.meta.categories, (category) => {
            this.addCategory(category);
        });
    }

    public createElement(data: any): any {
        
    }

    public addElement(itemData): void {
        let metaIndex = this.data.meta.items.map(x => x.type).indexOf(itemData.type);
        let itemView = <ProjectManagerElementView>ViewRegistry.getEntry("ProjectManagerItemView").create(
            this.parent,
            this.elemsSel,
            {
                "parentTree": this,
                "meta": this.data.meta.items[metaIndex],
                "projectID": this.data.project._id,
                "item": itemData,
                "path": this.path,
                "nesting": this.info.nesting + 1
            }
        );
        itemView.clearSelectorArea = false;
        this._children.items.push(itemView);
    }

    public removeElement(systemID: string): void {

    }

    private initElements (elements: Array<any>, meta: any, projectID: string): void {
        this._children.items = new Array<ProjectManagerElementView>();
        // filter elements
        let catElements = elements.filter(obj => { return obj.path === this.path });
        //
        for(let i=1; i<=catElements.length; ++i) {
            let itemData = catElements[ catElements.map(x=>x.orderNO).indexOf(i) ];
            this.addElement(itemData);
        }
    }

    private renderElem(type: string): void {
        if (this[type] && this[type] !== null) {
            this[type].render();
            this[type].hide();
        }
    }

    public render(): void {
        this.renderTmplEl(this.info);
        this.foldingView.render();
        this.renderElem("actions");

        _.forEach(this._children.items, (item)=> item.render());

        if (this.info.isLeaf) {
            _.forEach(<Array<View>>this._children.categories, (value) => {
                value.render();
            });
        }
        else if(this._children.items.length === 0) {
            $(this.elemsSel).empty();
            $(this.elemsSel).css("background", "rgb(230, 230, 230)");
            $(this.elemsSel).append (
                `<div class='small text-center align-middle' style='padding-top:15px; padding-bottom:15px; width:100%'>
                    No ` + this.info.renderParts["title"].value.text + ` are defined yet.
                </div>`
            );
        }

        // bootstrap adds hidden in overflow which destroys z-index in dropdown menu
        $("#category-elements-"+this.id).css("overflow", "");
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".project-manager-category-header-area",
                handler: (evt) => {
                    if (evt.target.classList[0] !== "page-folding-link-icon") {
                        if(this.foldingView) {
                            this.foldingView.onClick();
                        }
                    }
                }
            },
            {
                eventType: "mouseover",
                selector: ".project-manager-category-header-area",
                handler: (evt) => {
                    if (this.actions) {
                        this.actions.show();
                    }
                    // TODO: check if has to change colour and which colour has to set as new
                    $("#project-manager-category-header-area-"+this.id).css("background-color", "rgb(117, 115, 115)");
                }
            },
            {
                eventType: "mouseout",
                selector: ".project-manager-category-header-area",
                handler: (evt) => {
                    if (this.actions) {
                        this.actions.hide();
                    }
                    // TODO: check if has to change colour and which colour has to set as new
                    $("#project-manager-category-header-area-"+this.id).css("background-color", "rgb(80, 80, 80)");
                }
            }
        );
    }

    public setStyle(): void { ; }
}
