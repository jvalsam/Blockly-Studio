/// <reference path="../../../../../../../node.d.ts"/>
import PItemEditorsViewTmpl from "./pitem-view.tmpl";
import {
    View,
    ViewMetadata,
    IViewUserStyleData,
    IViewEventRegistration
} from "../../../component/view";
import { IDEUIComponent } from "../../../component/ide-ui-component";
import {
    ProjectItem
} from "../../project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";

import * as _ from "lodash";

@ViewMetadata({
    name: "PItemView",
    templateHTML: PItemEditorsViewTmpl
})
export class PItemView extends View {
    private _focusState: boolean;
    private editorsMap: { [selector: string]: any };
    private focusEditor: string;

    private pitemTmpl: any;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private _pi: ProjectItem,
        private editorsSel: Array<string>,
        private view: any
    ) {
        super(
            parent,
            name,
            templateHTML,
            style,
            hookSelector
        );
        this.pitemTmpl = _.template(this.view.template);
        this.editorsMap = {};
        this._focusState = false;
        this.focusEditor = null;
    }

    public render(callback?: Function): void {
        let $local = $($.parseHTML(this.pitemTmpl(this._pi.itemData())));
        let pitemId = this._pi.systemID;
        this.editorsSel.forEach(
            sel => $local.find("." + sel).attr("id", "pi_"+pitemId + "_" + sel)
        );
        this.template = "<div class=\"project-item-container\" style=\"height: 100%\">"
            + $local[0].outerHTML
            + "</div>";
        this.renderTmplEl();
    }

    public registerEvents(): void {
        this.attachEvents(...this.view.events);
    }

    public addEditor(selector, editor) {
        this.editorsMap[selector] = editor;
        this.focusEditor = selector;
    }

    public getFocusEditorId(): string {
        return this.focusEditor;
    }

    public getOnFocusEditor(): string {
        return this.editorsMap[this.focusEditor];
    }

    public get focusState(): boolean {
        return this._focusState;
    }

    public focus(): void {
        if (!this._focusState) {
            this._focusState = true;
            this.view.focus();
        }
    }

    public focusOut(): void {
        if (this._focusState) {
            this._focusState = false;
            this.view.focusOut();
        }
    }

    public get pi(): ProjectItem {
        return this._pi;
    }
}
