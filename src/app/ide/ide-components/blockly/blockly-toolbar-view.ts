import { ComponentsCommunication } from "../../components-framework/component/components-communication";
import BlocklyToolbarTmpl from "./blockly-toolbar.html";
import { ComponentViewElementMetadata } from "../../components-framework/component/component-view";
import { ComponentViewElement } from "../../components-framework/component/component-view";
import { BlocklyVPL } from "./blockly";

@ComponentViewElementMetadata({
    name: "BlocklyToolbarView",
    selector: ".tools-view-container",
    templateHTML: BlocklyToolbarTmpl
})
export class BlocklyToolbarView extends ComponentViewElement {
    public render(): void {
        this.renderTmplEl();
        this.registerEvents();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-blockly-undo-toolbar-btn",
                handler: () => ComponentsCommunication.functionRequest(
                    "Toolbar",
                    this.parent.name, "undo", [],
                    (<BlocklyVPL>this.parent).requestOnFocusEditorId()
                )
            },
            {
                eventType: "click",
                selector: ".ts-blockly-redo-toolbar-btn",
                handler: () => ComponentsCommunication.functionRequest(
                    "Toolbar",
                    this.parent.name, "redo", [],
                    (<BlocklyVPL>this.parent).requestOnFocusEditorId()
                )
            }
        );
    }

}