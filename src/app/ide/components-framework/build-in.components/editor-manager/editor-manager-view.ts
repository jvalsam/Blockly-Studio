
import EditorManagerTmpl from "./editor-manager.html";
import { ComponentView, ComponentViewMetadata } from "../../component/component-view";
import { Editor } from "./editor";

@ComponentViewMetadata({
    name: "EditorManagerView",
    selector: ".editor-manager-container",
    templateHTML: EditorManagerTmpl
})
export class EditorManagerView extends ComponentView {
    private editorOnFocus: Editor;

    public update(editor: Editor): void {
        if (this.editorOnFocus && this.editorOnFocus.id===editor.id) {
            return;
        }

        if (this.editorOnFocus) {
            this.editorOnFocus.view.detachAllEvents();
            $(this.editorOnFocus.selector).hide();
        }

        this.editorOnFocus = editor;
        this.editorOnFocus.registerEvents();

        if (this.editorOnFocus.isRendered) {
            $(this.editorOnFocus.selector).show();
        }
        else {
            this.editorOnFocus.render();
        }
    }

    private clearEditorAreaContainer(): void {
        $(".editors-area-container").css("margin-top", "0px");
    }

    public render(): void {
        super.render();
        if (this.editorOnFocus) {
            this.clearEditorAreaContainer();
            this.editorOnFocus.render();
            if (this.editorOnFocus.name !== "BlocklyVPL") {
                this.$el.find(this.editorOnFocus.view.selector).empty();
                this.$el.find(this.editorOnFocus.view.selector).append(this.editorOnFocus.view.$el);
            }
        }
    }

    public prepareEditorArea(): void {
        if (!this.editorOnFocus) {
            this.$el.empty();
        }
    }
}