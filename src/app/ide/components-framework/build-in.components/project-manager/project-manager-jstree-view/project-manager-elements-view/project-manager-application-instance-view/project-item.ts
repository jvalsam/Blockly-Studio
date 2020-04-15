import { ProjectCategory } from "./project-category";
import { ProjectElement } from "./project-element";
import {
    IJSTreeNode,
    ProjectInstanceView
} from "./project-instance-view";

export class ProjectItem extends ProjectElement {
    public constructor(
        _jstreeNode: IJSTreeNode,
        private _category: ProjectCategory,
        _meta: any,
        private systemId: string,
        private _editorsData: {[editorId: string]: any},
        private orderNO: number
    ) {
        super(_jstreeNode, _meta);
    }

    public get project(): ProjectInstanceView {
        return this._category.project;
    }

    private getRender_img(rimg) {
        let value =
            this.jstreeNode.icon
            || this.meta.renderParts.find(x => x.type === "img").value.default;

        if (value.startsWith("fa")) {
            rimg.value["fa"] = value;
        }
        else {
            rimg.value["path"] = value;
        }

        return rimg;
    }
    private getRender_title(rtitle) {
        if (this.jstreeNode.text) {
            rtitle.value["text"] = this.jstreeNode.text;
            return rtitle;
        }
        return null;
    }
    private getRender_colour(rcolour) {
        if (this.jstreeNode.color) {
            rcolour.value["colour"] = this.jstreeNode.color;
            return rcolour;
        }
        return null;
    }
    private getRender_state(rstate) {
        if (this.jstreeNode.state) {
            rstate.value["state"] = this.jstreeNode.state;
            return rstate;
        }
        return null;
    }
    private getRender_shared(rshared) {
        if (this.jstreeNode.shared_state) {
            rshared.value["shared"] = this.jstreeNode.text;
            return rshared;
        }
        return null;
    }

    public itemData() {
        let data = {
            // extracted for DB
            renderParts: [],
            systemID: this.systemId,
            parent: this.jstreeNode["parent"],
            orderNO: this.orderNO,
            type: this.jstreeNode.type,
            // extra info will be used by templates developed by the domain authors
            jstree: this.jstreeNode
        };
        this.meta.renderParts.map(x => x.type).forEach(type => {
            let rpart = this["getRender_" + type]({
                type: type,
                value: {}
            });
            if (rpart) {
                data.renderParts.push(rpart);
            }
        });
        return data;
    }

    public get systemID(): string {
        return this.systemId;
    }

    public get editorsData(): any {
        return this._editorsData;
    }

    public set editorsData(data: any) {
        this._editorsData = data;
    }

    public setEditorData(id: string, data: any): void {
        this._editorsData[id] = data;
    }
}
