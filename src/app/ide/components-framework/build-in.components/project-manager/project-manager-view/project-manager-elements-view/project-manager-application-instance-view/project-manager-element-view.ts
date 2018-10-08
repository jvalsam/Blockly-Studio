import { View, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { assert } from "../../../../../../shared/ide-error/ide-error";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from "../../../../../component/registry";
import { PageFoldingView } from "../../../../../common-views/page-folding-view/page-folding-view";

import * as _ from "lodash";
import { ProjectManagerAppInstanceView } from "./project-manager-app-instance-view";


export abstract class ProjectManagerElementView extends View {
    protected actions: ActionsView;
    protected foldingView: PageFoldingView;
    protected _children: { items: Array<ProjectManagerElementView>, categories: Array<ProjectManagerElementView> };

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        protected meta: any,
        protected path: string,
        protected parentTree: ProjectManagerElementView | ProjectManagerAppInstanceView
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this._children = { items: null, categories: null };
    }

    protected initActions(selector: string, styles) {
        if (this.meta.actions.length > 0) {
            this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView").create(
                this.parent,
                selector,
                styles,
                { "actions": this.meta.actions, "concerned": this }
            );
        }
        else {
            this.actions = null;
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

    private getElementHelper(items, categories, type) {
        if (items && items.length>0) {
            return items[items.map(x=>x.type).indexOf(type)].renderParts;
        }
        if (categories && categories.length>0) {
            return categories[categories.map(x=>x.type).indexOf(type)].renderParts;
        }
        if (this.parentTree) {
            return (<ProjectManagerElementView>this.parentTree).getChildElementRenderData(type);
        }
        return null;
    }
    public getChildElementRenderData(type: string) {
        assert (this.meta.validChildren && _.findIndex(this.meta.validChildren, (value) => { return value === type; } ) > -1, "Not valid children with name "+type+" in item view " + this.meta.type);
        return this.getElementHelper(this.meta.items, this.meta.categories, type);
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
}