import { IDEUIComponent } from "../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../component/view";

/// <reference path="../../../../../../node.d.ts"/>
import PageFoldingViewTmpl from "./page-folding-view.tmpl";
import PageFoldingViewSYCSS from "./page-folding-view.sycss";
import PageFoldingViewDUCSS from "./page-folding-view.ducss";

import * as $ from "jquery";
import "../../../../../../libs/paperfold";
import { IDEError } from './../../../shared/ide-error/ide-error';

type FoldIcon =
{ plus: "fa fa-plus-square", minus: "fa fa-minus-square" } |
{ plus: "fa fa-caret-right", minus: "fa fa-caret-down" } |
{ plus: "fa fa-angle-right", minus: "fa fa-angle-down" } |
{ plus: "fa fa-arrow-square-right", minus: "fa fa-arrow-square-down" };

type FASize = "fa-lg" | "fa-2x" | "fa-3x" | "fa-4x" | "fa-5x";

interface PageFoldingData {
    folding: boolean;
    selector: string;
    imgSet: FoldIcon;
}

@ViewMetadata({
    name: "PageFoldingView",
    templateHTML: PageFoldingViewTmpl,
    style: {
        system: PageFoldingViewSYCSS,
        user:  PageFoldingViewDUCSS
    }
})
export class PageFoldingView extends View {
    private readonly pfStyleSelector = ".page-folding-link-icon";
    private _paperfold: any;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        private data: PageFoldingData
    ) {
        super(parent, name, templateHTML, style, hookSelector);
        if(!data) {
            this.setDefault();
        }
        this._paperfold = null;
    }

    public setDefault(): void {
        this.data = {
            folding: false,
            selector: (this.data && this.data.selector ? this.data.selector : ""),
            imgSet: {
                plus: "fa fa-plus-square",
                minus: "fa fa-minus-square"
            }
        };
    }

    public setFoldIcon(ficon: FoldIcon): void {
        this.data.imgSet = ficon;
    }
    
    public setData(data: any): void {
        this.data = data;
    }

    public setPFSelector(pfSel: string): void {
        this.data.selector = pfSel;
    }

    
    public setDuration(duration: number): void {
        if(this._paperfold) {
            this._paperfold.duration = duration;
        }
        else {
            IDEError.warn("PageFolding", "Paperfold is not initialized yet, duration of folding isn't able to be set!");
        }
    }


    public render(): void {
        this.renderTmplEl(this.data);

        if (this._paperfold === null) {
            this._paperfold = $(this.data.selector)["paperfold"]();
        }

        this.fold();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".page-folding-link",
                handler: () => this.onClick()
            }
        );
    }

    public fold(): void {
        if (this.data.folding) {
            this._paperfold.close();
        }
        else {
            this._paperfold.open();
        }
    }

    public onClick(): void {
        this.data.folding = !this.data.folding;
        this.render();
        // this.parent["onClickHomePage"]();
    }
}
