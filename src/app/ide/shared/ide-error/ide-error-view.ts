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
    }

    registerEvents(): void {}
    setStyle(): void {}

    render(): void {
        this.renderTmplEl({ errorMsg: this.errorMsg });
        $("div.modal-area").empty();
        $("div.modal-area").append(this.$el);
        $("#" + this.id)["modal"]("show");
    }

    update(data:any): void { this.errorMsg = data; }
}
