

import * as _ from "lodash";
import { assert } from './../../../shared/ide-error/ide-error';


export class EditorFactory {
    private static _data: {[mission:string]: { [editor: string]: Function }};

    public static initialize() {
        this._data = {};
    }

    public static addCatalogue(mission: string, editor: string, ctor: Function) {
        if (this._data[mission]) {
            this._data[mission] = {};
        }

        this._data[mission][editor] = ctor;
    }

    public static removeCatalogue(mission: string, editor: string) {

    }

    public static removeMissionCatalogue (mission: string) {
        delete this._data[mission];
    }

    public static removeEditorCatalogue (editor: string) {
        _.forOwn(this._data, (editorsMap, mission) => {
            if (editorsMap[editor]) {
                delete this._data[mission][editor];
                if (Object.keys(this._data[mission]).length === 0) {
                    delete this._data[mission];
                }
            }
        });
    }

    public static create (mission: string, editor?: string) {
        assert(this._data[mission] != null && this._data[mission] != undefined, "Mission '"+mission+"' is not registered in the system.");
        if (editor) {
            assert(this._data[mission][editor] != null && this._data[mission][editor] != undefined, "Mission '"+mission+"' is not registered in the system.");
        }

        if (editor) {
            return this._data[mission][editor]();
        }
        else {
            let results = {};
            _.forOwn(this._data[mission], (ctor, editor) => {
                results[editor] = ctor();
            });
            return results;
        }
    }
}
