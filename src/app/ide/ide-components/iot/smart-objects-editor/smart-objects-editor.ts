import { UIComponentMetadata, ExportedFunction } from "./../../../components-framework/component/component-loader";
import { IDEUIComponent, IViewDataComponent } from "../../../components-framework/component/ide-ui-component";


@UIComponentMetadata({
    description: "Handle(Register, Edit, View, etc) Smart Objects",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "Octomber 2017"
        }
    ],
    componentView: "SmartObjectsEditorView"
})
export class SmartObjectsEditor extends IDEUIComponent {
    public onOpen(): void { }
    public destroy(): void { }
    public getView(): IViewDataComponent {
        return {
            main: this.view.$el
        };
    }
    public onClose(): void { }
    public registerEvents(): void { }
    public update(): void { }
    public load(): void {

    }
    public save(): void {
        
    }

    //
    // API for the project manager of the treeview of project elements
    //

    @ExportedFunction
    public onAddSmartObject(): void {
        // TODO: open view smart object define -> register new smart object or view already defined smart objects
    }

    @ExportedFunction
    public onViewAllSmartObjects(): void {

    }

    @ExportedFunction
    public onViewEnvironment(): void {

    }

    @ExportedFunction
    public onEditEnvironment(): void {

    }

    @ExportedFunction
    public onViewSmartObject(): void {

    }

    @ExportedFunction
    public onEditSmartObject(): void {
        
    }

}
