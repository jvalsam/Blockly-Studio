import { ViewRegistry } from "../../../../../component/registry";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../component/view";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ProjectManagerAppInstanceViewTmpl from "./project-manager-app-instance-view.tmpl";
import { PageFoldingView } from "../../../../../common-views/page-folding-view/page-folding-view";
import { ProjectManagerElementView } from "./project-manager-element-view";
import { assert } from "../../../../../../../ide/shared/ide-error/ide-error";
import { ProjectElement } from "./project-element";
import { ProjectCategory } from "./project-category";
import { ProjectItem } from "./project-item";


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

interface _IJSTreeNode {
    id: string; // will be autogenerated if omitted
    type: string;
    text: string; // node text
    color?: string; // vertical color
    icon?: string; // string for custom
    highlighted?: {};
    options?: boolean;
    connection_state?: string;
    shared_state?: string;
    state?: {
        opened?: boolean;  // is the node open
        disabled?: boolean;  // is the node disabled
        selected?: boolean;  // is the node selected
    };
    li_attr?: {};  // attributes for the generated LI node
    a_attr?: {}; // attributes for the generated A node
};
interface IJSTreeNodeChildren extends _IJSTreeNode {
    children: Array<string | IJSTreeNodeChildren>;
};
interface IJSTreeNodeParent extends _IJSTreeNode {
    parent: string;
};
export type IJSTreeNode = IJSTreeNodeChildren | IJSTreeNodeParent;

@ViewMetadata({
    name: "ProjectInstanceView",
    templateHTML: ProjectManagerAppInstanceViewTmpl
})
export class ProjectInstanceView extends View {
    private readonly categoriesViewSelector;
    private foldingView: PageFoldingView;
    private _firstPItemId: string;

    private renderData: any;
    private actions: ActionsView;
    private projectElems: Array<ProjectElement>;
    private types;
    private clickaction;
    private treeview;
    private bgRenderItems: Array<string>;

    private pitemMessagesMap: { [pitemId: string]: string };

    private constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private data: any
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

        this.pitemMessagesMap = {};

        this.foldingView = <PageFoldingView>ViewRegistry
            .getEntry("PageFoldingView")
            .create(this.parent, "#project-folding-"+this.id);
        this.foldingView
            .setPFSelector("#folding-app-instance-categories-"+this.id);

        this._firstPItemId = null;

        this.initActions(data.meta.actions);

        this.initElem("menu", data.meta.actions);
        this.projectElems = new Array<ProjectElement>();
        this.types = {};
        this.clickaction = {};
        this.bgRenderItems = [];

        _.forEach(data.meta.categories, (category) => {
            this.createCategoryItems(category, data.project.projectItems);
        });

