/**
 * Main - IDE main area
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import { IDEUIComponent, UIComponentMetadata, IViewDataComponent } from "../../../ide-ui-component";
import { ExportedFunction } from "../../../ide-component";

@UIComponentMetadata({
    name: "MainArea",
    description: "Main area of the IDE",
    selector: "#main-area",
    templateHTML: "main-area.html"
})
export class MainArea extends IDEUIComponent {
    
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