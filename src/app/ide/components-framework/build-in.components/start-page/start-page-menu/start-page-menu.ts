/**
 * Menu - IDE Main Menu
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

/// <reference path="../../../../../../../node.d.ts"/>
import StartPageMenuTmpl from "./start-page-menu.html";
import { View, ViewMetadata } from "../../../view/view";

@ViewMetadata({
    name: "StartPageMenu",
    selector: "#menu-area",
    templateHTML: StartPageMenuTmpl
})
export class StartPageMenu extends View {

    public initialize(): void {
        super.initialize();
        // TODO: setup events of the components
    }

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