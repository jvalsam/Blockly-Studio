/**
 * Toolbar - IDE Toolbar hosts component tools
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "../../../component/ide-ui-component";
import { UIComponentMetadata } from "../../../component/component-loader";
import { IViewElements } from "../../../component/component-view";
import { ToolbarView } from "./toolbar-view";


@UIComponentMetadata({
    description: "IDE toolbar hosts tools of the components",
    componentView: "ToolbarView",
    menuDef: ""
})
export class Toolbar extends IDEUIComponent {
    protected _tools: Array<string> = [];

    public addTools(tools: IViewElements): void {
        if (Object.keys(tools).length !== 0) {
            (<ToolbarView>this.view).addTools(tools);
        }
    }

    public removeTools(tools: IViewElements): void {
        (<ToolbarView>this.view).removeTools(tools);
    }

    public render(): void {

    }

    public registerEvents(): void {

    }

    addTool(tool: string): void {
        this._tools.push(tool);
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