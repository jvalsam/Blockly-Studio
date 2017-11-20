import { ComponentsCommunication } from './../../components-framework/component/components-communication';
import BlocklyToolbarTmpl from "./blockly-toolbar.html";
import { ComponentViewElementMetadata } from './../../components-framework/component/component-view';
import { ComponentViewElement } from "../../components-framework/component/component-view";

@ComponentViewElementMetadata({
    name: "BlocklyToolbarView",
    selector: ".tools-view-container",
    templateHTML: BlocklyToolbarTmpl
})
export class BlocklyToolbarView extends ComponentViewElement {
    public render(): void {
        this.$el = $(this.template());
        this.registerEvents();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-blockly-undo-toolbar-btn",
                // TODO: fix it for id multiple instances
                handler: () => ComponentsCommunication.functionRequest("Toolbar", this.parent.name, "undo")
            },
            {
                eventType: "click",
                selector: ".ts-blockly-redo-toolbar-btn",
                // TODO: fix it for id multiple instances
                handler: () => ComponentsCommunication.functionRequest("Toolbar", this.parent.name, "redo")
            }
        );
    }

}