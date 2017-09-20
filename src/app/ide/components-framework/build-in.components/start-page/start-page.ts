/**
 * StartPageComponent - Start Page Component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

/// <reference path="../../../../../../node.d.ts"/>
import StartPageTmpl from "./start-page.html";
import {
    IDEUIComponent,
    UIComponentMetadata,
    IViewDataComponent
} from "../../component/ide-ui-component";
import { ComponentRegistry } from "../../component/component-registry";
import { ViewRegistry } from "../../view/view-registry";
import { ExportedFunction } from "../../component/ide-component";
import { StartPageMenu } from "./start-page-menu/start-page-menu";
import { ApplicationListSP } from "./start-page-elements/application-list-s-p/application-list-s-p";
import { SmartObjectListSP } from "./start-page-elements/smart-object-list-s-p/smart-object-list-s-p";

@UIComponentMetadata({
    name: "StartPageComponent",
    description: "Start page of the IDE",
    selector: "#start-page",
    templateHTML: StartPageTmpl,
    version: "1.0"
})
export class StartPageComponent extends IDEUIComponent {
    private _menu: StartPageMenu;
    private _smartObjects: SmartObjectListSP;
    private _applications: ApplicationListSP;

    constructor(
        _name: string,
        _description: string,
        _selector: string,
        _templateHTML: string
    ) {
        super(_name, _description, _selector, _templateHTML);
        this._menu = <StartPageMenu>ViewRegistry.getViewEntry("StartPageMenu").create();
        this._applications = <ApplicationListSP>ViewRegistry.getViewEntry("ApplicationsListStartPage").create();
        this._smartObjects = <SmartObjectListSP>ViewRegistry.getViewEntry("SmartObjectListStartPage").create();
    }

    @ExportedFunction
    public initialize(): void {
        super.initialize();
        this.inject(this._applications);
        this.inject(this._smartObjects);
    }

    @ExportedFunction
    public registerEvents(): void {}

    @ExportedFunction
    public update(): void {
        this._menu.update();
        this._smartObjects.update();
        this.inject(this._smartObjects);
        this._applications.update();
        this.inject(this._applications);
    }

    @ExportedFunction
    public onOpen(): void {
        this._applications.onOpen();
        this._smartObjects.onOpen();
    }

    @ExportedFunction
    public onClose(): void {
        this._menu.onClose();
        this._applications.onClose();
        this._smartObjects.onClose();
    }

    @ExportedFunction
    public getView(): IViewDataComponent {
        return {
            main: this.templateHTML,
            menubar: this._menu.templateHTML
        };
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }
}