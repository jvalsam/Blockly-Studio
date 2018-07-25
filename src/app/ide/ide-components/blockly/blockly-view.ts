

/// <reference path="../../../../../node.d.ts"/>
import BlocklyTmpl from "./blockly.tmpl";

import { ComponentView, ComponentViewMetadata } from "../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "BlocklyView",
    templateHTML: BlocklyTmpl,
    toolsElems: [
        {
            name: "BlocklyToolbarView",
            selector: ".tools-view-container"
        }
    ]
})
export class BlocklyView extends ComponentView {

    public registerEvents (): void {
    }

    public render (): void {
        this.parent.render();
    }
}