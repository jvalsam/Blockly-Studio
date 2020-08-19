

/// <reference path="../../../../../node.d.ts"/>
import ICETmpl from "./ice.tmpl";

import {
    ComponentView,
    ComponentViewElement,
    ComponentViewElementMetadata,
    ComponentViewMetadata,
} from "../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "ICEView",
    //selector: ".main-area-container",
    templateHTML: ICETmpl
})
export class ICEView extends ComponentView {

    public registerEvents (): void {
    }

    public render (): void {
    }
}