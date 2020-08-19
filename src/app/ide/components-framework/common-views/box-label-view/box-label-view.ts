
/// <reference path="../../../../../../node.d.ts"/>
import BoxLabelViewTmpl from "./box-label-view.tmpl";
import BoxLabalViewSYCSS from "./box-label-view.sycss";
import { View, ViewMetadata, IViewEventRegistration, IViewUserStyleData } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import * as _ from "lodash";
import { PageFoldingView } from "../page-folding-view/page-folding-view";
import { ViewRegistry } from "../../component/registry";

@ViewMetadata({
    name: "BoxLabelView",
    templateHTML: BoxLabelViewTmpl,
    style: { system: BoxLabalViewSYCSS }
})
export class BoxLabelView extends View {
    private foldingView: PageFoldingView;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        this.data.id = this.id;

        this.foldingView = <PageFoldingView>ViewRegistry.getEntry("PageFoldingView").create(this.parent, "#folding-area-"+this.id);
        this.foldingView.setPFSelector("#box-elements-"+this.id);
    }

    public registerEvents(): void {
        let events: IViewEventRegistration[] = [];
        _.forEach(this.data.actions, (action) => {
            _.forEach(action.events, (event) => {
                events.push({
                    eventType: event.type,
                    selector: "#" + action.title.replace(/ /g, '') + "_" + this.id,
                    handler: () => typeof event.callback === "string" ?
                                        (event.providedBy === "Platform" ?
                                            this.parent[event.callback]() :
                                            this.parent["onOuterFunctionRequest"](event.providedBy, event.callback)
                                        ) :
                                        event.callback()
                });
            });
        });
        this.attachEvents(...events);
    }
    public setStyle(): void {}

    public render(): void {
        this.data.type = this.type;
        this.renderTmplEl(this.data);

    }
}
