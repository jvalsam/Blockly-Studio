import {
  BlocklyInstance,
  InitiateBlocklyGenerator,
  BlocklyConfig,
  DomainBlockTracker,
} from "./blockly-instance";
import { ResponseValue } from "./../../components-framework/component/response-value";
import { ComponentsCommunication } from "../../components-framework/component/components-communication";
import {
  Editor,
  IDomainElementData,
} from "../../components-framework/build-in.components/editor-manager/editor";
import {
  ExportedSignal,
  ExportedFunction,
  RequiredFunction,
  ListensSignal,
  PlatformEditorMetadata,
} from "../../components-framework/component/component-loader";

import { DomainElementsHolder } from "../../domain-manager/domains-holder";
import { assert } from "../../shared/ide-error/ide-error";
import { PItemView } from "../../components-framework/build-in.components/editor-manager/project-item/pitem-view";
import { ITool } from "../../components-framework/build-in.components/editor-manager/editor-manager-toolbar-view/editor-manager-toolbar-view";
import { domain } from "process";
import { ProjectItem } from "../../components-framework/build-in.components/project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";

var menuJson: any = require("./conf_menu.json");
var confJson: any = require("./conf_props.json");

@PlatformEditorMetadata({
  description: "VPL uses jigsaws",
  authors: [
    {
      name: "Yannis Valsamakis",
      email: "jvalsam@ics.forth.gr",
      date: "April 2020",
    },
  ],
  isUnique: true,
  componentView: "BlocklyView",
  menuDef: menuJson,
  configDef: confJson,
  version: "1.1",
})
export class BlocklyVPL extends Editor {
  private instancesMap: { [id: string]: BlocklyInstance };
  private configsMap: { [name: string]: BlocklyConfig };

  private domainElementTracker: {
    [projectId: string]: {
      [domainElemName: string]: DomainBlockTracker;
    };
  };

  constructor(
    name: string,
    description: string,
    compViewName: string,
    hookSelector: string
  ) {
    super(name, description, compViewName, hookSelector);

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
      this.domainElementTracker[projectId][
        domainElemName
      ] = new DomainBlockTracker(
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
      [config]
    ).value;
  }

  private handleClearCashData(editorData) {
    if (this.instancesMap.hasOwnProperty(editorData.editorId)) {
      this.instancesMap[editorData.editorId].destroy();
      delete this.instancesMap[editorData.editorId];
    }
  }

  @RequiredFunction("Debugger", "renderBreakpoints")
  @RequiredFunction("ProjectManager", "saveEditorData")
  @RequiredFunction("Shell", "addTools")
  @ExportedFunction
  public open(
    editorData: any,
    pitem: PItemView,
    config: string,
    cachedData: boolean
  ): void {
    if (!cachedData) {
      this.handleClearCashData(editorData);
    }

    if (!this.instancesMap.hasOwnProperty(editorData.editorId)) {
      let text = editorData ? editorData.src : null;
      this.instancesMap[editorData.editorId] = new BlocklyInstance(
        this,
        pitem.pi,
        editorData.editorId,
        editorData.editorId, // selector has to be unique (injected in DOM, not in pitem template)
        config,
        this.configsMap[config],
        (config) => this.getToolbox(config),
        (event) =>
          this.handleInstanceChange(editorData.editorId, pitem.pi, event),
        text,
        undefined,
        undefined,
        "BlocklyStudioIDE"
      );
    }
    // lazy update for the text of the existing wsp
    // else {
    //   this.instancesMap[editorData.editorId].text = editorData.src;
    // }
    this.instancesMap[editorData.editorId].open();

    ComponentsCommunication.functionRequest(
      this.name,
      "Debugger",
      "renderBreakpoints",
      [
        pitem.pi.systemID,
        this.instancesMap[editorData.editorId]
      ]
    );
  }

