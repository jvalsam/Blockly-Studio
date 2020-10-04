

/// <reference path="../../../../../node.d.ts"/>
import SmartObjectVPLEditorTmpl from "./smartobjectvpleditor.tmpl";

import {
    ComponentView,
    ComponentViewMetadata
} from "../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "SmartObjectVPLEditorView",
    templateHTML: SmartObjectVPLEditorTmpl
})
export class SmartObjectVPLEditorView extends ComponentView {

    public registerEvents (): void {
    }

    public render (): void {
        this.parent.render();
    }
}