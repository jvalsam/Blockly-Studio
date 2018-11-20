import { ComponentView, ComponentViewMetadata } from "../../components-framework/component/component-view";
import ViSmaOEViewSYCSS from "./VismaOEView.sycss";


@ComponentViewMetadata({
    name: "ViSmaOEView",
    templateHTML: `<div class="vismaoe-container"></div>`,
    style: {
        system: ViSmaOEViewSYCSS
    }
    // ,
    // toolsElems: [
    //     {
    //         name: "BlocklyToolbarView",
    //         selector: ".tools-view-container"
    //     }
    // ]
})
export class ViSmaOEView extends ComponentView {
    public render (): void {
        super.render();
    }
}
