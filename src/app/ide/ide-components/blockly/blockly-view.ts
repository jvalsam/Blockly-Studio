

/// <reference path="../../../../../node.d.ts"/>
import BlocklyTmpl from "./blockly.html";

import {
    ComponentView,
    ComponentViewElement,
    ComponentViewElementMetadata,
    ComponentViewMetadata,
} from "../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "BlocklyView",
    selector: ".main-area-container",
    templateHTML: BlocklyTmpl,
    toolsElems: [ "BlocklyToolbarView" ]
})
export class BlocklyView extends ComponentView {

    public registerEvents (): void {
    }

    public render (): void {
        this.parent.render();
    }
}