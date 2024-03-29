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
        private view: any,
        private onDialogue: number = 0
    ) {
        super(
            parent,
            name,
            templateHTML,
            style,
            hookSelector
        );
        this.pitemTmpl = _.template(
            this.view.template
        );
        this.editorsMap = {};
        this._focusState = false;
        this.focusEditor = null;
    }

    public get pitem() {
        return this._pi;
    }

    public get editorsSel(): Array<string> {
        let selectors = [];
        for (const key in this._pi.editorsData.items) {
            selectors.push(
                this._pi.editorsData.items[key].editorId
                + (this.onDialogue > 0
                    ? "_dialogue_" + this.onDialogue
                    : ""));
        }
        return selectors;
    }

    public set selector(sel: string) {
        this._selector = sel;
    }

    public render(callback?: Function): void {
        let $local = $($.parseHTML(this.pitemTmpl(this._pi.itemData())));
        for (const key in this._pi.editorsData.items) {
            let item = this._pi.editorsData.items[key];
            if (item.noRenderOnPitemLoading) continue;
            let editorId = item.editorId
                + (this.onDialogue > 0
                    ? "_dialogue_" + this.onDialogue
                    : "");
            $local.find("." + item.tmplSel).attr("id", editorId);
            this.template = "<div class=\"project-item-container\" style=\"height: 100%\">"
            + $local[0].outerHTML
            + "</div>";
        }
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

    public destroy(): void {
        this.onDialogue = 0;
        for (let editorId of Object.keys(this.editorsMap)) {
            this.parent["closeEditorInstance"](editorId, this.editorsMap[editorId]);
        }
        super.destroy();
    }
}