  @ExportedFunction
  public openInDialogue(
    editorData: any,
    pitem: ProjectItem,
    config: string,
    selector: string,
    privileges: string, // "READ_ONLY" or "EDITING"
    windowsId: string
  ): void {
    if (this.instancesMap[editorData.editorId])
      this.instancesMap[editorData.editorId].destroy();

    this.instancesMap[editorData.editorId] = new BlocklyInstance(
        this,
        pitem,
        editorData.editorId,
        selector, // selector has to be unique (injected in DOM, not in pitem template)
        config,
        this.configsMap[config],
        (config) => this.getToolbox(config), // have to do work...
        (event) => {
          /* */
        },
        editorData.src,
        privileges,
        editorData.zIndex,
        windowsId,
        editorData.posize
      );
    this.instancesMap[editorData.editorId]["__editorData"] = editorData;

    this.instancesMap[editorData.editorId].open();

    // case of simulator tests are not in pitem
    if (pitem && pitem.systemID) {
      ComponentsCommunication.functionRequest(
          this.name,
          "Debugger",
          "renderBreakpoints",
          [
            pitem.systemID,
            this.instancesMap[editorData.editorId]
          ]
      );
    }
  }

  @ExportedFunction
  public saveEditorData(editorId: string) {
    this.save(editorId, this.instancesMap[editorId].pitem, () => {
      let ed = this.instancesMap[editorId]["__editorData"];
      ed.src = this.getEditorSrc(editorId);
      return ed;
    });
  }

  fixBlocksTrackerInit(projectId: string, elemName: string) {
    this.domainElementTracker[projectId] =
      this.domainElementTracker[projectId] || {};
    if (!this.domainElementTracker[projectId][elemName]) {
      this.domainElementTracker[projectId][elemName] = new DomainBlockTracker(
        elemName,
        {}
      );
    }
  }

  @ExportedFunction
  getBlockEditorId(projectId: string, blockId: string): string {
    for (const elemName in this.domainElementTracker[projectId]) {
      let block = this.domainElementTracker[projectId][elemName].getBlockById(
        blockId
      );
      if (block) {
        return block;
      }
    }
    return null;
  }

  @ExportedFunction
  getBlock(blockId: string, editorId: string): any {
    return this.instancesMap[editorId].getBlockById(blockId);
  }

