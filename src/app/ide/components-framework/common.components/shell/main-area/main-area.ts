/// <reference path="../../../../../../../node.d.ts"/>
import MainAreaTmpl from "./main-area.html";
import { View, IViewElement, ViewMetadata } from "../../../component/view";

export interface IShellMainAreaViewElement extends IViewElement {
    view: MainArea;
}

@ViewMetadata({
    name: "MainArea",
    templateHTML: MainAreaTmpl
})
export class MainArea extends View {
    
    public render(): void {}
    
    public registerEvents(): void {}

    public update(): void {
        ;
    }

    public onOpen(): void {
        ;
    }

    public onClose(): void {
        ;
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }
}