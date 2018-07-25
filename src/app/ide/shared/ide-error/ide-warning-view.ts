import WarningViewTmpl from "./ide-warning.tmpl";
import { View, ViewMetadata } from "../../components-framework/component/view";


@ViewMetadata({
    name: "IDEWarningView",
    templateHTML: WarningViewTmpl
})
export class IDEWarningView extends View {
    private warningMsg: string;

    public alert(msg: string): void {
        this.warningMsg = msg;
        this.render();
        // TODO: UI alert...
        alert(msg);
    }

    registerEvents(): void {}
    setStyle(): void {}

    render(): void {
        this.renderTmplEl({ warningMsg: this.warningMsg });
    }
}