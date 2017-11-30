
/// <reference path="../../../../../../node.d.ts"/>
import ApplicationWSPEditorTmpl from "./application-wsp-editor.html";
import {
    ComponentView,
    ComponentViewMetadata,
} from "../../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "ApplicationWSPEditorView",
    selector: "#app",
    templateHTML: ApplicationWSPEditorTmpl,
    mainElems: [
        "ApplicationsListStartPage",
        "SmartObjectListStartPage"
    ]
})
export class ApplicationWSPEditorView extends ComponentView {

    public registerEvents (): void {
    }

    public render (): void {
    }
}