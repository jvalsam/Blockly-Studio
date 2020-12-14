import {
    ComponentView,
    ComponentViewMetadata
} from "../../component/component-view";

import DebuggerViewTmpl from "./debugger-view.tmpl";
import DebuggerViewSYCSS from "./debugger-view.sycss";

@ComponentViewMetadata({
    name: "DebuggerView",
    templateHTML: DebuggerViewTmpl,
    style: {
        system: DebuggerViewSYCSS
    }
})
export class DebuggerView extends ComponentView {
}
