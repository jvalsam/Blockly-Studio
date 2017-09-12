/**
 * Menu - IDE Main Menu
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

/// <reference path="../../../../../../../node.d.ts"/>
import StartPageMenuTmpl from "./start-page-menu.html";
import { IDEUIComponent, UIComponentMetadata, IViewDataComponent } from "../../../ide-ui-component";
import { ExportedFunction } from "../../../ide-component";

@UIComponentMetadata({
    name: "StartPageMenu",
    description: "Start Page Menu",
    selector: "#menu-area",
    templateHTML: StartPageMenuTmpl
})
export class StartPageMenu extends IDEUIComponent {
    
    public Initialize(): void {
        super.Initialize();
        // TODO: setup events of the components
    }

    public Update(): void {
        ;
    }

    public OnOpen(): void {
        ;
    }

    public GetView(): IViewDataComponent {
        return {
            menubar: this._templateJQ.html()
        };
    }

    public OnClose(): void {
        ;
    }

    public Destroy(): void {
        // first call destroy of the other components and then close
    }
}