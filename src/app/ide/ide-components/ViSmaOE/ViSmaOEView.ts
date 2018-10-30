import { ComponentView, ComponentViewMetadata } from "../../components-framework/component/component-view";


@ComponentViewMetadata({
    name: "ViSmaOEView",
    templateHTML: `<div class="vismaoe-container"></div>`
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
        this.parent.render();
    }
}
