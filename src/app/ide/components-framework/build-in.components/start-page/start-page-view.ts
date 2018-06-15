/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.html";
import { ComponentView, ComponentViewMetadata } from "../../../components-framework/component/component-view";
import { DomainView } from "./domain-view/domain-view";


@ComponentViewMetadata({
    name: "StartPageView",
    //selector: ".start-page-container",
    templateHTML: StartPageTmpl,
    mainElems: [
        {
            name:       "DomainView",
            selector:   ".domain-view-area"
        }
    ]
})
export class StartPageView extends ComponentView {
    // private _domainView: DomainView;

    // public render(callback?: Function): void {
    //     this.renderTmplEl();
    //     this.registerEvents();
    //     this._domainView.render(
    //         () => {
    //             this.$el.find(".domain-view-area").empty();
    //             this.$el.find(".domain-view-area").append(this._domainView.$el);
    //             callback();
    //         }
    //     );
    // }

    // public registerEvents(): void {}
}