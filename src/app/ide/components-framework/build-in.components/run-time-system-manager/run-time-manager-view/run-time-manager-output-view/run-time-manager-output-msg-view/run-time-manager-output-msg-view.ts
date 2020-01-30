import {
    ComponentViewElementMetadata,
    ComponentViewElement
} from "../../../../../component/component-view";

/// <reference path="../../../../../../node.d.ts"/>
import RuntimeManagerOutputMsgTmpl from "./run-time-manager-output-msg-view.tmpl";
import RuntimeManagerOutputMsgSYCSS from "./run-time-manager-output-msg-view.sycss";

@ComponentViewElementMetadata({
    name: "RuntimeManagerOutputMsgView",
    templateHTML: RuntimeManagerOutputMsgTmpl,
    style: {
        system: RuntimeManagerOutputMsgSYCSS
    }
})
export class RuntimeManagerOutputMsgView extends ComponentViewElement {
    
}
