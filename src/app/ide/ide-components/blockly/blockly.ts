import { BlocklyInstance, BlocklyConfig } from './blockly-instance';
import {
  ResponseValue
} from "./../../components-framework/component/response-value";
import {
  ComponentsCommunication
} from "../../components-framework/component/components-communication";
import {
  Editor,
  IDomainElementData
} from "../../components-framework/build-in.components/editor-manager/editor";
import {
  ExportedSignal,
  ExportedFunction,
  RequiredFunction,
  ListensSignal,
  PlatformEditorMetadata
} from "../../components-framework/component/component-loader";

import * as Blockly from "blockly";
import { DomainElementsHolder } from "../../domain-manager/domains-holder";
import { assert } from "../../shared/ide-error/ide-error";
import { PItemView } from '../../components-framework/build-in.components/editor-manager/project-item/pitem-view';

var menuJson: any = require("./conf_menu.json");
var confJson: any = require("./conf_props.json");

@PlatformEditorMetadata({
  description: "VPL uses jigsaws",
  authors: [
    {
      name: "Yannis Valsamakis",
      email: "jvalsam@ics.forth.gr",
      date: "April 2020"
    }
  ],
  componentView: "BlocklyView",
  menuDef: menuJson,
  configDef: confJson,
  version: "1.1"
})
export class BlocklyVPL extends Editor {
  private instancesMap: {[id: string]: any};
  private configsMap: {[name: string]: BlocklyConfig};

  constructor(
    name: string,
    description: string,
    compViewName: string,
    hookSelector: string
  ) {
    super(
      name,
      description,
      compViewName,
      hookSelector
    );

    this.instancesMap = {};
    this.configsMap = {};
  }

  // load domain data: configs
  @RequiredFunction("DomainsManager", "getEditorConfigs")
  @ExportedFunction
  public loadDomain(name: string): void {
    this.configsMap = ComponentsCommunication.functionRequest(
      this.name,
      "DomainsManager",
      "getEditorConfigs",
      [this.name]
    ).value;
  }

  @ExportedFunction
  public onOpen(): void {}

  @RequiredFunction("DomainsManager", "getToolbox")
  private getToolbox(config: string): any {
    return ComponentsCommunication.functionRequest(
      this.name,
      "DomainsManager",
      "getToolbox",
      [ config ]
    ).value;
  }

  @RequiredFunction("Shell", "addTools")
  @ExportedFunction
  public open(
    selector: string,
    pitem: PItemView,
    config: string
  ): void {
    this.instancesMap[selector] = new BlocklyInstance(
      pitem.pi.systemID,
      selector,
      config,
      this.configsMap[config],
      (config) => this.getToolbox(config),
      pitem.pi.editorsData
    );
    this.instancesMap[selector].open();
    // this.changed = false;
    // this.toolbox = (toolbox === undefined)
    //   ? /*require("./toolbox.xml")*/document.getElementById("toolbox")
    //   : toolbox;
    // this.src = src;
    // if (isFirstInst) {
    //   ComponentsCommunication.functionRequest(
    //     this.name,
    //     "Shell",
    //     "addTools",
    //     [
    //       this.view.toolElems
    //     ]
    //   );
    // }
  }

  @ExportedFunction
  public createSource(mission: string, selector: string) {

  }

  @ExportedFunction
  public render(): void {
    this.setAsRendered();

    // var blocklyArea: any = document.getElementById("editors-area-container");
    // var blocklyDiv: any = document.getElementById(this.selector.substring(1));
    // this.view.$el = $(this.view.selector);
    // this.view.$el.empty();
    // this.view.$el.show();
    // this.editor = Blockly.inject(
    //   this.view.selector,
    //   {
    //     "media": "./media/",
    //     "toolbox": this.toolbox
    //   }
    // );
    // if (this.src) {
    //   Blockly.Xml.domToWorkspace(this.src, this.editor);
    // }
    // this.editor.addChangeListener(() => this.onChangeListener());
    // var onresize = (e) => {
    //   // Compute the absolute coordinates and dimensions of blocklyArea.
    //   // var element = blocklyArea;
    //   // var x = 0;
    //   // var y = 0;
    //   // do {
    //   //   x += element.offsetLeft;
    //   //   y += element.offsetTop;
    //   //   element = element.offsetParent;
    //   // } while (element);
    //   // // Position blocklyDiv over blocklyArea.
    //   blocklyDiv.style.left = -12 + "px";
    //   blocklyDiv.style.top = 3 + "px";
    //   blocklyDiv.style.width = (blocklyArea.offsetWidth+24) + "px";
    //   blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
    // };
    // window.addEventListener("resize", onresize, false);
    // onresize(null);
    // Blockly.svgResize(this.editor);
  }

  @ExportedFunction
  public onClose(): void {
    // changeListeners
    // this.editor.removeChangeListener();
    // let code = Blockly.Xml.workspaceToDom(this.editor);
    // // TODO: notify AutomationEditingManager
    // this.editor.dispose();
  }

  private onChangeListener(): void {
    // this.src = Blockly.Xml.workspaceToDom(this.editor);
    // TODO: notify AutomationEditingManager
  }

  public registerEvents(): void {
      this.view.registerEvents();
  }

  @ExportedFunction
  public update(): void {

  }

  @ExportedFunction
  public destroy(): void{

  }

  @ExportedFunction
  public undo(): void {
    // this.editor.undo(false);
  }

  @ExportedFunction
  public redo(): void {
    // this.editor.undo(true);
  }

  @ExportedFunction
  public copy() {

  }

  @ExportedFunction
  public paste() {

  }

  // public static updateCode() {
  //   document.getElementById("js").innerText = Blockly.JavaScript.workspaceToCode(editor);
  //   document.getElementById("php").innerText = Blockly.PHP.workspaceToCode(editor);
  //   document.getElementById("lua").innerText = Blockly.Lua.workspaceToCode(editor);
  //   document.getElementById("dart").innerText = Blockly.Dart.workspaceToCode(editor);
  //   document.getElementById("python").innerText = Blockly.Python.workspaceToCode(editor);
  // }
  
  @RequiredFunction("EditorManager", "OnFocusEditorId")
  public requestOnFocusEditorId(): string {
    let resp: ResponseValue = ComponentsCommunication.functionRequest(
      this.name,
      "EditorManager",
      "OnFocusEditorId"
    );
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

  // first stmt 
  @ExportedFunction
  public onChangeConfig(values: any): void {
    alert("on change config data not developed yet in Blockly Component");
  }

  /**
   * Functionality of the Domain Elements Signals Data
   */

  private domainElementData_Task(elem: any): IDomainElementData {
    return {
      signal: "create-task-element",
      data: {
        id: elem.id,
        taskName: elem.data.name,
        elem: {
          labelStyle: "task-label",
          color: elem.data.color,
          tooltip: elem.data.tooltip
        },
        mission: ""
      }
    };
  }

  @ExportedFunction
  public getDomainElementData(projectId: string, domainElemId: string): any {
    let elem = DomainElementsHolder["getElement"](projectId, domainElemId);
    let getDomainElementDataFunc = this["domainElementData_" + elem.name];
    assert(
      typeof getDomainElementDataFunc === "function",
      "Function domainElementData_"
      + elem.name
      + " not exists on Blockly editor."
    );
    return getDomainElementDataFunc(elem);
  }

  @ExportedFunction
  public factoryNewItem(pitemName: string, econfigName: string, pitemInfo: any, editorConfig: any): any {
    return { src: "<xml id=\"startBlocks\" style=\"display: none\"></xml>" };
  }

}
