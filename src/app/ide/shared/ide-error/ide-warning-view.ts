import WarningViewTmpl from "./ide-warning.html";
import { View, ViewMetadata } from "../../components-framework/view/view";


@ViewMetadata({
    name: "IDEWarningView",
    templateHTML: WarningViewTmpl
})
export class IDEWarningView extends View {
    private warningMsg: string;

    public alert(msg: string): void {
        this.warningMsg = msg;
        this.render();
        // TODO: alert...
    }

    registerEvents(): void {}

    render(): void {
        this.$el = $(this.template({ warningMsg: this.warningMsg }));
        this.registerEvents();
    }
}