  @RequiredFunction("ProjectManager", "getComponentData")
  @RequiredFunction("ProjectManager", "saveComponentData")
  // save is used for Collaboration purposes
  private handleBlocksTracker(id, pi, event, save: boolean = false) {
    if (event.type === "create" || event.type === "delete") {
      let projectId = pi.editorsData.projectID;
      let blocklyInst = this.instancesMap[id];
      let block = blocklyInst.getBlockById(event.blockId);
      let type;
      if (block) {
        type = block.type;
      } else {
        for (const elem in this.domainElementTracker[projectId]) {
          block = this.domainElementTracker[projectId][elem].getBlockById(
            event.blockId
          );
          if (block) {
            type = block["blockType"];
            break;
          }
        }
      }
      let elemName = this.getBlockTypesToDomainElementsMap(projectId)[type];
      if (elemName) {
        let confName = pi._editorsData.items[id].confName;
        this.fixBlocksTrackerInit(projectId, elemName);
        this.domainElementTracker[projectId][elemName].createBlockId(
          event.blockId,
          type,
          confName,
          id,
          pi.systemId,
          pi._jstreeNode.text
        );
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
    domainElementType: string
  ) {
    let domainElem = this.domainElementTracker[projectId];
    if (domainElem && domainElem[domainElementType]) {
      return domainElem[domainElementType].domainElemsMap[domainElementId];
    } else {
      return null;
    }
  }

  private handleInstanceChange(id, pi, event) {
    this.save(id, pi, (mode) =>
      mode === "SHARED" ? event : this.getEditorData(id)
    );

    this.handleBlocksTracker(id, pi, event, true);
  }

  @ExportedFunction
  public closeSRC(srcId: string): void {
    assert(
      srcId in this.instancesMap,
      "Request to close not existing source ID in Blockly Editor!"
    );
    this.instancesMap[srcId].close();
  }

  @ExportedFunction
  public destroySRC(srcId: string): void {
    assert(
      srcId in this.instancesMap,
      "Request to close not existing source ID in Blockly Editor!"
    );
    this.instancesMap[srcId].wsp.dispose();
  }

  @ExportedFunction
  public update_src(data: any, pitem: any, focus: boolean = false): void {
    let id = data.editorId;
    let event = data.event;

    // crashes in case of sync wsp...
    this.instancesMap[id].syncWSP(event);

    if (!focus) {
      this.instancesMap[id].refresh();
      this.instancesMap[id].updateWSPToText();
    }

    this.handleBlocksTracker(id, pitem, event);
  }

  @ExportedFunction
  public update_privileges(editorData: any, privilege: string): void {
    this.instancesMap[editorData.editorId].update_privileges();
  }

  @ExportedFunction
  public onMissionUpdate(data) {
    // instancesMap;
    // configsMap
    let toolboxXml = null;
    for (const instId in this.instancesMap) {
      let blocklyEditorInstance = this.instancesMap[instId];
      if (blocklyEditorInstance.type === data.name) {
        // if (!toolboxXml) {
        //   toolboxXml = blocklyEditorInstance.xmlTextToDom(data.toolbox.gen);
        // }

        // blocklyEditorInstance.updateToolbox(toolboxXml);
        blocklyEditorInstance.refresh();
      }
    }

    //TODO: handle the toolbox extra
    let items = document.getElementsByClassName("blocklyTreeRow");
    document.getElementsByClassName("blocklyTreeLabel");
    //$('.blocklyTreeLabel').find('span:contains("Built-in")')["prevObject"][0]
    //    .nextSibling.style.marginLeft = '20px';
    let i = 0;
    for (const elem of $(".blocklyTreeLabel").find('span:contains("Built-in")')[
      "prevObject"
    ]) {
      if (i > 0) {
        elem.style.marginLeft = "10px";
      } else if (i === 0) {
        elem.style.marginTop = "10px";
      }
      ++i;
    }

    items = document.getElementsByClassName("blocklyTreeSeparator");
    Object.keys(items).forEach((i) => (items[i].style.marginTop = "10px"));
  }

  @ExportedFunction
  public onDeleteVPLElements(data) {
    let domainElem = data.domainElem;

    let visualSources = this.getVisualSourcesUseDomainElementInstaceById(
      domainElem.projectID,
      domainElem.domainElementId,
      domainElem.domainElementType
    );

    visualSources.blocks.forEach((block) => {
      this.instancesMap[block.editorId].deleteBlockById(block.blockId);
    });

    visualSources.blocks.splice(0, visualSources.blocks.length);
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
        action: () => this.instancesMap[editorId].undo(),
      },
      {
        icon: "../../../../../images/blockly/redo.png",
        tooltip: "redo",
        action: () => this.instancesMap[editorId].redo(),
      },
    ];
  }

  @ExportedFunction
  public getEditorData(editorId: string): any {
    return {
      editor: this.name,
      src: this.instancesMap[editorId].getText(),
    };
  }

  @ExportedFunction
  public getEditorSrc(editorId: string): any {
    return this.instancesMap[editorId].getText();
  }

  @ExportedFunction
  public createSource(mission: string, selector: string) {}

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
  public update(): void {}

  @ExportedFunction
  public destroy(): void {}

  @ExportedFunction
  public undo(): void {
    // this.editor.undo(false);
  }

  @ExportedFunction
  public redo(): void {
    // this.editor.undo(true);
  }

  @ExportedFunction
  public copy() {}

  @ExportedFunction
  public paste() {}

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

  @ExportedSignal("Open")
  @ExportedSignal("Close")
  @RequiredFunction("ICEVPL", "loadProgram")
  @ExportedFunction
  public openProject(path: string): void {
    console.log("testing... openProject called!");
  }

