/**
 * StartPageViewElement - Start Page View Element
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */

/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.html";
import {
    ComponentViewElemMetadata,
    ComponentViewElement
} from "../../component/component-view-element";
import { ApplicationListSP } from "./start-page-elements/application-list-s-p/application-list-s-p";
import { SmartObjectListSP } from "./start-page-elements/smart-object-list-s-p/smart-object-list-s-p";


@ComponentViewElemMetadata({
    name: "StartPageViewElement",
    selector: ".start-page-container",
    templateHTML: StartPageTmpl
})
export class StartPageViewElement extends ComponentViewElement {
    private _smartObjects: SmartObjectListSP;
    private _applications: ApplicationListSP;

    
}
