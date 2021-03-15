
/// <reference path="../../../../../../../../../node.d.ts"/>
import DebuggerInfoViewTmpl from "./debugger-info-view.tmpl";
import DebuggerInfoViewSYCSS from "./debugger-info-view.sycss";
import { View, ViewMetadata, ModalView, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import * as _ from "lodash";

@ViewMetadata({
    name: "DebuggerInfoView",
    templateHTML: DebuggerInfoViewTmpl,
    style: { system: DebuggerInfoViewSYCSS }
})
export class DebuggerInfoView extends View {
    // variables data
    private envTree: any;
    private isRendered: boolean;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private info: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.isRendered = false;
    }

    public registerEvents(): void {}

    public setStyle(): void {}

    private initJSTree(callback): void {
        if (this.isRendered) {
            $("#debugger-variables")["jstree"](true)
                .settings
                .core
                .data = this.envTree;
            $("#debugger-variables")["jstree"](true)
                .refresh();
        }
        else {
            $("#debugger-variables")["jstree"]({
                "plugins": [
                    "wholerow", // has to be first for the highlighted categories
                    "colorv",
                    "contextmenu",
                    "types",
                    "sort"
                ],
                "contextmenu": {
                    "items": (node) => { alert("test..."); }
                },
                // "types": this.types,
                "core": {
                    "check_callback": true,
                    "data": this.envTree
                }
            });
            this.isRendered = true;
            $("#debugger-variables").on("ready.jstree", function() {
                callback();
            });
        }
    }

    public setEnvironmentData(envTree, callback?: Function) {
        this.envTree = envTree;
        this.initJSTree(callback);
    }

    public render(): void {
        this.renderTmplEl();
        //TODO: create new elements for the tabs view
    }
}
