import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewStyleData } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ItemViewTmpl from "./category-view.tmpl";
import { ProjectManagerActionsView as ActionsView } from "../actions-view/actions-view";
import { ProjectManagerMenuView as MenuView } from "../menu-view/menu-view";
import { ViewRegistry } from "../../../../../../component/registry";
import { IProjectManagerElementData } from "../../../../project-manager";

import { PageFoldingView } from './../../../../../../common-views/page-folding-view/page-folding-view';


@ViewMetadata({
    name: "ProjectManagerItemView",
    templateHTML: ItemViewTmpl
})
export class ProjectManagerCategoryView extends View {
    private foldingView: PageFoldingView;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: IViewStyleData,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        data.meta.isLeaf = "categories" in data.meta;
        data.meta.id = this.id;
        
        if (data.meta.validChildren && data.meta.validChildren.length>0) {
            this.foldingView = <PageFoldingView>ViewRegistry.getEntry("PageFoldingView").create(this.parent, "#item-folding-"+this.id);
            this.foldingView.setPFSelector("#item-children-"+this.id);
            this.foldingView.setFoldIcon({ plus: "fa fa-caret-right", minus: "fa fa-caret-down" });
        }
        else {
            this.foldingView = null;
        }

        this.initContainer("actions", data.meta);
        this.initContainer("menu", data.meta);

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

    private renderElem(type: string): void {
        if (this[type] !== null) {
            this[type].render();
        }
    }

    public render(): void {
        this.renderTmplEl(this.info);
        this.foldingView.render();
        this.renderElem("actions");
        this.renderElem("menu");
        if (this.info.isLeaf) {
            _.forEach(<Array<View>>this.elements, (value) => {
                value.render();
            });
        }
        else {
            let $el = $("#category-elements-" + this.id);
            $el.jstree({
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
            if($el.jstree(true).get_json('#', { "flat" : true }).length === 0) {
                $el.empty();
                $el.append("<div class='small text-center align-middle' style='padding-top:15px; padding-bottom:15px; width:100%'>No " + this.info.renderParts["title"] + " are defined yet.</div>");
            }
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
