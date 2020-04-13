/// <reference path="../../../../../../../node.d.ts"/>
import PItemEditorsViewTmpl from "./pitem-view.tmpl";
import {
    View,
    ViewMetadata,
    IViewUserStyleData,
    IViewEventRegistration
} from "../../../component/view";
import * as _ from "lodash";
import { IDEUIComponent } from "../../../component/ide-ui-component";
import { ProjectItem } from "../../project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";

@ViewMetadata({
    name: "PItemView",
    templateHTML: PItemEditorsViewTmpl
})
export class PItemView extends View {
    private editorsMap: { [selector: string]: any };

    private static Template(
        containerHTML: string,
        pitemHTML: string,
        pitemId: string,
        editorsSel: Array<string>
    ): string {
        let tmpl = $($.parseHTML(containerHTML)).append(pitemHTML);
        editorsSel.forEach(sel => tmpl.find("."+sel).attr("id", pitemId + "_" + sel));
        return tmpl.html();
    }

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private pi: ProjectItem,
        editorsSel: Array<string>,
        pitemHTML: string,
        private tmplEvts: Array<IViewEventRegistration>
    ) {
        super(
            parent,
            name,
            PItemView.Template(
                templateHTML,
                pitemHTML,
                pi.systemID,
                editorsSel),
            style,
            hookSelector
        );
        this.editorsMap = {};
    }

    public render(callback?: Function): void {
        this.renderTmplEl(this.pi.itemData());
    }

    public registerEvents(): void {
        this.attachEvents(...this.tmplEvts);
    }

    public addEditor(selector, editor) {
        this.editorsMap[selector] = editor;
    }
}
