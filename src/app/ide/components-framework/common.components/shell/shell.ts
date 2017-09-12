/**
 * Shell - Adapter of ICEVPL to import it in Puppy as component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

/// <reference path="../../../../../../node.d.ts"/>
import ShellTmpl from "./shell.html";
import { ComponentRegistry } from "../../component-registry";
import { IDEUIComponent, UIComponentMetadata, IViewDataComponent } from "../../ide-ui-component";
import { ExportedFunction } from "../../ide-component";
import { Menu } from "./menu/menu";
import { Toolbar } from "./toolbar/toolbar";
import { MainArea } from "./main-area/main-area";
import * as $ from "jquery";
import "expose-loader?$!expose-loader?jQuery!jquery";
import "./../../../../../../node_modules/bootstrap/dist/js/bootstrap.js";

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
    this._menu = <Menu>ComponentRegistry.GetComponentEntry("Menu").Create();
    this._toolbar = <Toolbar>ComponentRegistry.GetComponentEntry("Toolbar").Create();
    this._main = <MainArea>ComponentRegistry.GetComponentEntry("MainArea").Create();
  }

  @ExportedFunction
  public Initialize(): void {
    super.Initialize();
    this.inject_c(this._menu);
    this.inject_c(this._toolbar);
    this.inject_c(this._main);
  }

  @ExportedFunction
  public Show(): void {
    $(this._selector).html(this._templateJQ.html());
  }

  @ExportedFunction
  public OpenComponent(comp: IDEUIComponent): void {
    const view: IViewDataComponent = comp.GetView();
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
  public CloseComponent(compName: string): void {
    ;
  }

  public Destroy(): void {
    // first call destroy of the other components and then close
  }

  @ExportedFunction
  public Update():void {
    ;
  }

  @ExportedFunction
  public OnOpen(): void {
    ;
  }

  @ExportedFunction
  public OnClose(): void {
    ;
  }

  @ExportedFunction
  public GetView(): IViewDataComponent {
    return {};
  }
}