

/// <reference path="../../../../../../node.d.ts"/>
import SmartObjectEditorTmpl from "./smart-object-editor.html";
import {
    ComponentView,
    ComponentViewMetadata,
} from "../../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "SmartObjectEditorView",
    //selector: ".main-area-container",
    templateHTML: SmartObjectEditorTmpl,
    mainElems: [
    ]
})
export class SmartObjectEditorView extends ComponentView {

    public registerEvents(): void {
    }

}