  @ListensSignal("ICEVPL", "Close")
  public onCloseEditor(data: any): void {
    console.log("testing... onCloseEditor called!");
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
          tooltip: elem.data.tooltip,
        },
        mission: "",
      },
    };
  }

  @ExportedFunction
  public getDomainElementData(projectId: string, domainElemId: string): any {
    let elem = DomainElementsHolder["getElement"](projectId, domainElemId);
    let getDomainElementDataFunc = this["domainElementData_" + elem.name];
    assert(
      typeof getDomainElementDataFunc === "function",
      "Function domainElementData_" +
        elem.name +
        " not exists on Blockly editor."
    );
    return getDomainElementDataFunc(elem);
  }

  // TODO: create infrastructure for the application-domain authoring and disconnect this depedence
  @ExportedSignal("create-pi-blockly-calendar-event", ["pitem-data"])
  @ExportedSignal("create-pi-blockly-conditional-event", ["pitem-data"])
  @ExportedSignal("create-pi-blockly-automation-task", ["pitem-data"])
  @ExportedFunction
  public factoryNewItem(
    pitemName: string,
    econfigName: string,
    pitemInfo: any,
    editorConfig: any,
    projectinfo: any
  ): any {
    let data = JSON.parse(JSON.stringify(pitemInfo));
    data.editorId = projectinfo.editorId;
    data.pitemId = projectinfo.pitemId;
    data.pitemName = pitemName;
    data.econfigName = econfigName;
    data.projectID = projectinfo.projectId;
    data.domainElementType = econfigName;
    data.domainElementId = projectinfo.editorId;

    ComponentsCommunication.postSignal(this.name, "create-" + pitemName, data);

    return { src: '<xml id="startBlocks" style="display: none"></xml>' };
  }

  @ExportedFunction
  public generateCodeDataForExecution(data: any, execType: string) {
    if (execType === "RELEASE") {
      return this.instancesMap[data.editorId].generateJavaScriptCode();
    }
    else {
      return {
        src: this.instancesMap[data.editorId].generateJavaScriptCode(),
        variables: this.instancesMap[data.editorId].wsp
          .getAllVariables().map(variable => variable.name)
      }
    }
  }

  @ExportedFunction
  public loadSource(editorData: any, pitem: ProjectItem) {
    // load data by creating instance of the visual domain element
    let text = editorData ? editorData.src : null;
    this.instancesMap[editorData.editorId] = new BlocklyInstance(
      this,
      pitem,
      editorData.editorId,
      editorData.editorId,
      editorData.confName,
      this.configsMap[editorData.confName],
      (config) => this.getToolbox(config),
      (event) => this.handleInstanceChange(editorData.editorId, pitem, event),
      text,
      undefined,
      undefined,
      "BlocklyStudioIDE"
    );
    this.instancesMap[editorData.editorId].load();
  }

  @ExportedFunction
  public loadSourceForDialogueInstance(editorData: any) {
    // load data by creating instance of the visual domain element
    this.instancesMap[editorData.editorId] = new BlocklyInstance(
      this,
      null,
      editorData.editorId,
      editorData.editorId,
      editorData.confName,
      this.configsMap[editorData.confName],
      (config) => this.getToolbox(config),
      (event) => {},
      editorData.src || '<xml id="startBlocks" style="display: none"></xml>',
      undefined,
      undefined,
      "BlocklyStudioIDE"
    );
    this.instancesMap[editorData.editorId].load();
  }

  @ExportedFunction
  public getAllBlocklyWSPs() {
    return this.instancesMap;
  }

  @RequiredFunction("ProjectManager", "clickProjectElement")
  private openPItem(pitem: ProjectItem) {
    if(pitem)
      ComponentsCommunication.functionRequest(
        this.name,
        "ProjectManager",
        "clickProjectElement",
        [pitem.systemID]
      );
  }

  public CreateDOMElement(type, options) {
    let element = document.createElement(type);
  
    if (options) {
      if (options.classList !== undefined) {
        options.classList.forEach((c) => {
          element.classList.add(c);
        });
      }
      if (options.id !== undefined) element.id = options.id;
      if (options.innerHtml !== undefined) element.innerHTML = options.innerHtml;
    }
    return element;
  };

  public CreateModal(dom, idPrefix) {
    let modal = this.CreateDOMElement("div", {
      classList: ["modal", "shadow-sm"],
      id: idPrefix + "-modal",
    });
    // modal.setAttribute("data-keyboard", "false");
    // modal.setAttribute("data-backdrop", "static");
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.style.setProperty("width", "92rem");
    modal.style.setProperty("height", "64rem");
    modal.style.setProperty("top", "0");
    modal.style.setProperty("left", "0");
    // modal.setAttribute("aria-hidden", "true");
    dom.appendChild(modal);
  
    let modalDialog = this.CreateDOMElement("div", {
      classList: ["modal-dialog", "modal-lg"],
      id: idPrefix + "-modal-dialog",
    });
    modalDialog.style.setProperty("margin-left", "21rem");
    modalDialog.style.setProperty("margin-top", "7rem");
    modalDialog.setAttribute("role", "document");
    modal.appendChild(modalDialog);
  
    let modalContent = this.CreateDOMElement("div", {
      classList: ["modal-content"],
    });
    modalDialog.appendChild(modalContent);
  
    let modalHeader = this.CreateDOMElement("div", { classList: ["modal-header"] });
    modalHeader.id = idPrefix + "-modal-header",
    modalContent.appendChild(modalHeader);
  
    let modalTitle = this.CreateDOMElement("h5", {
      classList: ["modal-title"],
      id: idPrefix + "-modal-title",
    });
    modalHeader.appendChild(modalTitle);
  
    let modalBody = this.CreateDOMElement("div", {
      classList: ["modal-body"],
      id: idPrefix + "-modal-body",
    });
    modalContent.appendChild(modalBody);
  
    let modalFooter = this.CreateDOMElement("div", { classList: ["modal-footer"] });
    modalContent.appendChild(modalFooter);
  
    let cancelButton = this.CreateDOMElement("button", {
      classList: ["btn", "btn-secondary"],
      id: idPrefix + "-modal-cancel-button",
      innerHtml: "Cancel",
    });
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("data-dismiss", "modal");
    modalFooter.appendChild(cancelButton);
  
    let confirmButton = this.CreateDOMElement("div", {
      classList: ["btn", "btn-primary"],
      id: idPrefix + "-modal-confirm-button",
      innerHtml: "Confirm",
    });
    confirmButton.setAttribute("type", "button");
    modalFooter.appendChild(confirmButton);
  };

  public OpenModalForBlockEditorInstance(actionId, title, onShown, disableCloseBtn) {
    let prefix = actionId;
  
    // Create Modal
    this.CreateModal(
      document.getElementsByClassName("modal-platform-container")[0],
      prefix
    );

    // if (!$("#" + prefix + "-modal.in").length) {
    //   $("#" + prefix + "-modal-dialog").css({
    //     top: 0,
    //     left: -10,
    //   });
    // }
  
    // title
    $("#" + prefix + "-modal-title").html(title);
  
    document
      .getElementById(prefix + "-modal-body")
      .style.setProperty("overflow-y", "auto");
  
    document
      .getElementById(prefix + "-modal-body")
      .style.setProperty("position", "relative");
  
    document
      .getElementById(prefix + "-modal-body")
      .style.setProperty("width", "100%");
    document
      .getElementById(prefix + "-modal-body")
      .style.setProperty("height", "750px");
  
    // create blockly workspace container
    // <div id="blocklyDiv" style="position: absolute"></div>;
    let blocklyWorkspaceDiv = document.createElement("div");
    blocklyWorkspaceDiv.id = prefix;
    blocklyWorkspaceDiv.style.setProperty("position", "absolute");
    blocklyWorkspaceDiv.style.setProperty("width", "97%");
    blocklyWorkspaceDiv.style.setProperty("height", "720px");
    document
      .getElementById(prefix + "-modal-body")
      .appendChild(blocklyWorkspaceDiv);
  
    $("#" + prefix + "-modal").on("hidden.bs.modal", () => {
      document.getElementsByClassName("modal-platform-container")[0].innerHTML = "";
      // document.getElementById("runtime-modal-title").click();
    });

    $("#" + prefix + "-modal").on("hide.bs.modal", () => {
      this.closeSRC(blocklyWorkspaceDiv.id);
    });
  
    let confirmButton = document.getElementById(prefix + "-modal-confirm-button");
    confirmButton.style.setProperty("display", "none");
    
    let cancelButton = document.getElementById(prefix + "-modal-cancel-button");

    if(disableCloseBtn)
      cancelButton.style.setProperty("display", "none");
    else
      cancelButton.innerHTML = "Close";

  
    // $("#" + prefix + "-modal")["modal"]("toggle");
  
    /* change modal size */
    document
      .getElementById(prefix + "-modal-dialog")
      .classList.remove("modal-lg");
    document.getElementById(prefix + "-modal-dialog").classList.add("modal-xl");
  
    $("#" + prefix + "-modal").on("shown.bs.modal", function (e) {
      $(document).off("focusin.modal");
      onShown();
    });

    // $("#" + prefix + "-modal")["modal"]({backdrop: 'static', keyboard: false}) 
    
    $("#" + prefix + "-modal")["modal"]({
      backdrop: false,
      show: true,
    });

    // $("#" + prefix + "-modal").draggable({
    //   handle: "#" + prefix + "-modal-header",
    // });
  
    // $("#" + prefix + "-modal")["modal"]("show");
  }

  @RequiredFunction("ProjectManager", "getProjectItem")
  @ExportedFunction
  public highlightBlockOfPItem(pitemId: string, blockId: string) {
    let pitem = ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "getProjectItem",
      [pitemId]
    ).value;
    this.openPItem(pitem);

    let splitIDs = blockId.split('____');

    if (splitIDs.length === 1) {
      let editorData =
        pitem._editorsData.items[Object.keys(pitem._editorsData.items)[0]];    
      this.instancesMap[editorData.editorId].getBlockById(blockId)["select"]();
      // highlightBlock(blockId);
    }
    else {
      let key = splitIDs[1];
      blockId = splitIDs[2];
      let title = splitIDs[0];

      this.OpenModalForBlockEditorInstance(
        key,
        title,
        () => {
          let editorData = pitem._editorsData.items[key];
          this.openInDialogue(
            editorData,
            pitem,
            "ec-action-implementation-debug",
            key + "-blockly-container",
            "EDITING",
            "BlocklyStudioIDE");
            this.instancesMap[editorData.editorId].getBlockById(blockId)["select"]();
        }, false);
    }
  }

  @RequiredFunction("Debugger", "createControllerReplica")
  @ExportedFunction
  public openBlockyEditorDebugTime(pitemId: string, title: string, wspKey: string, callback: Function) {
    // let pitem = ComponentsCommunication.functionRequest(
    //   this.name,
    //   "ProjectManager",
    //   "getProjectItem",
    //   [pitemId]
    // ).value;
    // this.openPItem(pitem);

    // this.OpenModalForBlockEditorInstance(
    //   wspKey,
    //   title,
    //   () => {
    //     let editorData = pitem._editorsData.items[wspKey];
    //     editorData.zIndex = 2000;

    //     this.openInDialogue(
    //       editorData,
    //       pitem,
    //       "ec-action-implementation-debug",
    //       wspKey + "-blockly-container",
    //       "EDITING",
    //       "BlocklyStudioIDE");

    //     // create debugger control div
    //     let controlPanel = document.createElement("div");
    //     controlPanel.id = "control-debugger-modal";
    //     controlPanel.style.setProperty("position","absolute");
    //     controlPanel.style.setProperty("top","1rem");
    //     controlPanel.style.setProperty("right","22rem");
    //     controlPanel.style.setProperty("width","5rem");
    //     document.getElementById(wspKey + "-modal-title").prepend(controlPanel);
        
    //     // call debugger
    //     ComponentsCommunication.functionRequest(
    //       this.name,
    //       "Debugger",
    //       "createControllerReplica",
    //       [
    //         "#" + controlPanel.id,
    //         () =>
    //         callback()
    //       ]
    //     );
    //   },
    //   true);
    callback();
  }

  @ExportedFunction
  public closeBlockyEditorDebugTime(wspId: string) {
    $("#" + wspId + "-modal")["modal"]("hide");
  }
}
