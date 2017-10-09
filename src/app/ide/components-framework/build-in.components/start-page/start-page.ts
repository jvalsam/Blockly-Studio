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
import { ViewRegistry } from "../../view/view-registry";
import { ExportedFunction } from "../../component/ide-component";
import { StartPageMenu, IStartPageMenuViewElement } from "./start-page-menu/start-page-menu";
import { ApplicationListSP, IStartPageApplicationListViewElement } from "./start-page-elements/application-list-s-p/application-list-s-p";
import { SmartObjectListSP, IStartPageSmartObjectListViewElement } from "./start-page-elements/smart-object-list-s-p/smart-object-list-s-p";

@UIComponentMetadata({
    name: "StartPageComponent",
    description: "Start page of the IDE",
    selector: ".start-page-container",
    templateHTML: StartPageTmpl,
    version: "1.0"
})
export class StartPageComponent extends IDEUIComponent {
    private _menu: IStartPageMenuViewElement;
    private _smartObjects: IStartPageSmartObjectListViewElement;
    private _applications: IStartPageApplicationListViewElement;

    constructor(
        _name: string,
        _description: string,
        _selector: string,
        _templateHTML: string
    ) {
        super(_name, _description, _selector, _templateHTML);
        // view elements
        this._menu = {
            selector: ".menu-container",
            view: <StartPageMenu>ViewRegistry.getViewEntry("StartPageMenu").create(this)
        };
        this._applications = {
            selector: ".application-list-view-area",
            view: <ApplicationListSP>ViewRegistry.getViewEntry("ApplicationsListStartPage").create(this)
        };
        this._smartObjects = {
            selector: ".smart-object-list-view-area",
            view: <SmartObjectListSP>ViewRegistry.getViewEntry("SmartObjectListStartPage").create(this)
        };
    }

    @ExportedFunction
    public initialize(): void {
        super.initialize();
        this._menu.view.render();
        this.inject(this._applications);
        this.inject(this._smartObjects);
    }

    @ExportedFunction
    public registerEvents(): void {}

    @ExportedFunction
    public update(): void {
        this._menu.view.update();
        this._smartObjects.view.update();
        this.inject(this._smartObjects);
        this._applications.view.update();
        this.inject(this._applications);
    }

    @ExportedFunction
    public onOpen(): void {
        this._applications.view.onOpen();
        this._smartObjects.view.onOpen();
    }

    @ExportedFunction
    public onClose(): void {
        this._menu.view.onClose();
        this._applications.view.onClose();
        this._smartObjects.view.onClose();
    }

    @ExportedFunction
    public getView(): IViewDataComponent {
        return {
            main: this.templateJQ,
            menubar: this._menu.view.$el
        };
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }
}