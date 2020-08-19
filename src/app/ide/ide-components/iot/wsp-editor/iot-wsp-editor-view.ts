    

/// <reference path="../../../../../../node.d.ts"/>
import IoTWSPEditorTmpl from "./iot-wsp-editor.tmpl";
import { ComponentView, ComponentViewMetadata } from "../../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "IoTWSPEditorView",
    //selector: ".main-area-container",
    templateHTML: IoTWSPEditorTmpl,
    mainElems: [
    ]
})
export class IoTWSPEditorView extends ComponentView {

    public registerEvents (): void {
    }

    // public render (): void {
    //     super.render();
    // }
}