/**
 * Menu - IDE Main Menu
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

/// <reference path="../../../../../../../node.d.ts"/>
import StartPageMenuTmpl from "./start-page-menu.html";
import { View, IViewElement, ViewMetadata } from "../../../view/view";


export interface IStartPageMenuViewElement extends IViewElement {
    view: StartPageMenu;
}

@ViewMetadata({
    name: "StartPageMenu",
    templateHTML: StartPageMenuTmpl
})
export class StartPageMenu extends View {

    public render(): void {
        this.registerEvents();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-start-page-home-btn",
                handler: this.onClickHoneButton
            },
            {
                eventType: "click",
                selector: ".ts-start-page-menu-applications-btn",
                handler: this.onClickApplicationsButton
            },
            {
                eventType: "click",
                selector: ".ts-start-page-menu-smart-object-btn",
                handler: this.onClickSmartObjectsButton
            },
            {
                eventType: "click",
                selector: ".ts-start-page-menu-about-btn",
                handler: this.onClickAboutButton
            }
        );
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

    /**
     *  Define events of start page menu
     */
    private onClickHoneButton(): void {
        alert("onClickHoneButton: not implemented yet.");
    }
    private onClickApplicationsButton(): void {
        alert("onClickApplicationsButton: not implemented yet.");
    }
    private onClickSmartObjectsButton(): void {
        alert("onClickSmartObjectsButton: not implemented yet.");
    }
    private onClickAboutButton(): void {
        alert("onClickAboutButton: not implemented yet.");
    }
}
