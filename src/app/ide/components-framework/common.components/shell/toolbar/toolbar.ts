import { IDEUIComponent } from "../../../component/ide-ui-component";
import { UIComponentMetadata, ExportedFunction } from "../../../component/component-loader";
import { IViewElements } from "../../../component/component-view";
import { ToolbarView } from "./toolbar-view";


@UIComponentMetadata({
    description: "IDE toolbar hosts tools of the components",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "November 2017"
        }
    ],
    componentView: "ToolbarView"
})
export class Toolbar extends IDEUIComponent {
    protected _tools: Array<string> = [];

    @ExportedFunction
    public addTools(tools: IViewElements): void {
        if (Object.keys(tools).length !== 0) {
            (<ToolbarView>this.view).addTools(tools);
        }
    }

    public removeTools(tools: IViewElements): void {
        (<ToolbarView>this.view).removeTools(tools);
    }

    public registerEvents(): void {
        this.view.registerEvents();
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
        alert("Close Toolbar not implemented yet!");
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }

    public hide(): void {
        this._view.hide();
    }

    public show(): void {
        this._view.show();
    }
}
