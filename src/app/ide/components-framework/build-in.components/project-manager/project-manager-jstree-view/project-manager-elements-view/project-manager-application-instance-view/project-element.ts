import {
    IJSTreeNode,
    ProjectInstanceView
} from "./project-instance-view";

export abstract class ProjectElement {
    private _menuObj: any;

    public constructor(
        protected _jstreeNode: IJSTreeNode,
        protected _meta: any
    ) {
        this._menuObj = {};
        if (this._meta.actions) {
            this.setContentMenuObj(this._meta.actions);
        }
    }

    public abstract get project(): ProjectInstanceView;

    public get meta(): any {
        return this._meta;
    }

    public get jstreeNode(): IJSTreeNode {
        return this._jstreeNode;
    }

    // public rename(value: any): void {
    //     for (let prop in value) {
    //         if (prop === 'img' && Array.isArray(value.img.path) && value.img.path.length === 0) {
    //             continue;
    //         }
    //         this._jstreeNode[this.mapTreeValues(prop)] = value[prop];
    //     }
    // }

    public getValidChildren() {
        return this.meta.validChildren;
    }

    public setContentMenuObj(actions) {
        this._menuObj = {};

        actions.forEach((action, index) => {
            this._menuObj[index] = {};
            this._menuObj[index].label = action.title;
            this._menuObj[index].icon = action.img;
            if (action.events) {
                let event = action.events.find(x => x.type === "click");
                this._menuObj[index].action = (node) => {
                    this.project.onActionItem(this, event);
                };
            }

            if (action._disabled) {
                this._menuObj[index]._disabled = true;
            }
            if (action._class) {
                this._menuObj[index]._class = action._class;
            }
            if (action.separator_before) {
                this._menuObj[index].separator_before = true;
            }
            if (action.separator_after) {
                this._menuObj[index].separator_after = true;
            }

            if (action.submenu) {
                this._menuObj[index].submenu = this.setContentMenuObj(action.submenu);
            }
        });

        return this._menuObj;
    }

    public get menuObj() {
        return this._menuObj;
    }

    public trigger(evt) {
        this.project.trigger(evt, this);
    }
}
