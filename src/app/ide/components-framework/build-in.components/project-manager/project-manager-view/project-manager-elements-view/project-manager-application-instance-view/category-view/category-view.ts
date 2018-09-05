import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import CategoryViewTmpl from "./category-view.tmpl";
import { ActionsView } from "./../../../../../../common-views/actions-view/actions-view";
import { ProjectManagerMenuView as MenuView } from "../menu-view/menu-view";
import { ViewRegistry } from "../../../../../../component/registry";
import { ProjectManagerItemView } from "../item-view/item-view";

import { PageFoldingView } from './../../../../../../common-views/page-folding-view/page-folding-view';

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

interface JSTreeCategoryElementStateData {
    opened: boolean;
    selected: boolean;
    loaded: boolean;
    disabled: boolean;
}

interface JSTreeElementData {
    id: string;
    type: string;
    text: string;
    icon: string;
    state: JSTreeCategoryElementStateData;
    children: Array<JSTreeElementData>;
}

interface JSTreeTypeItemData {
    max_children?: number;
    max_depth?: number;
    icon?: string;
    valid_children: Array<string>;
}

interface JSTreeMenuItemData {
    label: string;
    action: Function;
    title?: string; // tooltip
    icon?: string;
    submenu?: JSTreeMenuData;
}

interface JSTreeMenuData {
    [item: string]: JSTreeMenuItemData;
}


@ViewMetadata({
    name: "ProjectManagerCategoryView",
    templateHTML: CategoryViewTmpl
})
export class ProjectManagerCategoryView extends View {
    private path: string;
    private readonly menuSel;
    private readonly actionsSel;
    private readonly elemsSel;
    private info: ICategoryMetaData;
    private actions: ActionsView;
    private menu: MenuView;

    // only for category includes categories
    private elements?: Array<View>;
    // only for category not include categories
    private items: Array<ProjectManagerItemView>;
    private foldingView: PageFoldingView;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.path = data.path + data.meta.type + "/";
        data.meta.isLeaf = ("categories" in data.meta) && data.meta.categories.length > 0;
        data.meta.id = this.id;
        this.menuSel = "#category-menu-"+this.id;
        this.actionsSel = "#category-actions-"+this.id;
        this.elemsSel = "#category-elements-"+this.id;
        this.info = (({ id, type, renderParts, isLeaf, isSubCategory, nesting }) => ({ id, type, renderParts, isLeaf, isSubCategory, nesting })) (data.meta);
        let renderParts = {};
        _.forEach(this.info.renderParts, (elem) => {
            renderParts[elem["type"]] = elem; 
        });
        this.info.renderParts = renderParts;
        
        this.initFolding();
        this.initActions(data.meta.actions);
        //TODO: fix right click menu

        if (this.info.isLeaf) {
            this.initCategories(data);
        }
        // in case try to load project
        this.items = [];
        if (data.project && data.project.elements) {
            this.initElements(data.project.elements, data.meta, data.project._id);
        }
    }

    private initFolding() {
        this.foldingView = <PageFoldingView>ViewRegistry.getEntry("PageFoldingView").create(this.parent, "#category-folding-"+this.id);
        this.foldingView.setPFSelector("#category-elements-"+this.id);
        this.foldingView.setFoldIcon(
            this.info.isSubCategory ?
                { plus: "fa fa-angle-right", minus: "fa fa-angle-down" } :
                { plus: "fa fa-caret-right", minus: "fa fa-caret-down" }
        );
    }

    private initActions(data:any) {
        if (data.length > 0) {
            this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView").create(
                this.parent,
                "#category-actions-"+this.id,
                [ {selector: ".actions-view-title-fa", styles: { css: { color: "white" } }} ],
                { "actions": data }
            );
        }
    }

    private initCategories (data: any): void {
        this.elements = new Array<View>();
        _.forEach(data.meta.categories, (category) => {
            category.isSubCategory = true;
            category.nesting = this.info.nesting+1;
            let categView = ViewRegistry.getEntry("ProjectManagerCategoryView").create(
                this.parent,
                this.elemsSel,
                {
                    "meta": category,
                    "project": data.project,
                    "path": this.path
                }
            );
            categView.clearSelectorArea = false;
            this.elements.push(categView);
        });
    }
    private initElements (elements: Array<any>, meta: any, projectID: string): void {
        // filter elements
        let catElements = elements.filter(obj => { return obj.path === this.path });
        //
        for(let i=1; i<=catElements.length; ++i) {
            let itemData = catElements[ catElements.map(x=>x.orderNO).indexOf(i) ];
            let metaIndex = meta.items.map(x=>x.type).indexOf(itemData.type);
            let itemView = <ProjectManagerItemView>ViewRegistry.getEntry("ProjectManagerItemView").create(
                this.parent,
                this.elemsSel,
                {
                    "meta": meta.items[metaIndex],
                    "projectID": projectID,
                    "item": itemData,
                    "path": this.path,
                    "nesting": this.info.nesting+1
                }
            );
            itemView.clearSelectorArea = false;
            this.items.push(itemView);
        }
    }

    private constructMenuItem(item: IMenuItem, data: any): JSTreeMenuItemData {
        let element: JSTreeMenuItemData = {
            label: item.title,
            action: (id: string) => this.parent["onClickMenuItem"](
                (data.path?data.path+"$":"")+this.id+"$"+id,
                item.action,
                data.project.id
            )
        };
        if (item.help) {
            element.title = item.help;
        }
        if (item.img) {
            element.icon = item.img;
        }
        if (item.submenu) {
            element.submenu = {};
            _.forEach(item.submenu, (subItem) => {
                element.submenu[subItem.title] = this.constructMenuItem(subItem, data);
            });
        }
        return element;
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
        
        _.forEach(this.items, (item)=> item.render());

        if (this.info.isLeaf) {
            _.forEach(<Array<View>>this.elements, (value) => {
                value.render();
            });
        }
        else if(this.items.length === 0) {
            $(this.elemsSel).empty();
            $(this.elemsSel).css("background", "rgb(230, 230, 230)");
            $(this.elemsSel).append("<div class='small text-center align-middle' style='padding-top:15px; padding-bottom:15px; width:100%'>No " + this.info.renderParts["title"].value.text + " are defined yet.</div>");
        }

        //bootstrap adds hidden in overflow which destroys z-index in dropdown menu
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

    public addElement (ids, element): void {
        
    }

    public removeElement (id: string): void {
        
    }
}