        this.treeview = null;
    }

    public updateProjectData(project: any): void {
        this.data.project = project;
        // this.projectElems.splice(0, this.projectElems.length);
        if (project.saveMode === "SHARED") {
            this.actions.removeOption("Share");
        }

        let jstreeProj = $(this.categoriesViewSelector)["jstree"](true);

        this.data.project.projectItems.forEach(pitem => {
            let pel = this.projectElems.find(pelem => pelem["systemId"] === pitem.systemID);
            pel["_jstreeNode"]["shared_state"] = "SHARED_PROJECT";
            pel["_componentsData"] = pitem.componentsData;

            var node = jstreeProj.get_node(pel["_jstreeNode"].id);
            node.shared_state = "SHARED_PROJECT"
        });
        jstreeProj.redraw(true);
    }

    public get dbID() {
        return this["projectID"];
    }

    public getProjectDB () {
        return this.parent["getProject"](this.dbID);
    }

    public getProjectItemDB (pitemId) {
        let projectDB = this.getProjectDB();
        let index = projectDB.projectItems.map(x=>x.systemID).indexOf(pitemId);
        return projectDB.projectItems[index];
    }

    public get firstPItemID (): string {
        return this._firstPItemId;
    }

    //color, img, text, shared
    private __getValue_title(value) {
        let res = value.text;
        assert(typeof res !== "undefined", "title render value unexpected value");
        return res;
    }
    private __getValue_img(value) {
        let res = value.path || value.fa || value.glyphicon;
        assert(typeof res !== "undefined", "img render value unexpected value");
        return res;
    }
    private __getValue_colour(value) {
        let res = value.colour || value.default;
        assert(typeof res !== "undefined", "color render value unexpected value");
        return res;
    }
    // smart object state
    private __getValue_state(value) {
        if (!value) {
            return "offline";
        }

        return this.__getValue_img(value.state ? value.state : value);
    }
    private __getValue_shared(value) {
        let res = value.shared;
        assert(typeof res !== "undefined", "colour render value unexpected value");
        return res;
    }
    private getValue(obj) {
        if (typeof obj === "undefined" || typeof obj === "string") {
            return obj;
        }
        let value = obj.value;
        if (typeof value === "undefined" || typeof value === "string") {
            return value;
        }

        return this["__getValue_"+obj.type](value);
    }

    public addNewElement(
        itemData,
        projectCategory,
        callback
    ): void {
        let parentId = projectCategory.jstreeNode.id;
        let pi = this.addProjectItem(parentId, itemData);

        // tmp solution to pin new node in document, to cache and update 
        // core data of the jstree. TODO: refactor the plugin of the jstree lib
        document["jstreeNewNode"] = pi.jstreeNode;
        this.treeview.create_node(
                parentId,
                pi.jstreeNode,
                "last",
                () => {
                    this.registerItemClick(pi);
                    callback(pi);
                }
            );
    }

    public setClickAction(category) {
        this.clickaction[category.type] = {};

        if (category.items) {
            category.items.forEach(item => {
                let actionClick = item.events.find(x => x.type === "click");
                this.clickaction[item.type] = {
                    action: actionClick
                };
            });
        }
    }

    private createCategoryItems(category, projectItems): void {
        category.id = "jstree_" + category.type;
        let infoC: Array<any> = category.renderParts;
        let text = infoC.find(x => x.type === "title");
        let icon = infoC.find(x => x.type === "img");
        let color = infoC.find(x => x.type === "colour");

        let jstreeNode: IJSTreeNode = {
            id: category.id,
            type: category.type,
            parent: category.parent || "#",
            text: this.getValue(text),
            icon: this.getValue(icon),
            color: this.getValue(color),
            state: {
                opened: true
            },
            options: category.actions && category.actions.length > 0
        };

        jstreeNode.highlighted = category.highlighted ||
            {
                bgColor: "rgb(151, 181, 207)",
                bgColorHover: "rgb(180, 201, 220)",
                options: {
                    color: "#1A3A3A",
                    hover: "white"
                }
            };

        let projectCategory = new ProjectCategory(
            jstreeNode,
            this,
            category
        );

        this.types[category.type] = {};
        category.validChildren.forEach(type => this.types[type] = {
            "icon": this.getMeta(type).renderParts
                        .find(x => x.type === "img")
                        .value
                        .default
        });
        this.setClickAction(category);

        this.projectElems.push(projectCategory);
        this.bgRenderItems.push(category.id);

        this.addProjectItems(category.id, projectItems);

        if (category.categories) {
            category.categories.forEach (scategory => {
                scategory.parent = category.id;
                scategory.highlighted = scategory.highlighted ||
                    {
                        bgColor: "rgb(228, 228, 228)",
                        bgColorHover: "rgb(208, 208, 208)",
                        options: {
                            color: "black",
                            hover: "white"
                        }
                    };
                this.createCategoryItems(scategory, projectItems);
            });
        }
    }

    private addProjectItem (parentId, item): ProjectItem {
        let infoC: Array<any> = item.renderParts;
        let text = this.getValue(infoC.find(x => x.type === "title"));
        let icon = this.getValue(infoC.find(x => x.type === "img"));
        let color = this.getValue(infoC.find(x => x.type === "colour"));
        let connection_state = this.getValue(infoC.find(x => x.type === "state"));
        let shared_state = null;
        if (   item.componentsData
            && item.componentsData.collaborationData
            && item.componentsData.collaborationData.privileges) {
            shared_state = item.componentsData.collaborationData.privileges.shared.type;
        }
        if (item.collab) {
            if (item.collab.isPersonal) {

            }
            else {
                shared_state = "SHARED_PROJECT";
            }
        }
        let editorsData = item.editorsData ? item.editorsData : {};
        let componentsData = item.componentsData ? item.componentsData : {};

        item.id = item.systemID
            ? item.systemID
            : "jstree_" + parentId + "_" + text;

        let jstreeNode: IJSTreeNode = {
            id: item.id,
            parent: parentId,
            type: item.type,
            text: text,
            icon: icon,
            color: color,
            connection_state: connection_state,
            shared_state: shared_state,
            state: {
                opened: true
            },
            options: true
        };

        jstreeNode.highlighted = {
            options: {
                color: "white",
                hover: "black"
            }
        };

        let meta = this.getMeta(item.type);
        let orderNO = 1 + this.projectElems
            .reduce((acc, cur) => cur.jstreeNode.type === jstreeNode.type
                ? ++acc
                : acc, 0
            );

        let projectItem = new ProjectItem(
            jstreeNode,
            <ProjectCategory>this.getProjectElement(parentId),
            meta,
            item.systemID,
            editorsData,
            orderNO,
            componentsData
        );

        if (!this._firstPItemId) {
            this._firstPItemId = projectItem.systemID;
        }

        this.projectElems.push(projectItem);

        return projectItem;
    }

    public getProjectElement(id): ProjectElement {
        return this.projectElems.find(elem => elem.jstreeNode.id === id);
    }

    public getProjectElements(type: string): Array<ProjectElement> {
        if (type === "ALL") {
            return this.projectElems;    
        }
        
        return this.projectElems.filter(elem => elem.jstreeNode.type === type);
    }

    private treevaluemap = {
        "colour": "color",
        "img": "icon",
        "title": "text"
    };
    private mapTreeValues(prop): string {
        return this.treevaluemap[prop] || prop;
    }

    public pitemRename(pitem, data, options) {
        // mapped data
        let mdata = {};
        
        let el = this.projectElems.find(el => el["systemID"] === pitem);
        for (let key of Object.keys(data)) {
            if (key === 'img'
            && Array.isArray(data.img.path)
            && data.img.path.length === 0) {
                continue;
            }
            mdata[this.mapTreeValues(key)] = data[key];
            el.jstreeNode[this.mapTreeValues(key)] = data[key];
        }

        // options
        // TODO: check if render is required for one or more options

        this.treeview.update_node(pitem, mdata);
    }

    private getMetaHelper(type, categories): any {
        let res = categories.find(c => c.type === type);
        if (res) {
            return res;
        }
        for(const element of categories) {
            if (element.items && element.items.length>0) {
                res = element.items.find(el => el.type === type);
                if (res) {
                    return res;
                }
            }
            if (element.categories && element.categories.length>0) {
                res = this.getMetaHelper(type, element.categories);
                if (res) {
                    return res;
                }
            }
        };
        return null;
    }

    public getMeta(type): any {
        return this.getMetaHelper(type, this.data.meta.categories);
    }

    private addProjectItems(parentId: string, items: Array<any>): void {
        let pitems = items.filter(x => x.parent === parentId);

        // for (let i=1, j=pitems.length; i<=j; i++) {
        //     let item = pitems.find(x => x.orderNO === i);
        pitems.forEach( item => {
            this.addProjectItem(parentId, item);
            // add children
            this.addProjectItems(item.systemID, items);
        });
        //}
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
                        "actions": data,
                        "concerned": this
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

    private renderElem(type: string): void {
        if (this[type] !== null) {
            this[type].render();
            this.appendLocal(".app-instance-"+type, this[type].$el);
        }
    }

    private itemsMenu(node) {
        let projectElement = this.projectElems.find(x => x.jstreeNode.id === node.id);
        let menuItems = Object.assign({}, projectElement.menuObj);
        /* call the collaboration manager in case project is shared*/
        if (this.data.project.componentsData
            && this.data.project.componentsData.CollaborationManager 
            && this.data.project.componentsData.CollaborationManager.members) {
            let index = Object.keys(menuItems).length;
            let element = this.data.meta.categories.find(category => category.id === node.id);
            if (!element) {
                element = node.id;
            }
            let collabMenuItems = this.parent["itemsMenuCollaboration"](element);
            if (collabMenuItems.length > 0) {
                menuItems[index] = {
                    separator_before: true
                };
                collabMenuItems.forEach(cmitem => menuItems[index++] = {
                    label: cmitem.label,
                    icon: cmitem.icon,
                    action: cmitem.action
                });
            }
        }
        return menuItems;
    }

    private renderJSTree() {
        document["refresh_treeView"] = true;
        let jstreeNodes: Array<IJSTreeNode> = [];
        this.projectElems.forEach(elem => jstreeNodes.push(elem.jstreeNode));

        $(this.categoriesViewSelector)["jstree"]({
            "plugins": [
                "wholerow", // has to be first for the highlighted categories
                "colorv",
                "contextmenu",
                "types",
                "sort"
            ],
            "contextmenu": {
                "items": (node) => this.itemsMenu(node)
            },
            "types": this.types,
            "core": {
                "check_callback": true,
                "data": jstreeNodes
            }
        });
        this.treeview = $["jstree"].reference(this.categoriesViewSelector);
        this.registerItemClick("ALL");
        // register events for extra messages rendering of the pitems
        $(this.categoriesViewSelector).bind(
            "open_node.jstree",
            () => this.onRefreshJSTree());
        $(this.categoriesViewSelector).bind(
            "redraw.jstree",
            () => this.onRefreshJSTree());    
    }

    public refreshPItems(pitems) {

    }

    public render(): void {
        if (this.treeview) {
            this.treeview.destroy();
        }
        $(this.categoriesViewSelector).empty();
        
        $("#"+this.id).remove();
        this.renderTmplEl(this.renderData);
        this.foldingView.render();
        this.renderElem("actions");
        this.renderElem("menu");
        this.renderJSTree();

        // bootstrap adds hidden in overflow which destroys z-index in dropdown menu
        $("#folding-app-instance-categories-"+this.id).css("overflow", "");

        // var onclickFunc = (node) => this.onClickItem(node);
        // // events for tree view
        // var sel = this.categoriesViewSelector;
        // $(sel).on(
        //         "click",
        //         ".jstree-anchor",
        //         function (e, data) {
        //             var node = $(sel)
        //                 .jstree(true)
        //                 .get_node($(this));
        //             onclickFunc(node);
        //         }
        //     );
    }

    private registerItemClick(data) {
        var sel = this.categoriesViewSelector;
        var treeview = this.treeview;
        var onclickFunc = (node) => this.onClickItem(node);
        function registerSItemClick(pe) {
            $(sel).on(
                "click",
                "#" + pe.jstreeNode.id,
                function (e) {
                    var node = treeview.get_node($(this));
                    onclickFunc(node);
                }
            );
        }
        if (data === "ALL") {
            this.projectElems.forEach(pe => registerSItemClick(pe));
        }
        else {
            registerSItemClick(data);
        }
    }

    public onClickItem(node): void {
        let action = this.clickaction[node.type].action;
        node = this.projectElems.find(x => x.jstreeNode.id === node.id);

        if (action) {
            this.onActionItem(node, action);
        }
    }

    public onActionItem(element: ProjectElement, action): void {
        action.createTitle = element["_meta"].actions
            .find(_action => _action.events[0].action === action.action)
            .title;
        this.parent["onClickMenuItem"](action, element);
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
                        .css("background-color", "rgb(105 160 208)");
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
                        .css("background-color", "rgb(74 129 177)");
                }
            }
        );
        // $('#options_jstree_SmartObjects').on('click', function (e) {
        //     $('#jstree_SmartObjects_anchor').trigger({
        //         type: 'contextmenu.jstree', pageX: e.pageX, pageY: e.pageY
        //     }); e.preventDefault(); return false
        // });
    }

    public setStyle(): void {
        ;
    }

    public destroy(): void {
        $(this.categoriesViewSelector)["jstree"]("destroy").empty();
        $("#"+this.id).remove();
    }

    // on remove element has to ask logic deps etc.
    public removeElement(elementID: string): boolean {
        // check deps if it is allowed to remove or not

        // open new focused project item

        return this.treeview.delete_node(elementID);
    }

    public hasElement(name: string): boolean {
        let elem = this.treeview.settings.core.data.find(x => x.text === name);
        return elem !== undefined;
    }

    public getValidChildren(categoryId: string): any {
        let category = this.data.meta.categories.find(x => x.id === categoryId);
        return category.validChildren;
    }

    public getCategoryInformation(categoryId: string): any {
        let category = this.data.meta.categories.find(x => x.id === categoryId);

        let infoC: Array<any> = category.renderParts;
        let text = infoC.find(x => x.type === "title");
        let icon = infoC.find(x => x.type === "img");
        let color = infoC.find(x => x.type === "colour");
        
        return {
            text: this.getValue(text),
            icon: this.getValue(icon),
            color: this.getValue(color)
        };
    }

    public trigger(evt: string, elem :ProjectElement): void {
        $("#"+elem.jstreeNode.id)["jstree"]().deselect_all(true);
        this.treeview/*.jstree()*/.select_node(elem.jstreeNode.id);
        $("#"+elem.jstreeNode.id).trigger(evt, elem);
    }

    /**
     * Handling extra injected messages of the project items
     */
    private getExtraPItemSelector(pitemId: string) {
        return "extra-pitem-area-" + pitemId;
    }

    private clearMsgPItemJSTree(pitemId: string) {
        $("#"+this.getExtraPItemSelector(pitemId)).remove();
    }

    private addMsgPItemJSTree(pitemId: string, msg: string) {
        let selector = this.getExtraPItemSelector(pitemId);

        $(`<span id="${selector}" style="margin-left:5px;">${msg}</span>`)
            .insertBefore("#options_" + pitemId);
    }

    private onRefreshJSTree() {
        for(const pitemId in this.pitemMessagesMap) {
            this.clearMsgPItemJSTree(pitemId);
            this.addMsgNextToItem(pitemId, this.pitemMessagesMap[pitemId]);
        }
    }

    public addMsgNextToItem(pitemId, msg) {
        this.addMsgPItemJSTree(pitemId, msg);
        this.pitemMessagesMap[pitemId] = msg;
    }

    public updateMsgNextToItem(pitemId, msg) {
        $("#"+this.getExtraPItemSelector(pitemId)).html(msg);
        this.pitemMessagesMap[pitemId] = msg;
    }

    public removeMsgNextToItem(pitemId) {
        this.clearMsgPItemJSTree(pitemId);
        delete this.pitemMessagesMap[pitemId];
    }

    public getMsgNextToItem(pitemId) {
        return this.pitemMessagesMap[pitemId];
    }
}
