
/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.tmpl";

import { ComponentView, ComponentViewMetadata } from "../../../components-framework/component/component-view";

@ComponentViewMetadata({
    name: "StartPageView",
    templateHTML: StartPageTmpl,
    mainElems: [
        {
            name:       "DomainView",
            selector:   ".domain-view-area"
        }
    ]
})
export class StartPageView extends ComponentView {
}