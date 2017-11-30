/**
 * Editor - Super class of editors, common functionality has to be supported by editors
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "../../component/ide-ui-component";
import { ExportedFunction } from "../../component/component-loader";

// const enum EditorRenderState {
//     constructed = 0,
//     rendered = 1
// }
// export { EditorRenderState };

export abstract class Editor extends IDEUIComponent {
    private _isRendered: boolean;

    constructor(
        name: string,
        description: string,
        compViewName: string
    ) {
        super(name, description, compViewName);
        this._isRendered = false;
    }

    public abstract undo(): void;
    public abstract redo(): void;

    public abstract copy(): void;
    public abstract paste(): void;

    public get isRendered(): boolean {
        return this._isRendered;
    }

    public setAsRendered():void {
        this._isRendered = true;
    }
}
