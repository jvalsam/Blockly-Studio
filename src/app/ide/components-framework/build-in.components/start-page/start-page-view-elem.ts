/**
 * StartPageViewElement - Start Page View Element
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */

/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.tmpl";
import { ComponentViewElement, ComponentViewElementMetadata } from "../../component/component-view";
import { ApplicationListSP } from "../applications-view/application-list-s-p/application-list-s-p";


@ComponentViewElementMetadata({
    name: "StartPageViewElement",
    templateHTML: StartPageTmpl
})
export class StartPageViewElement extends ComponentViewElement {
    private _applications: ApplicationListSP;

    public render(): void {
        
    }

    public registerEvents(): void {

    }
}
