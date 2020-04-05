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
        _meta: any
    ) {
        super(_jstreeNode, _meta);
    }

    public get project(): ProjectInstanceView {
        return this._category.project;
    }
}
