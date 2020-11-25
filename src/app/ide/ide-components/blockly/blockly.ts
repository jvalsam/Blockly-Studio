import {
  BlocklyInstance,
  BlocklyConfig,
  DomainBlockTracker
} from "./blockly-instance";
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

import { DomainElementsHolder } from "../../domain-manager/domains-holder";
import { assert } from "../../shared/ide-error/ide-error";
import {
  PItemView
} from "../../components-framework/build-in.components/editor-manager/project-item/pitem-view";
import {
  ITool
} from "../../components-framework/build-in.components/editor-manager/editor-manager-toolbar-view/editor-manager-toolbar-view";
import { domain } from "process";

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

  private domainElementTracker: {
    [projectId: string]: {
      [domainElemName: string]: DomainBlockTracker
    }
  };

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

    this.domainElementTracker = {};
  }

  // load domain data: configs
  @RequiredFunction("DomainsManager", "getEditorConfigs")
  @RequiredFunction("DomainsManager", "getBlockTypesToDomainElementsMap")
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
  loadComponentDataOfProject(projectId: string, componentsData: any) {
    this.domainElementTracker = {};
    this.domainElementTracker[projectId] = {};
    for (const domainElemName in componentsData.domainElementTracker) {
      this.domainElementTracker[projectId][domainElemName] = new DomainBlockTracker(
        domainElemName,
        componentsData.domainElementTracker[domainElemName]
      );
    }
  }

  private getBlockTypesToDomainElementsMap(projectId: string) {
    return ComponentsCommunication.functionRequest(
      this.name,
      "DomainsManager",
      "getBlockTypesToDomainElementsMap",
      [projectId]
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

  @RequiredFunction("ProjectManager", "saveEditorData")
  @RequiredFunction("Shell", "addTools")
  @ExportedFunction
  public open(
    id: string,
    pitem: PItemView,
    config: string
  ): void {
    let editorData = pitem.pi.editorsData.items[id];
    assert(editorData, "Source with id not found in Blockly editor.");

    if (!this.instancesMap.hasOwnProperty(editorData.editorId)) {
      let text = editorData ? editorData.src : null;
      this.instancesMap[editorData.editorId] = new BlocklyInstance(
        pitem.pi,
        editorData.editorId,
        id,
        config,
        this.configsMap[config],
        (config) => this.getToolbox(config),
        (event) => this.handleInstanceChange(
          id,
          pitem,
          event),
        text
      );
    }
    this.instancesMap[editorData.editorId].open();
  }

  fixBlocksTrackerInit(projectId: string, elemName: string) {
    this.domainElementTracker[projectId] = this.domainElementTracker[projectId] || {};
    if (!this.domainElementTracker[projectId][elemName]) {
      this.domainElementTracker[projectId][elemName] = new DomainBlockTracker(elemName, {});
    }
  }

  @RequiredFunction("ProjectManager", "getComponentData")
  @RequiredFunction("ProjectManager", "saveComponentData")
  // save is used for Collaboration purposes
  private handleBlocksTracker(id, pitem, event, save: boolean =false) {
    if (event.type === 'create' || event.type === 'delete') {
      let projectId = pitem._pi.editorsData.projectID;
      let blocklyInst = this.instancesMap[id];
      let block = blocklyInst.getBlockById(event.blockId);
      let type;
      if (block) {
        type = block.type;
      }
      else {
        for (const elem in this.domainElementTracker[projectId]) {
          let block = this.domainElementTracker[projectId][elem].getBlockById(event.blockId);
          if (block) {
            type = block.blockType;
            break;
          }
        }
      }
      let elemName = this.getBlockTypesToDomainElementsMap(projectId)[type];
      if (elemName) {
        let confName = pitem.pi._editorsData.items[id].confName;
        this.fixBlocksTrackerInit(projectId, elemName);
        this.domainElementTracker[projectId][elemName]
          .createBlockId(
            event.blockId,
            block.type,
            confName,
            id,
            pitem.pi.systemId,
            pitem.pi._jstreeNode.text);
        if (save) {
          let data = this.getProjectComponentData(projectId);
          data.domainElementTracker = this.domainElementTracker[projectId];
          this.saveProjectComponentData(projectId, data);
        }
      }
    }
  }

  @ExportedFunction
  public getVisualSourcesUseDomainElementInstaceById(
    projectId: string,
    domainElementId: string,
    domainElementType: string) {
    let domainElem = this.domainElementTracker[projectId];
    if (domainElem && domainElem[domainElementType]) {
      return domainElem[domainElementType].domainElemsMap[domainElementId];
    }
    else {
      return null;
    }
  }

  private handleInstanceChange(id, pitem, event) {
    this.save(
      id,
      pitem.pi,
      (mode) => mode === "SHARED"
        ? event
        : this.getEditorData(id));
    
    this.handleBlocksTracker(id, pitem, event, true);
  }

  @ExportedFunction
  public closeSRC(srcId: string): void {
    assert(this.instancesMap[srcId], "Request to close not existing source ID in Blockly Editor!");
    this.instancesMap[srcId].close();
  }

  @ExportedFunction
  public update_src(data: any, pitem: any, focus: boolean =false): void {
    let id = data.editorId;
    let event = data.event;
    
    if (focus) {
      this.instancesMap[id].syncWSP(event);
    }
    else {
      console.warn("Blockly instance not implement. Has to mark that visual src is not updated");
    }

    this.handleBlocksTracker(id, pitem, event);
  }

  @ExportedFunction
  public onMissionUpdate(data) {
    // instancesMap;
    // configsMap
    let toolboxXml = null;
    for (const instId in this.instancesMap) {
      let blocklyEditorInstance = this.instancesMap[instId];
      if (blocklyEditorInstance.type === data.name) {
        if (!toolboxXml) {
          toolboxXml = blocklyEditorInstance.xmlTextToDom(data.toolbox.gen);
        }

        blocklyEditorInstance.updateToolbox(toolboxXml);
        blocklyEditorInstance.refresh();
      }
    }

    //TODO: handle the toolbox extra
    let items = document.getElementsByClassName('blocklyTreeRow');
    document.getElementsByClassName('blocklyTreeLabel');
    //$('.blocklyTreeLabel').find('span:contains("Built-in")')["prevObject"][0]
    //    .nextSibling.style.marginLeft = '20px';
    let i = 0;
    for (const elem of $('.blocklyTreeLabel').find('span:contains("Built-in")')["prevObject"]) {
      if (i>0) {
        elem.style.marginLeft = '10px';
      }
      else if (i===0) {
        elem.style.marginTop = '10px';
      }
      ++i;
    }

    items = document.getElementsByClassName('blocklyTreeSeparator');
        Object.keys(items)
            .forEach(i => items[i].style.marginTop = '10px');
  }

  @ExportedFunction
  public onDeleteVPLElements(data) {
    let domainElem = data.domainElem;

    let visualSources = this.getVisualSourcesUseDomainElementInstaceById(
      domainElem.projectID,
      domainElem.domainElementId,
      domainElem.domainElementType);
    
    visualSources.blocks.forEach(block => {
      this.instancesMap[block.editorId].deleteBlockById(block.blockId);
    });
  }

  @ExportedFunction
  public updatePItemData(editorId: string, pitem) {
      // TODO:
  }

  @ExportedFunction
  public tools(editorId: string): Array<ITool> {
    return [
      {
        icon: "../../../../../images/blockly/undo.png",
        tooltip: "undo",
        action: () => this.instancesMap[editorId].undo()
      },
      {
        icon: "../../../../../images/blockly/redo.png",
        tooltip: "redo",
        action: () => this.instancesMap[editorId].redo()
      }
    ];
  }

  public getEditorData(editorId: string): any {
    return {
      editor: this.name,
      src: this.instancesMap[editorId].getText()
    };
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
  
  // @RequiredFunction("EditorManager", "OnFocusEditorId")
  public requestOnFocusEditorId(): string {
    // let resp: ResponseValue = ComponentsCommunication.functionRequest(
    //   this.name,
    //   "EditorManager",
    //   "OnFocusEditorId"
    // );
    return "<string>resp.value";
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
