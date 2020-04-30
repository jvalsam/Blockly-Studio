import {
    ComponentView,
    ComponentViewMetadata
} from "../../component/component-view";

import CollaborationManagerTmpl from "./collaboration-manager-view.tmpl";
import CollaborationManagerSYCSS from "./collaboration-manager-view.sycss";

@ComponentViewMetadata({
    name: "CollaborationManagerView",
    templateHTML: CollaborationManagerTmpl,
    style: {
        system: CollaborationManagerSYCSS
    }
})
export class CollaborationManagerView extends ComponentView {

}
