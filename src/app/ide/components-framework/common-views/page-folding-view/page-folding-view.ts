import { IDEUIComponent } from "../../component/ide-ui-component";
import { View, ViewMetadata } from "../../component/view";

import * as _ from "lodash";

import PageFoldingViewTmpl from "./folder-view.html";

type PlusImg = "fa fa-plus-square";
type MinusImg = "fa fa-minus-square";
type FASize = "fa-lg" | "fa-2x" | "fa-3x" | "fa-4x" | "fa-5x";

interface PageFoldingData {
    folding: boolean;
    selector: string;
    imgSet: {
        plus: PlusImg,
        minus: MinusImg
    };
    style?: {
        color: string;
        size ?: FASize;
    };
}

@ViewMetadata({
    name: "PageFoldingView",
    templateHTML: PageFoldingViewTmpl
})
export class PageFoldingView extends View {
    private readonly pfStyleSelector = ".page-folding-link-icon";
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        hookSelector: string,
        private data: PageFoldingData
    ) {
        super(parent, name, templateHTML, hookSelector);
    }

    public setDefault(): void {
        this.data = {
            folding: true,
            selector: this.data.selector,
            imgSet: {
                plus: "fa fa-plus-square",
                minus: "fa fa-minus-square"
            },
            style: {
                color: "#f0f8ff",
                size: "fa-lg"
            }
        };
    }
    
    public setData(data: any): void {
        this.data = data;
    }

    public pfSelector(pfSel: string): void {
        this.data.selector = pfSel;
    }

    public render(): void {
        this.renderTmplEl(this.data);
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

    public setStyle(): void {
        if (this.data.style && this.data.style.color) {
            let $el = this.$el.find(this.pfStyleSelector);
            $el.css("color: "+this.data.style.color);
            if (this.data.style.size) {
                $el.addClass(this.data.style.size);
            }
        }
    }

    public onClick(): void {
        this.data.folding = !this.data.folding;
        // folding/unfolding action

        this.parent["onClickHomePage"]();
    }
}
