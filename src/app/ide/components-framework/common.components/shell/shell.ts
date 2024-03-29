﻿import { IDEUIComponent } from "../../component/ide-ui-component";
import { UIComponentMetadata, ExportedFunction } from "../../component/component-loader";
import { ComponentRegistry } from "../../component/component-entry";
import { ComponentsViewTree } from "./components-view-tree";
import { Menu } from "./menu/menu";
import { Toolbar } from "./toolbar/toolbar";
import * as $ from "jquery";
import "expose-loader?$!expose-loader?jQuery!jquery";
require("jquery/dist/jquery");
require("popper.js/dist/umd/popper");
require("bootstrap/dist/js/bootstrap");

@UIComponentMetadata({
  description: "The basic skeleton of the IDE where the other visual components are attached in order to build the whole environment",
  authors: [
    {
      name: "Yannis Valsamakis",
      email: "jvalsam@ics.forth.gr",
      date: "August 2017"
    }
  ],
  componentView: "ShellView",
  isUnique: true
})
export class Shell extends IDEUIComponent {
  private _menu: Menu;
  private _toolbar: Toolbar;
  private _firstCompIsLoad: boolean;

  constructor(
    name: string,
    description: string,
    compViewName: string,
    hookSelector: string
  ) {
    super(name, description, compViewName, hookSelector);
    this._firstCompIsLoad = false;
  }

  @ExportedFunction
  public initialize(): void {
    super.initialize();
    this.view.render();
    this._menu = <Menu>ComponentRegistry.getEntry("Menu").create([".menu-view-area"]);
    this._menu.render();
    this._toolbar = <Toolbar>ComponentRegistry.getEntry("Toolbar").create([".toolbar-view-area"]);
    this._toolbar.render();
    this._toolbar.hide();
  }

  @ExportedFunction
  public show(): void {
    this._view["show"]();
  }

  private updateComponentsViewTree(comp: IDEUIComponent) {
    if (!this._firstCompIsLoad) {
      ComponentsViewTree.setRootComponent(comp, ".main-area-container");
      this._firstCompIsLoad = true;
    }
    else {
      ComponentsViewTree.onOpenComponent(comp);
    }
  }

  @ExportedFunction
  public newToolbarArea(): string {
    return this._toolbar.addNewArea();
  }

  @ExportedFunction
  public deleteToolbarArea(selector: string): void {
    this._toolbar.deleteArea(selector);
  }

  @ExportedFunction
  public openComponent(comp: IDEUIComponent): void {
    //this.updateComponentsViewTree(comp);

    this._menu.activateMenuItems(comp.view.menuElems);
    this._toolbar.addTools(comp.view.toolElems);

    comp.render ();
  }

  private getSelector(selector: string): string {
    let index = 0;
    let prefix = selector.substr(1) + "_index_";
    while ($("#"+prefix + ++index).length !== 0);
    return prefix + index;
  }

  @ExportedFunction
  public createComponentEmptyContainer(comp: IDEUIComponent, viewArea: string, display: boolean = false): string {
    const selector = this.getSelector(comp.selector);
    const $newEl = $("<div id=\"" + selector + "\" class='" + comp.selector.substr(1) + " container-fluid' style=\"position: absolute\"></div>"); //  style=\"height: 480px; width: 600px; margin-top:10px;\"
    $(viewArea).append($newEl);
    return "#"+selector;
  }

  @ExportedFunction
  public closeComponent(compName: string): void {
    ;
  }

  public closeCurrentComponent(): void {

  }

  public destroy(): void {
    // first call destroy of the other components and then close
  }

  @ExportedFunction
  public registerEvents():void {
    ;
  }

  @ExportedFunction
  public update():void {
    ;
  }

  @ExportedFunction
  public addTools(tools): void {
    this._toolbar.addTools(tools);
    this.inject(this._toolbar);
  }

  @ExportedFunction
  public onOpen(): void {
    ;
  }

  @ExportedFunction
  public onClose(): void {
    ;
  }

  @ExportedFunction
  public hideToolbar() {
    this._toolbar.hide();
  }

  @ExportedFunction
  public showToolbar() {
    this._toolbar.show();
  }
}
