
/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.tmpl";

import { ComponentView, ComponentViewMetadata } from "../../../components-framework/component/component-view";

@ComponentViewMetadata({
    name: "StartPageView",
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