

/// <reference path="../../../../../node.d.ts"/>
import SmartObjectVPLEditorTmpl from "./smartobjectvpleditor.tmpl";
import SmartObjectVPLEditorSYCSS from "./smartobjectvpleditor.sycss";

import {
    ComponentView,
    ComponentViewMetadata
} from "../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "SmartObjectVPLEditorView",
    templateHTML: SmartObjectVPLEditorTmpl,
    style: {
        system: SmartObjectVPLEditorSYCSS
    }
})
export class SmartObjectVPLEditorView extends ComponentView {

    public registerEvents (): void {
    }

    public render (): void {
        this.parent.render();
    }
}