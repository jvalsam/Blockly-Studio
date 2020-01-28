import {
    ComponentViewMetadata,
    ComponentView
} from './../../../component/component-view';

/// <reference path="../../../../../../../node.d.ts"/>
import RuntimeManagerTmpl from "./run-time-manager.tmpl";
import RuntimeManagerSYCSS from "./run-time-manager.sycss";

import * as _ from "lodash";
import { assert } from "./../../../../shared/ide-error/ide-error";

@ComponentViewMetadata({
    name: "RuntimeManagerView",
    templateHTML: RuntimeManagerTmpl,
    toolsElems: [
        {
            name: "RuntimeManagerToolbarView",
            selector: ".tools-view-container"
        }
    ],
    style: {
        system: RuntimeManagerSYCSS
    }
})
export class RuntimeManagerView extends ComponentView {

}
