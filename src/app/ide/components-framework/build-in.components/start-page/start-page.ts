import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ExportedFunction,
    RequiredFunction,
    UIComponentMetadata
} from "../../component/component-loader";
import { ComponentsCommunication } from "../../component/components-communication";


@UIComponentMetadata({
    description: "Start page of the IDE",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "August 2017"
        }
    ],
    componentView: "StartPageView",
    version: "1.0"
})
export class StartPageComponent extends IDEUIComponent {

    constructor(name: string, description: string, componentView: string) {
        super(name, description, componentView);
    }

    @ExportedFunction
    public registerEvents(): void {}

    @ExportedFunction
    public update(): void {
        // this._menu.view.update();
        // this._smartObjects.view.update();
        // this.inject(this._smartObjects);
        // this._applications.view.update();
        // this.inject(this._applications);
    }

    @ExportedFunction
    public onOpen(): void {
        // this._applications.view.onOpen();
        // this._smartObjects.view.onOpen();
    }

    @ExportedFunction
    public onClose(): void {
        // this._menu.view.onClose();
        // this._applications.view.onClose();
        // this._smartObjects.view.onClose();
    }

    // public render(): void {
    //     super.render();
    //     this._menu.view.render();
    //     this.inject(this._applications);
    //     this.inject(this._smartObjects);
    // }

    public destroy(): void {
        // first call destroy of the other components and then close
    }

    /**
     * Requested events from Application View Box
     */

    @RequiredFunction("ApplicationWSPManager", "openApplication")
    public openApplication (applicationID: string): void {
        ComponentsCommunication.functionRequest(this.name, "ApplicationWSPManager", "openApplication", [applicationID]);
    }

    @RequiredFunction("ApplicationWSPManager", "deleteApplication")
    public deleteApplication (applicationID: string): void {
        ComponentsCommunication.functionRequest(this.name, "ApplicationWSPManager", "deleteApplication", [applicationID]);
    }

    @RequiredFunction("ApplicationWSPManager", "shareApplication")
    public shareApplication (applicationID: string, shareData: any): void {
        alert("Functionality of share is not implemented yet!");
        ComponentsCommunication.functionRequest(this.name, "ApplicationWSPManager", "shareApplication", [applicationID]);
    }
}