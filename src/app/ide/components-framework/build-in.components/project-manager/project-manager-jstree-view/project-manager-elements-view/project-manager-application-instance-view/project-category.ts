import { IJSTreeNode, ProjectInstanceView } from "./project-instance-view";
import { assert } from "../../../../../../shared/ide-error/ide-error";
import * as _ from "lodash";
import { ProjectElement } from "./project-element";

export class ProjectCategory extends ProjectElement {
    public constructor(
        _jstreeNode: IJSTreeNode,
        private _project: ProjectInstanceView,
        _meta: any
    ) {
        super(_jstreeNode, _meta);
    }

    public get project(): ProjectInstanceView {
        return this._project;
    }

    private getElementData(items, categories, type) {
        if (items && items.length > 0) {
            return items.find(x => x.type === type);
        }
        if (categories && categories.length > 0) {
            return categories.find(x => x.type === type);
        }
        return null;
    }

    public getChildElementData(type: string) {
        assert(
            this.meta
            && this.meta.validChildren
            && this.meta.validChildren.find(x => x === type),
            "type " + type + " not exists."
        );
        return this.getElementData(this.meta.items, this.meta.categories, type);
    }

    public getChildElementRenderData(type: string) {
        assert(
            this.meta
            && this.meta.validChildren
            && this.meta.validChildren.find(x => x === type),
            "Not valid children with name "
            + type
            + " in item view "
            + this.meta.type
        );
        let elemData = this.getElementData(
            this.meta.items,
            this.meta.categories,
            type
        );
        if (elemData !== null) {
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

    public addNewElement(itemData, callback?: (newItem) => void): void {
        itemData.parent = this.jstreeNode.id;
        // all project items have to be created using this function...
        this._project.addNewElement(
            itemData,
            this,
            callback
        );
    }
}