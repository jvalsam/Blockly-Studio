/**
 * Shell - Adapter of ICEVPL to import it in Puppy as component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */


import ShellTmpl from "./shell.html";
import { ComponentRegistry } from "../../component/component-registry";
import { ViewRegistry } from "../../view/view-registry";
import { IDEUIComponent, UIComponentMetadata, IViewDataComponent } from "../../component/ide-ui-component";
import { ExportedFunction } from "../../component/ide-component";
import { Menu } from "./menu/menu";
import { Toolbar } from "./toolbar/toolbar";
import { MainArea } from "./main-area/main-area";
import * as $ from "jquery";

import "expose-loader?$!expose-loader?jQuery!jquery";

require('jquery/dist/jquery');
require('popper.js/dist/umd/popper');
require('bootstrap/dist/js/bootstrap');



type Direction = "menu" | "toolbar" | "main-area";

@UIComponentMetadata({
  name: "Shell",
  description: "The basic skeleton of the IDE where the other visual components are attached in order to build the whole environment",
  selector: "#app",
  templateHTML: ShellTmpl
})
export class Shell extends IDEUIComponent {
  private _menu: Menu;
  private _toolbar: Toolbar;
  private _main: MainArea;

  constructor(
    name: string,
    description: string,
    selector: string,
    templateHTML: string
  ) {
    super(name, description, selector, templateHTML);
    this._menu = <Menu>ViewRegistry.getViewEntry("Menu").create();
    this._toolbar = <Toolbar>ViewRegistry.getViewEntry("Toolbar").create();
    this._main = <MainArea>ViewRegistry.getViewEntry("MainArea").create();
  }

  @ExportedFunction
  public initialize(): void {
    super.initialize();
    this.inject(this._menu);
    this.inject(this._toolbar);
    this.inject(this._main);
  }

  @ExportedFunction
  public show(): void {
    // TODO: implement independently html for each part
    $(this._selector).html(this.templateHTML);
  }

  @ExportedFunction
  public openComponent(comp: IDEUIComponent): void {
    const view: IViewDataComponent = comp.getView();
    if (view.menubar) {
      this.inject("#menu-area", view.menubar);
    }
    if (view.tools) {
      this.inject("#toolbar-area", view.tools);
    }
    if (view.main) {
      this.inject("#main-area", view.main);
    }
  }

  @ExportedFunction
  public closeComponent(compName: string): void {
    ;
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

  @ExportedFunction
  public getView(): IViewDataComponent {
    return {};
  }
}
