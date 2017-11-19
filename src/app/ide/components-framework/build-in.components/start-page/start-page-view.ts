

/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.html";
import {
    ComponentView,
    ComponentViewElement,
    ComponentViewElementMetadata,
    ComponentViewMetadata,
} from "../../../components-framework/component/component-view";




// mainViewElem: {
//     selector: ".ide-container",
//         viewElem: "StartPageViewElement"
// },
// menuViewElems: [{
//     selector: ".menu-container",
//     viewElem: "StartPageMenuViewElement"
// }],


@ComponentViewMetadata({
    name: "StartPageView",
    selector: ".start-page-container",
    templateHTML: StartPageTmpl,
    mainElems: [
        "ApplicationsListStartPage",
        "SmartObjectListStartPage"
    ]
})
export class StartPageView extends ComponentView {
//     this._menu = {
//     selector: ".menu-container",
//     view: <StartPageMenu>ViewRegistry.getViewEntry("StartPageMenu").create(this)
// };
// this._applications = {
//     selector: ".application-list-view-area",
//     view: <ApplicationListSP>ViewRegistry.getViewEntry("ApplicationsListStartPage").create(this)
// };
// this._smartObjects = {
//     selector: ".smart-object-list-view-area",
//     view: <SmartObjectListSP>ViewRegistry.getViewEntry("SmartObjectListStartPage").create(this)
// };

    // public registerEvents (): void {
    // }

    // public render (): void {
    // }
}