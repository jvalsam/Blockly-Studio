/**
 * Menu - IDE Main Menu
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import { IDEUIComponent, UIComponentMetadata, IViewDataComponent } from "../../../ide-ui-component";
import { ExportedFunction } from "../../../ide-component";

@UIComponentMetadata({
    name: "Toolbar",
    description: "Toolbar area of the IDE",
    selector: "#toolbar-area",
    templateHTML: "toolbar.html"
})
export class Toolbar extends IDEUIComponent {
    protected _tools: Array<string> = [];

    get tools(): Array<string> {
        return this._tools;
    }

    set tools(ntools: Array<string>) {
        this._tools = ntools;
    }

    addTool(tool: string): void {
        this._tools.push(tool);
    }

    public Update(): void {
        ;
    }

    public OnOpen(): void {
        ;
    }

    public GetView(): IViewDataComponent {
        return {
            tools: this._templateJQ.html()
        };
    }

    public OnClose(): void {
        ;
    }

    public Destroy(): void {
        // first call destroy of the other components and then close
    }
}