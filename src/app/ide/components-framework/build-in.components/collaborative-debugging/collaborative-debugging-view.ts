import {
    ComponentView,
    ComponentViewMetadata
} from "../../component/component-view";

import CollaborativeDebuggingTmpl from "./collaborative-debugging-view.tmpl";
import CollaborativeDebuggingSYCSS from "./collaborative-debugging-view.sycss";

@ComponentViewMetadata({
    name: "CollaborativeDebuggingView",
    templateHTML: CollaborativeDebuggingTmpl,
    style: {
        system: CollaborativeDebuggingSYCSS
    }
})
export class CollaborativeDebuggingView extends ComponentView {
}
