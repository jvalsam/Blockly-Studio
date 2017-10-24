/**
 * Shell - Adapter of ICEVPL to import it in Puppy as component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import ShellTmpl from "./shell.html";

import { ViewRegistry } from "../../view/view-registry";
import { IDEUIComponent, UIComponentMetadata, IViewDataComponent } from "../../component/ide-ui-component";
import { ExportedFunction } from "../../component/ide-component";

import { Menu, IShellMenuViewElement } from "./menu/menu";
import { Toolbar, IShellToolbarViewElement } from "./toolbar/toolbar";
import { MainArea, IShellMainAreaViewElement } from "./main-area/main-area";

import * as $ from "jquery";
import "expose-loader?$!expose-loader?jQuery!jquery";
require("jquery/dist/jquery");
require("popper.js/dist/umd/popper");
require("bootstrap/dist/js/bootstrap");

type Direction = "menu" | "toolbar" | "main-area";

@UIComponentMetadata({
  description: "The basic skeleton of the IDE where the other visual components are attached in order to build the whole environment",
  selector: ".ide-container",
  templateHTML: ShellTmpl
})
export class Shell extends IDEUIComponent {
  private _menu: IShellMenuViewElement;
  private _toolbar: IShellToolbarViewElement;
  private _main: IShellMainAreaViewElement;

  private _currentComponent: IDEUIComponent;

  constructor(
    name: string,
    description: string,
    selector: string,
    templateHTML: string
  ) {
    super(name, description, selector, templateHTML);

    this._menu = {
      selector: ".menu-view-area",
      view: <Menu>ViewRegistry.getViewEntry("Menu").create(this)
    };
    this._toolbar = {
      selector: ".toolbar-view-area",
      view: <Toolbar>ViewRegistry.getViewEntry("Toolbar").create(this)
    };
    this._main = {
      selector: ".main-view-area",
      view: <MainArea>ViewRegistry.getViewEntry("MainArea").create(this)
    };
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
    // connecting ide selector with document root element
    $(this.selector).empty();
    $(this.selector).append(this.view.$el);
  }

  @ExportedFunction
  public openComponent(comp: IDEUIComponent): void {
    if (this._currentComponent) {
      this._currentComponent.onClose();
    }
    this._currentComponent = comp;
    // render
    comp.render();
    // inject
    const view: IViewDataComponent = comp.getView();
    if (view.menubar) {
      this.inject(".menu-container", view.menubar);
    }
    if (view.tools) {
      this.inject(".toolbar-container", view.tools);
    }
    else {
      this.view.templateJQ.find("div.toolbar-view-area").hide();
    }
    if (view.main) {
      this.inject(".main-area-container", view.main);
    }
  }

  private getSelector(selector: string): string {
    let index = 0;
    while ( $(selector + ++index).length !== 0 );
    return selector.substr(1)+"_index_"+index;
  }

  @ExportedFunction
  public createComponentEmptyContainer(comp: IDEUIComponent, viewArea: string, display: boolean = false): string {
    const selector = this.getSelector(comp.selector);
    const $newEl = $("<div id=\""+selector+"\" class='"+comp.selector.substr(1)+" container-fluid' style=\"height: 480px; width: 600px; margin-top:10px;\"></div>");
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

  @ExportedFunction
  public getView(): IViewDataComponent {
    return {};
  }
}
