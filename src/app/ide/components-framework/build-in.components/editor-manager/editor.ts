/**
 * Editor - Super class of editors, common functionality has to be supported by editors
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "../../component/ide-ui-component";
import { ExportedFunction, ExportedStaticFunction } from "../../component/component-loader";
import { ResponseValue } from "../../component/response-value";

// const enum EditorRenderState {
//     constructed = 0,
//     rendered = 1
// }
// export { EditorRenderState };

export interface INewItemData {
    name: string;
    imgPath?: string;
    mission: string;
}

export interface IEditorSrcData {

}

export abstract class Editor extends IDEUIComponent {
    private _isRendered: boolean;

    constructor(
        name: string,
        description: string,
        compViewName: string,
        hookSelector: string
    ) {
        super(name, description, compViewName, hookSelector);
        this._isRendered = false;
    }

    public abstract undo(): void;
    public abstract redo(): void;

    public abstract copy(): void;
    public abstract paste(): void;

    // public create_src(data: INewItemData): string;

    public get isRendered(): boolean {
        return this._isRendered;
    }

    public setAsRendered():void {
        this._isRendered = true;
    }

    // All Editors have to implement static functions factory+"each mission name"
    @ExportedStaticFunction
    public static factoryNewElement(mission, args): ResponseValue {
      return new ResponseValue(this.name, "factory", this["factory"+mission](args));
    }
}
