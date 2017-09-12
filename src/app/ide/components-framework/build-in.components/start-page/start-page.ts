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
} from "../../ide-ui-component";
import { ComponentRegistry } from "../../component-registry";
import { ExportedFunction } from "../../ide-component";
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
        this._menu = <StartPageMenu>ComponentRegistry.GetComponentEntry("StartPageMenu").Create();
        this._applications = <ApplicationListSP>ComponentRegistry.GetComponentEntry("StartPageComponentsViewApplications").Create();
        this._smartObjects = <SmartObjectListSP>ComponentRegistry.GetComponentEntry("StartPageComponentsViewSmartObjects").Create();
    }

    @ExportedFunction
    public Initialize(): void {
        super.Initialize();
        this._menu.Initialize();
        this._applications.Initialize();
        this.inject_c(this._applications);
        this._smartObjects.Initialize();
        this.inject_c(this._smartObjects);
    }

    @ExportedFunction
    public Update(): void {
        this._menu.Update();
        this._smartObjects.Update();
        this.inject_c(this._smartObjects);
        this._applications.Update();
        this.inject_c(this._applications);
    }

    @ExportedFunction
    public OnOpen(): void {
        this._applications.OnOpen();
        this._smartObjects.OnOpen();
    }

    @ExportedFunction
    public OnClose(): void {
        this._menu.OnClose();
        this._applications.OnClose();
        this._smartObjects.OnClose();
    }

    @ExportedFunction
    public GetView(): IViewDataComponent {
        return {
            main: this._templateJQ.html(),
            menubar: this._menu.GetView().menubar
        };
    }

    public Destroy(): void {
        // first call destroy of the other components and then close
    }
}