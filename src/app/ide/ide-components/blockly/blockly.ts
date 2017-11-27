﻿import { ResponseValue } from './../../components-framework/component/response-value';
/**
 * BlocklyVPL - VPL uses jigsaws
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { ComponentsCommunication } from "../../components-framework/component/components-communication";
import { IDEUIComponent } from "../../components-framework/component/ide-ui-component";
import { Editor } from "../../components-framework/build-in.components/editor-manager/editor";
import {
  UIComponentMetadata,
  ExportedSignal,
  ExportedFunction,
  RequiredFunction,
  ListensSignal
} from "../../components-framework/component/component-loader";

var Blockly = require("../../../../../node_modules/node-blockly/browser");


@UIComponentMetadata({
  description: "VPL uses jigsaws",
  componentView: "BlocklyView",
  version: "1.1"
})
export class BlocklyVPL extends Editor {
  private editor: any;
  private editorArea: string;
  private changed: boolean;
  private toolbox: any;
  private src: string;

  constructor(
    name: string,
    description: string,
    compViewName: string
  ) {
    super(name, description, compViewName);
  }

  @ExportedFunction
  public onOpen(): void {}

  @ExportedFunction
  public open(src: string, toolbox?: string, isFirstInst:boolean =false): void {
    this.changed = false;
    this.toolbox = (toolbox === undefined) ? /*require("./toolbox.xml")*/document.getElementById("toolbox") : toolbox;
    this.src = src;
    if (isFirstInst) {
      ComponentsCommunication.functionRequest(this.name, "Shell", "addTools", [this.view.toolElems]);
    }
  }

  @RequiredFunction("Shell", "addTools")
  @ExportedFunction
  public render(): void {
    var blocklyArea: any = document.getElementById("editors-area-container");
    var blocklyDiv: any = document.getElementById(this.selector);
    this.view.$el = $("#" + this.view.selector);
    this.view.$el.empty();
    this.view.$el.show();
    this.editor = Blockly.inject(this.view.selector, { "media": "./media/", "toolbox": this.toolbox });
    if (this.src) {
      Blockly.Xml.domToWorkspace(this.src, this.editor);
    }
    this.editor.addChangeListener(() => this.onChangeListener());
    var onresize = (e) => {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      // var element = blocklyArea;
      // var x = 0;
      // var y = 0;
      // do {
      //   x += element.offsetLeft;
      //   y += element.offsetTop;
      //   element = element.offsetParent;
      // } while (element);
      // // Position blocklyDiv over blocklyArea.
      blocklyDiv.style.left = -12 + "px";
      blocklyDiv.style.top = 3 + "px";
      blocklyDiv.style.width = (blocklyArea.offsetWidth+24) + "px";
      blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
    };
    window.addEventListener("resize", onresize, false);
    onresize(null);
    Blockly.svgResize(this.editor);
  }

  @ExportedFunction
  public onClose(): void {
    // changeListeners
    // this.editor.removeChangeListener();
    let code = Blockly.Xml.workspaceToDom(this.editor);
    // TODO: notify AutomationEditingManager
    this.editor.dispose();
  }

  private onChangeListener(): void {
    this.src = Blockly.Xml.workspaceToDom(this.editor);
    // TODO: notify AutomationEditingManager
  }

  public registerEvents(): void {
      
  }

  @ExportedFunction
  public update(): void {

  }

  @ExportedFunction
  public destroy(): void{

  }

  @ExportedFunction
  public undo(): void {
    this.editor.undo(false);
  }

  @ExportedFunction
  public redo(): void {
    this.editor.undo(true);
  }

  @ExportedFunction
  public copy() {

  }

  @ExportedFunction
  public paste() {

  }
  
  @RequiredFunction("EditorManager", "OnFocusEditorId")
  public requestOnFocusEditorId(): string {
    let resp: ResponseValue = ComponentsCommunication.functionRequest(this.name, "EditorManager", "OnFocusEditorId");
    return <string>resp.value;
  }

  /////////////////////////////////////////////////
  //// Establish Component Communication

  @ExportedSignal('Open')
  @ExportedSignal('Close')

  @RequiredFunction('ICEVPL', 'loadProgram')

  @ExportedFunction
  public openProject (path: string): void {
    console.log('testing... openProject called!');
  }

  @ListensSignal('ICEVPL', 'Close')
  public onCloseEditor(data: any): void {
    console.log('testing... onCloseEditor called!');
  }

}
