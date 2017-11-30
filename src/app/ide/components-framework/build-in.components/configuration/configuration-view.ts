/// <reference path="../../../../../../node.d.ts"/>
import ConfigurationViewTmpl from "./configuration.html";
import { ComponentViewMetadata } from "./../../component/component-view";
import { ComponentView } from "../../component/component-view";

@ComponentViewMetadata({
    name: "ApplicationWSPEditorView",
    selector: "",
    templateHTML: ConfigurationViewTmpl,
    menuElems:[]
})
export class ConfigurationView extends ComponentView {

    public render(): void {

    }

    public registerEvents(): void {

    }

}