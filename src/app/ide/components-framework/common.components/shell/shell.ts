﻿/**
 * Shell - Adapter of ICEVPL to import it in Puppy as component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { IDEUIComponent } from "../../component/ide-ui-component";
import { UIComponentMetadata, ExportedFunction } from "../../component/component-loader";
import { ComponentRegistry } from "../../component/component-entry";
import { ComponentsViewTree } from "./components-view-tree";
import { Menu } from "./menu/menu";

// import { Menu, IShellMenuViewElement } from "./menu/menu";
 import { Toolbar } from "./toolbar/toolbar";
// import { MainArea, IShellMainAreaViewElement } from "./main-area/main-area";

import * as $ from 'jquery';
import 'expose-loader?$!expose-loader?jQuery!jquery';
require("jquery/dist/jquery");
require("popper.js/dist/umd/popper");
require("bootstrap/dist/js/bootstrap");

type Direction = "menu" | "toolbar" | "main-area";

@UIComponentMetadata({
  description: "The basic skeleton of the IDE where the other visual components are attached in order to build the whole environment",
  componentView: "ShellView"
})
export class Shell extends IDEUIComponent {
  private _menu: Menu;
  private _toolbar: Toolbar;
  private _firstCompIsLoad: boolean;

  constructor(
    name: string,
    description: string,
    compViewName: string
  ) {
    super(name, description, compViewName);
    this._firstCompIsLoad = false;
    this._menu = <Menu>ComponentRegistry.getEntry("Menu").create();
    this._toolbar = <Toolbar>ComponentRegistry.getEntry("Toolbar").create();
  }

  @ExportedFunction
  public initialize(): void {
    super.initialize();
    this.inject(this._menu);
    this.inject(this._toolbar);
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
  public openComponent(comp: IDEUIComponent): void {
    //this.updateComponentsViewTree(comp);

    comp.render();

    this._menu.activateMenuItems(comp.view.menuElems);

    this._toolbar.addTools(comp.view.toolElems);

    if (comp.view.main) {
      this.inject(".main-area-container", comp.view.main);
    }
  }

  private getSelector(selector: string): string {
    let index = 0;
    while ($(selector + ++index).length !== 0);
    return selector.substr(1) + "_index_" + index;
  }
  @ExportedFunction
  public createComponentEmptyContainer(comp: IDEUIComponent, viewArea: string, display: boolean = false): string {
    const selector = this.getSelector(comp.selector);
    const $newEl = $("<div id=\"" + selector + "\" class='" + comp.selector.substr(1) + " container-fluid' style=\"position: absolute\"></div>"); //  style=\"height: 480px; width: 600px; margin-top:10px;\"
    $(viewArea).append($newEl);
    return selector;
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
  public onOpen(): void {
    ;
  }

  @ExportedFunction
  public onClose(): void {
    ;
  }
}
