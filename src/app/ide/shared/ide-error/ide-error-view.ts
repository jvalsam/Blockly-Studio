import ErrorViewTmpl from "./ide-error.html";
import { View, ViewMetadata } from "../../components-framework/component/view";


@ViewMetadata({
    name: "IDEErrorView",
    templateHTML: ErrorViewTmpl
})
export class IDEErrorView extends View {
    private errorMsg: string;

    public alert(msg: string): void {
        this.errorMsg = msg;
        this.render();
        // TODO: UI alert...
        alert(msg);
        // this.$el.dialog({
        //     draggable: false
        // });
    }

    registerEvents(): void {}

    render(): void {
        this.renderTmplEl({ errorMsg: this.errorMsg });
        this.registerEvents();
    }
}
