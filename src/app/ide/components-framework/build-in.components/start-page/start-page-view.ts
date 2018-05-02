/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.html";
import { ComponentView, ComponentViewMetadata } from "../../../components-framework/component/component-view";
import { ApplicationListSP } from "../applications-view/application-list-s-p/application-list-s-p";


@ComponentViewMetadata({
    name: "StartPageView",
    selector: ".start-page-container",
    templateHTML: StartPageTmpl
})
export class StartPageView extends ComponentView {
    private _applications: ApplicationListSP;

    public render(): void {
        this.renderTmplEl();
    }

    public registerEvents(): void {
        
    }
}