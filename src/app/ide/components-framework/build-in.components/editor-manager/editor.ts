/**
 * Editor - Super class of editors, common functionality has to be supported by editors
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "../../component/ide-ui-component";
import { UIComponentMetadata, ExportedStaticFunction } from "../../component/component-loader";
import { ResponseValue } from "../../component/response-value";

import * as _ from "lodash";

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

@UIComponentMetadata({
    description: "All visual editors which are handled by the editor manager in the IDE",
    authors: [
        { date: "October 2018", name: "Yannis Valsamakis", email: "jvalsam@ics.forth.gr" }
    ],
    version: "1.0"
})
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

    public static createJSONArgs (editorName, systemID, args): any {
        let json = {
            "systemID": editorName+"_"+systemID
        };
        _.forEach(args, (value, key) => {
            json[key] += value;
        });
        return json;
    }
}
