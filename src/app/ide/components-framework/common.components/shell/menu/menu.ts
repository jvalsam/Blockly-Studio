/**
 * Menu - IDE Main Menu
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

/// <reference path="../../../../../../../node.d.ts"/>
import MenuTmpl from "./menu.html";
import { View, ViewMetadata } from "../../../view/view";
import { ExportedFunction } from "../../../component/ide-component";

@ViewMetadata({
    name: "Menu",
    selector: "#menu-area",
    templateHTML: MenuTmpl
})
export class Menu extends View {
    
    public render(): void {}

    public registerEvents(): void {
        
    }
    
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