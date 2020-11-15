import {ComponentsCommunication} from '../../component/components-communication';
/**
 * Editor - Super class of editors, common functionality has to be supported by editors
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "../../component/ide-ui-component";
import {ExportedFunction, RequiredFunction,  UIComponentMetadata,   ExportedStaticFunction} from '../../component/component-loader';
import { ResponseValue } from "../../component/response-value";

import * as _ from "lodash";
import {
    ProjectItem
} from '../project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item';
import { ITool } from "./editor-manager-toolbar-view/editor-manager-toolbar-view";
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

export interface IDomainElementData {
    signal: string;
    data: any;
}

@UIComponentMetadata({
    description: "All visual editors which are handled by the editor manager in the IDE",
    authors: [
        { date: "October 2018", name: "Yannis Valsamakis", email: "jvalsam@ics.forth.gr" }
    ],
    version: "1.0"
})
export abstract class Editor extends IDEUIComponent {
    private _systemID: string;
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

    public get systemId(): string {
        return this._systemID;
    }

    public abstract undo(): void;
    public abstract redo(): void;

    public abstract copy(): void;
    public abstract paste(): void;

    public abstract closeSRC(srcId: string): void;

    public abstract tools(editorId: string): Array<ITool>;

    protected save (id: string, pitem: ProjectItem, data: any): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "saveEditorData",
            [
                id,
                pitem,
                this.name,
                data
            ]
        );
    }

    public abstract update_src(data: any, pitem: any, focus : boolean): void;

    // public create_src(data: INewItemData): string;

    public get isRendered(): boolean {
        return this._isRendered;
    }

    public setAsRendered():void {
        this._isRendered = true;
    }

    // all Editors have to implement static functions factory+"each mission name"
    @ExportedStaticFunction
    public static factoryNewElement(mission, args): ResponseValue {
      return new ResponseValue(this.name, "factory", this["factory"+mission](args));
    }

    public static createJSONArgs (editorName, systemID, projectID, args): any {
        let json = {
            "systemID": editorName+"_"+systemID,
            "projectID": projectID
        };
        _.forEach(args, (value, key) => {
            json[key] /*+*/= value;
        });
        return json;
    }

    public abstract updatePItemData(editorId: string, pitem: ProjectItem);

    public abstract getDomainElementData(projectId: string, domainElemId: string): IDomainElementData;

    public abstract factoryNewItem(
        pitemName: string,
        econfigName: string,
        pitemInfo: any,
        editorConfig: any
    ): any;
}
