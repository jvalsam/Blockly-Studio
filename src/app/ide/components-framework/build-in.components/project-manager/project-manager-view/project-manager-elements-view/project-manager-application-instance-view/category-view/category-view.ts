import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import CategoryViewTmpl from "./category-view.html";
import { ProjectManagerActionsView as ActionsView } from "../actions-view/actions-view";
import { ProjectManagerMenuView as MenuView } from "../menu-view/menu-view";
import { ViewRegistry } from "../../../../../../component/registry";
import { IProjectManagerElementData } from "../../../../project-manager";

import $ from "jstree";

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
    title: string;
    type: string;
    isLeaf: boolean;
    img?: string;

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
    private readonly menuSel;
    private readonly actionsSel;
    private readonly categElemsSel;
    private info: ICategoryMetaData;
    private actions: ActionsView;
    private menu: MenuView;

    // only for category includes categories
    private elements?: Array<View>;
    // only for category not include categories
    private items: Array<IProjectCategoryItemData>;
    private jstreeElements: Array<JSTreeElementData>;
    private jstreeTypes: { [type: string]: JSTreeTypeItemData };
    private jstreeMenuItems: {[type: string] : JSTreeMenuData};

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, hookSelector);
        data.meta.isLeaf = "categories" in data.meta;
        this.menuSel = "#category-menu-"+this.id;
        this.actionsSel = "#category-actions-"+this.id;
        this.categElemsSel = "#category-elements-"+this.id;
        this.info = (({ title, type, isLeaf, img }) => ({ title, type, isLeaf, img })) (data.meta);
        this.initContainer("actions", data.meta);
        this.initContainer("menu", data.meta);
        if (this.info.isLeaf) {
            this.initCategories(data);
        }
        else if (data.meta.items) {
            this.initElements(data);
        }
        // create empty root with no items
        else {
            this.initWithoutItems(data);
        }
    }
    private initContainer(type: string, data: any): void {
        if (data[type]) {
            let typeFU: string = type[0].toUpperCase() + type.substr(1);
            this[type] = ViewRegistry.getEntry("ProjectManager" + typeFU + "View").create(
                this.parent,
                this[type+"Sel"],
                data[type]
            );
            return;
        }
        this[type] = null;
    }
    private initCategories (data: any): void {
        this.elements = new Array<View>();
        _.forEach(data.meta.categories, (category) => {
            let categView = ViewRegistry.getEntry("ProjectManagerCategoryView").create(
                this.parent,
                this.categElemsSel,
                {
                    "meta": category,
                    "project": data.project,
                    "path": (data.path ? data.path+"$" : "")+this.id
                }
            );
            categView.clearSelectorArea = false;
            this.elements.push(categView);
        });
    }
    private initElements (data: any): void {
        this.items = data.meta.items;
        // jstree types
        this.jstreeTypes = {};
        this.jstreeTypes["#"] = { "max_children": 1, "max_depth": 4, "valid_children": this.items.map(x=>x.type) };
        this.jstreeMenuItems = {};
        _.forEach(this.items, (item) => {
            this.jstreeTypes[item.type] = { "icon": item.img, "valid_children": item.validChildren };
            this.jstreeMenuItems[item.type] = {};
            _.forEach(item.menu, (menuItem) => {
                this.jstreeMenuItems[item.type][menuItem.title] = this.constructMenuItem(menuItem, data);
            });
        });
    }

    private initWithoutItems (data: any) {
        this.jstreeTypes = {};
        this.jstreeTypes["#"] = { "max_children": 1, "max_depth": 4, "valid_children": [data.meta.type] };
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
        if (this[type] !== null) {
            this[type].render();
            this.appendLocal(".app-instance-" + type, this[type].$el);
        }
    }

    public render(): void {
        this.renderTmplEl(this.info);
        this.renderElem("actions");
        this.renderElem("menu");
        this.setStyle();
        if (this.info.isLeaf) {
            _.forEach(<Array<View>>this.elements, (value) => {
                value.render();
                this.appendLocal("#category-elements-" + this.id, value.$el);
            });
        }
        else {
            $("#category-elements-" + this.id).jstree({
                core: {
                    "check_callback": true,
                    "data": this.elements
                },
                types: this.jstreeTypes,
                plugins: [
                    "contextmenu", "dnd", "search", "state", "types", "wholerow"
                ],
                contextmenu: {
                    items: (node) => this.jstreeMenuItems[node.type]
                }
            });
        }
    }

    public registerEvents(): void {;}

    public setStyle(): void { ; }

    public removeElement(ids: Array<string>): boolean {
        if (this.info.isLeaf) {
            let tree = $("#category-elements-" + this.id).jstree(true);
            tree.delete_node([
                tree.get_node("#" + ids[0])
            ]);
        }
        else {
            return this.elements.map(scat => scat.id).indexOf(ids.shift())["removeElement"](ids);
        }
    }

    public addElement(ids: Array<string>, elementData: IProjectManagerElementData): void {
        if (this.info.isLeaf) {
            // case to add element in the root of the category => "first"
            // case to add element inside jstree => "inside"
            let position = ids[0] === this.id ? "first" : "inside";

            let parent = $("#category-elements-" + this.id).jstree(true).get_node("#"+ids[0]);
            let newNode = {
                state: "open",
                data: {
                    id: elementData.id,
                    type: elementData.type,
                    text: elementData,
                    parent: ids[0]
                }
            };
            $("#category-elements-" + this.id).jstree(
                "create_node",
                parent,
                newNode,
                position,
                false,
                false
            );
        }
        else {
            this.elements.map(scat => scat.id).indexOf(ids.shift())["addElement"](ids, elementData);
        }
    }
}
