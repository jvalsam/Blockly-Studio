/**
 * ComponentViewEntry -
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * October 2017
 */

import { IDEUIComponent } from "../component/ide-ui-component";
import { ComponentViewElement } from "./component-view";
import { IDEError } from "../../shared/ide-error";

export class ComponentViewEntry {
    private _instanceList: Array<ComponentViewElement>;

    constructor(
        public readonly name: string,
        private _creationFunc: any,
        private _args?: Array<any>
    ) {
        this._instanceList = new Array<ComponentViewElement>();
    }

    public getInstances(): Array<ComponentViewElement> {
        return this._instanceList;
    }

    public setArgs(args: Array<any>) {
        this._args = args;
    }

    public create(parent: IDEUIComponent, ...extraElements: Array<any>): ComponentViewElement {
        const newView: ComponentViewElement = new (this._creationFunc) (parent, this.name, ...this._args, ...extraElements);
        this._instanceList.push(newView);
        return newView;
    }

    public destroy(view: ComponentViewElement) {
        view.destroy();
        const index = this._instanceList.indexOf(view);
        if (index === -1) {
            IDEError.raise(
                ComponentViewEntry.name,
                "Try to remove component view element instance of " + view.name + "."
            );
        }
        this._instanceList.splice(this._instanceList.indexOf(view), 1);
    }
}
