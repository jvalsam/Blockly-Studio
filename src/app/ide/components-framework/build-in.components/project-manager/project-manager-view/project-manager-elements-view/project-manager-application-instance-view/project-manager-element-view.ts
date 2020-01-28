import { ProjectItemViewState } from './item-view/item-view';
import { View, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { assert } from "../../../../../../shared/ide-error/ide-error";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from "../../../../../component/registry";
import { PageFoldingView } from "../../../../../common-views/page-folding-view/page-folding-view";

import * as _ from "lodash";
import { ProjectManagerAppInstanceView } from "./project-manager-app-instance-view";


export abstract class ProjectManagerElementView extends View {
    protected static meta: any;
    private static _PMStyle: any;
    protected renderInfo: any;
    protected _currOrderNO: number;
    protected _systemID: string;
    protected actions: ActionsView;
    protected foldingView: PageFoldingView;
    protected _children: {
        items: Array<ProjectManagerElementView>,
        categories: Array<ProjectManagerElementView>
    };

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        protected meta: any,
        protected path: string,
        protected parentTree: ProjectManagerElementView | ProjectManagerAppInstanceView,
        public readonly projectID: string,
        isSelected: boolean
    ) {
        super(
            parent,
            name,
            templateHTML,
            style,
            hookSelector
        );
        this._children = { items: null, categories: null };
        this.renderInfo = {};
        this.renderInfo.isSelected = typeof isSelected === "undefined" ? false : isSelected;
    }

    public get systemID (): string {
        return this._systemID;
    }

    protected initActions(selector: string, styles) {
        if (this.getMeta().actions.length > 0) {
            this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView").create(
                this.parent,
                selector,
                styles,
                { "actions": this.getMeta().actions, "concerned": this }
            );
        }
        else {
            this.actions = null;
        }
    }

    public isSelected(): boolean {
        return this.renderInfo.isSelected;
    }

    protected abstract setMouseOverStyle(): void;
    protected abstract setMouseOutStyle(): void;

    public select(choice: boolean): void {
        this.renderInfo.isSelected = choice;
        if (choice) {
            this.setMouseOverStyle();
        }
        else {
            this.setMouseOutStyle();
        }
    }

    protected initFolding(selector: string, pfSelector: string, foldIcon: any, styles?:any) {
        this.foldingView = <PageFoldingView>ViewRegistry.getEntry("PageFoldingView").create(this.parent, selector);
        this.foldingView.setPFSelector(pfSelector);
        this.foldingView.setFoldIcon(foldIcon);
        if (styles) {
            this.foldingView.userStyles (styles);
        }
    }

    private getElementDataHelper(items, categories, type) {
        if (items && items.length>0) {
            return items[items.map(x=>x.type).indexOf(type)];
        }
        if (categories && categories.length>0) {
            return categories[categories.map(x=>x.type).indexOf(type)];
        }
        if (this.parentTree) {
            return (<ProjectManagerElementView>this.parentTree).getChildElementRenderData(type);
        }
        return null;
    }

    public getChildElementData(type: string) {
        assert (
            this.meta.validChildren &&
            _.findIndex (
                this.meta.validChildren,
                (value) => { return value === type; }
            ) > -1,
            "Not valid children with name "+type+" in item view " + this.meta.type
        );
        return this.getElementDataHelper(this.meta.items, this.meta.categories, type);
    }

    public getChildElementRenderData(type: string) {
        assert (
            this.meta.validChildren &&
            _.findIndex(
                this.meta.validChildren,
                (value) => { return value === type; }
            ) > -1,
            "Not valid children with name "+type+" in item view " + this.meta.type
        );
        let elemData = this.getElementDataHelper(this.meta.items, this.meta.categories, type);
        if (elemData!==null) {
            return elemData.renderParts;
        }
        return elemData;
    }

    public getReversedChildElementRenderData(type: string) {
        let rdata = [];
        let data = this.getChildElementRenderData(type);
        _.forEachRight(data, (element) => {
            rdata.push($.extend(true, {}, element));
        });
        return _.reverse(rdata);
    }

    public get children() {
        return this.children;
    }

    public getValidChildren() {
        return this.meta.validChildren;
    }

    private hasChild(name: string, type: string) {
        let found = false;
        if (this._children[type]) {
            _.forEach(this._children[type], (element)=> {
                if (element.hasElement(name)) {
                    found = true;
                    return false;
                }
            });
        }
        return found;
    }

    public hasElement(name: string): boolean {
        return this.name === name || this.hasChild(name, "categories") || this.hasChild(name, "items");
    }

    private getChild(data: string, type: string, itype: string): ProjectManagerElementView {
        let child: ProjectManagerElementView = null;
        if (this._children[itype]) {
            _.forEach(this._children[itype], (element)=> {
                child = element.findElement(data, type);
                if (child) {
                    return false;
                }
            });
        }
        return child;
    }

    public findElement(data: string, type: string) {
        if(this[type] === data) {
            return this;
        }
        let element = this.getChild(data, type, "categories");
        if (element) {
            return element;
        }
        return this.getChild(data, type, "items");
    }

    protected abstract addElement(itemData): any;

    public addNewElement(itemData, callback?: (newItem) => void): void {
        itemData.orderNO = this._currOrderNO++;
        itemData.path = this.path;
        let newElem = this.addElement(itemData);
        newElem.render();
        callback(newElem);
    }

    private setStateHelper(childrenType: string, state: ProjectItemViewState, systemID: string): boolean {
        let setted: boolean = false;
        if (this._children[childrenType]) {
            _.forEach(this._children[childrenType], (element) => {
                setted = element.setState(state, systemID);
                if (setted) {
                    return false;
                }
            });
        }
        return setted;
    }

    public setState(state: ProjectItemViewState, systemID: string): boolean {
        if (this._children) {
            return this.setStateHelper("categories", state, systemID) ||
                this.setStateHelper("items", state, systemID);
        }
        return false;
    }

    private removeHelper(type: string, systemID: string): boolean {
        if (this._children[type]) {
            let isRemoved = false;
            _.forEach(this._children[type], (element: ProjectManagerElementView) => {
                let resp = element.removeElement(systemID);
                if (resp) {
                    isRemoved = true;
                    return false;
                }
            });
            return isRemoved;
        }
        return false;
    }
    public removeElement(systemID: string): boolean {
        if (this._systemID === systemID) {
            this.destroy();
            if(this.parentTree["_children"]) {
                _.remove(
                    (<ProjectManagerElementView>this.parentTree)["_children"].items,
                    (item: ProjectManagerElementView) => item.systemID === systemID
                );
                _.remove(
                    (<ProjectManagerElementView>this.parentTree)["_children"].categories,
                    (item: ProjectManagerElementView) => item.systemID === systemID
                );
            }
            else {
                _.remove(
                    (<ProjectManagerAppInstanceView>this.parentTree)["categories"],
                    (category: ProjectManagerElementView) => category.systemID === systemID
                );
            }
            return true;
        }

        if (this._children) {
            return this.removeHelper("categories", systemID) ||
                   this.removeHelper("items", systemID);
        }

        return false;
    }

    public destroy(): void {
        if (this.foldingView !== null) {
            this.foldingView.destroy();
        }
        if (this.actions !== null) {
            this.actions.destroy();
        }
        if (this._children) {
            if (this._children.categories) {
                _.forEach(this._children.categories, (category) => category.destroy());
                this._children.categories.length = 0;
            }
            if (this._children.items) {
                _.forEach(this._children.items, (item) => item.destroy());
                this._children.items.length = 0;
            }
        }
        super.destroy();
    }

    public abstract onClick(): void;

    public static setElementsStyle(style: any): void {
        this._PMStyle = style;
    }

    public static getElementStyle(name: string, type: string): any {
        if (!this._PMStyle) {
            return [];
        }

        let data;
        if (type==="categories" || type==="items") {
            return this._PMStyle.project[type][name] ? this._PMStyle.project[type][name] : this._PMStyle.project[type].default;
        }
        else {
            return data = this._PMStyle[name][type] ? this._PMStyle[name][type] : this._PMStyle[name].default;
        }
    }

    public renderParts() {
        return this.meta.renderParts;
    }

    protected abstract getMeta(): any;
}