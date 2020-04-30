import {
    ComponentViewMetadata,
    ComponentView
} from './../../../component/component-view';

/// <reference path="../../../../../../../node.d.ts"/>
import RuntimeManagerTmpl from "./run-time-manager.tmpl";
import RuntimeManagerSYCSS from "./run-time-manager.sycss";

@ComponentViewMetadata({
    name: "RuntimeManagerView",
    templateHTML: RuntimeManagerTmpl,
    toolsElems: [
        {
            name: "RuntimeManagerToolbarView"
            , selector: ".tools-view-container"
        }
    ],
    mainElems: [
        {
            name: "RuntimeManagerInputView",
            selector: ".input-view-area"
        },
        {
            name: "RuntimeManagerOutputView",
            selector: ".output-view-area"
        }
    ],
    style: {
        system: RuntimeManagerSYCSS
    }
})
export class RuntimeManagerView extends ComponentView {
}
