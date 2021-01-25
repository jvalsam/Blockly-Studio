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
import {
  VPLElemNames,
  SignalsPrefix,
  SmartObjectState,
  SOVPLElemInstance,
} from "./sovpleditor-component/sovplelem-instance";
import { PItemView } from "../../components-framework/build-in.components/editor-manager/project-item/pitem-view";
import { assert } from "../../shared/ide-error/ide-error";
import { ProjectItem } from "../../components-framework/build-in.components/project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";
import { ITool } from "../../components-framework/build-in.components/editor-manager/editor-manager-toolbar-view/editor-manager-toolbar-view";
import { ComponentsCommunication } from "../../components-framework/component/components-communication";
import { ModalView } from "../../components-framework/component/view";
import { ViewRegistry } from "../../components-framework/component/registry";
import { RuntimeManager } from "../../components-framework/build-in.components/run-time-system-manager/run-time-manager";

var menuJson: any = require("./conf_menu.json");
var confJson: any = require("./conf_props.json");

@PlatformEditorMetadata({
  description: "VPL editor handles smart objects",
  authors: [
    {
      name: "Yannis Valsamakis",
      email: "jvalsam@ics.forth.gr",
      date: "October 2020",
    },
    {
      name: "Dimitris Linatiris",
      email: "dimilin@csd.uoc.gr",
      date: "November 2020",
    },
  ],
  isUnique: true,
  componentView: "SmartObjectVPLEditorView",
  menuDef: menuJson,
  configDef: confJson,
  version: "1.1",
})
export class SmartObjectVPLEditor extends Editor {
  private _groupDataOnCreate: any;
  private instancesMap: { [id: string]: SOVPLElemInstance };

  constructor(
    name: string,
    description: string,
    compViewName: string,
    hookSelector: string,
    private config = { profile: "default" }
  ) {
    super(name, description, compViewName, hookSelector);
    this.instancesMap = {};
    this._groupDataOnCreate = null;
  }

  @ExportedFunction
  loadComponentDataOfProject(projectId: string, componentsData: any) {
    // no action is required on loading project
  }

  getRegisteredDevices(projectId: string) {
    return this.getProjectComponentData(projectId);
  }

  private handleClearCashData(editorData) {
    if (this.instancesMap.hasOwnProperty(editorData.editorId)) {
      this.instancesMap[editorData.editorId].destroy();
      delete this.instancesMap[editorData.editorId];
    }
  }

  @ExportedSignal("create-smart-group", ["so-data"])
  @ExportedFunction
  public open(
    editorData: any,
    pitem: PItemView,
    config: any,
    cachedData: boolean
  ): void {
    if (this._groupDataOnCreate) {
      editorData.details = this._groupDataOnCreate;

      let domainElementId = editorData.editorId;
      editorData.domainElementId = domainElementId;
      editorData.domainElementType = "SmartGroup";

      ComponentsCommunication.postSignal(
        this.name,
        "create-smart-group",
        editorData
      );
    }

    if (!cachedData) {
      this.handleClearCashData(editorData);
    }

    if (!this.instancesMap.hasOwnProperty(editorData.editorId)) {
      this.instancesMap[editorData.editorId] = new SOVPLElemInstance(
        this,
        {
          name: pitem.pi["_jstreeNode"].text,
          img: editorData.img,
          color: pitem.pi["_jstreeNode"].color,
          editorData: editorData,
        },
        pitem.pi,
        editorData.editorId,
        pitem.pi.getPrivileges(),
        this.config
      );
      if (this._groupDataOnCreate) {
        this.saveElement(this.instancesMap[editorData.editorId]);
        this._groupDataOnCreate = null;
      }
    }
    this.instancesMap[editorData.editorId].open();
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
  public update_src(data: any, pitem: any, focus: boolean = false): void {
    let id = data.editorId;
    assert(
      id in this.instancesMap,
      "Not found instance of Smart Object VPL Editor"
    );
    this.instancesMap[id].sync(data.details, pitem, focus);
  }

  @ExportedFunction
  public updatePItemData(editorId: string, pitem: ProjectItem) {
    if (this.instancesMap[editorId] && focus) {
      this.instancesMap[editorId].updatePItemData(
        pitem["_jstreeNode"].text,
        pitem["_jstreeNode"].icon,
        pitem["_jstreeNode"].color
      );
    }
  }

  @ExportedFunction
  public factoryNewItem(
    pitemName: string,
    eConfName: string,
    pitemInfo: any,
    editorConfig: any,
    projectinfo: any
  ): any {
    let type = eConfName.split("ec-")[1];
    switch (type) {
      case VPLElemNames.SMART_OBJECT:
        return {
          type: type,
          details: {
            state: SmartObjectState.UNREGISTERED,
            groups: [],
          },
        };
      case VPLElemNames.SMART_GROUP:
        return {
          type: type,
          details: {},
        };
      default:
        throw Error("Invalid type VLP element" + type);
    }
  }

  public undo(): void {
    throw new Error("Method not implemented.");
  }

  public redo(): void {
    throw new Error("Method not implemented.");
  }

  public copy(): void {
    throw new Error("Method not implemented.");
  }

  public paste(): void {
    throw new Error("Method not implemented.");
  }

  @ExportedFunction
  public tools(editorId: string): Array<ITool> {
    return [
      // {
      //   icon: "../../../../../images/blockly/undo.png",
      //   tooltip: "undo",
      //   action: () => this.instancesMap[editorId].undo()
      // },
      // {
      //   icon: "../../../../../images/blockly/redo.png",
      //   tooltip: "redo",
      //   action: () => this.instancesMap[editorId].redo()
      // }
    ];
  }

  public getDomainElementData(
    projectId: string,
    domainElemId: string
  ): IDomainElementData {
    throw new Error("Method not implemented.");
  }
  public registerEvents(): void {
    throw new Error("Method not implemented.");
  }
  public update(): void {
    throw new Error("Method not implemented.");
  }
  public onOpen(): void {
    throw new Error("Method not implemented.");
  }
  public onClose(): void {
    throw new Error("Method not implemented.");
  }
  public destroy(): void {
    throw new Error("Method not implemented.");
  }

  @ExportedFunction
  public render(): void {}

  @RequiredFunction("ProjectManager", "saveEditorData")
  private saveElement(element) {
    this.save(element.id, element.pitem, (mode) =>
      mode === "SHARED"
        ? this.filterToSave(element.data.editorData)
        : this.filterToSave(element.data.editorData)
    );
  }

  @RequiredFunction("ProjectManager", "saveComponentData")
  @RequiredFunction("ProjectManager", "getComponentData")
  private filterToSave(data) {
    return {
      type: data.type,
      details: data.details,
    };
  }

  @ExportedSignal("create-smart-object", ["so-data"])
  private registerSmartObject(data, handleGroups) {
    handleGroups(
      this.retrievePItemGroups(data.elemData.editorData.projectID),
      () => {
        // this works because only one domain element is able to be created in one editor
        // this will need extra handling in case of other editors
        // they will have to generate different ids per vpl elem

        // required fields:
        let domainElementId = data.elemData.editorData.editorId;
        data.elemData.editorData.domainElementId = domainElementId;
        data.elemData.editorData.domainElementType = "SmartObject";
        // required field: data.elemData.editorData.projectID
        //TODO: domainelementtype
        //
        ComponentsCommunication.postSignal(
          this.name,
          "create-smart-object",
          data.elemData.editorData
        );
      }
    );
  }

  @RequiredFunction("ProjectManager", "getProjectCategory")
  @RequiredFunction("ProjectManager", "onAddProjectElement")
  private createSmartGroup(group, projectId, onCreated) {
    let projectCategory = ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "getProjectCategory",
      [projectId, "SmartGroups"]
    ).value;

    ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "onAddProjectElement",
      [
        {
          type: "pi-smart-group",
          action: "onAddProjectElement",
          providedBy: "Platform",
          data: {
            choices: [
              {
                type: "pi-smart-group",
                mission: "ec-smart-group",
              },
            ],
          },
          validation: [
            {
              type: "system",
              rules: [
                {
                  action: "duplicate",
                  items: ["smartgroup_title"],
                },
              ],
            },
          ],
        },
        projectCategory,
        (pitem) => {
          this._groupDataOnCreate = group;
          onCreated(pitem);
        },
      ]
    );
  }

  private updateSmartObjectPropAlias(smartObject, type) {
    alert("not implemented yet updateSmartObjectPropAlias");
  }

  private updateSmartObjectPropProgrammingActive(smartObject, type) {
    alert("not implemented yet updateSmartObjectPropProgrammingActive");
  }

  private updateSmartGroupPropAlias(smartGroup, type) {
    alert("not implemented yet updateSmartGroupPropAlias");
  }

  private updateSmartGroupPropActive(smartGroup, type) {
    alert("not implemented yet updateSmartGroupPropActive");
  }

  @RequiredFunction("ProjectManager", "clickProjectElement")
  private openSmartElement(elementId: string) {
    ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "clickProjectElement",
      [elementId]
    );
  }

  @RequiredFunction("ProjectManager", "getProjectItem")
  private getSmartElement(elementId: string) {
    return ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "getProjectItem",
      [elementId]
    ).value;
  }

  @RequiredFunction("ProjectManager", "getProjectItems")
  private retrievePItemGroups(projectId) {
    return ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "getProjectItems",
      [projectId, "pi-smart-group"]
    ).value;
  }

  private retrievePItemDevices(projectId) {
    return ComponentsCommunication.functionRequest(
      this.name,
      "ProjectManager",
      "getProjectItems",
      [projectId, "pi-smart-object"]
    ).value;
  }

  @ExportedSignal("delete-smart-object", ["so-data"])
  @ExportedSignal("delete-smart-group", ["so-data"])
  @ExportedSignal("rename-smart-object", ["so-data"])
  @ExportedSignal("rename-smart-group", ["so-data"])
  private onAskToDeleteSmartElementWithDependencies(
    type,
    pelem,
    smartElement,
    projectID,
    visualSources,
    onSuccess
  ) {
    let sources = [];

    visualSources.blocks.forEach((block) => {
      if (!sources.includes(block.pelemName)) {
        sources.push(block.pelemName);
      }
    });
    let pluralText = sources.length > 1 ? "s" : "";

    (<ModalView>ViewRegistry.getEntry("SequentialDialoguesModalView").create(
      this,
      [
        {
          type: "simple",
          data: {
            title: "Delete " + type + ": " + smartElement.title,
            body: {
              text:
                'The smart object "<b>' +
                smartElement.title +
                '</b>" has been used from project element' +
                pluralText +
                ':<br/><b><div style="max-height: 6rem; margin-bottom: 0.8rem; overflow-y: auto;"><li>' +
                sources.join("</li><li>") +
                "</li></div></b>" +
                'Do you want to delete <b>"' +
                smartElement.title +
                '</b>" and the respective <b>blocks</b> from the <br/>above project element' +
                pluralText +
                "?",
            },
            actions: [
              {
                choice: "Cancel",
                type: "button",
                providedBy: "self",
              },
              {
                choice: "Delete",
                type: "submit",
                providedBy: "creator",
                callback: () => {
                  // notify to delete defined blocks and the designed blocks from the wsps
                  ComponentsCommunication.postSignal(
                    this.name,
                    "delete-" + pelem._jstreeNode.type.split("pi-")[1],
                    smartElement
                  );
                  // delete project element
                  onSuccess.exec_action();
                },
              },
            ],
          },
        },
      ]
    )).open();
  }

  private onRenameReferencedBlocks() {}

  @RequiredFunction("BlocklyVPL", "getVisualSourcesUseDomainElementInstaceById")
  onProjectElementActionsHandling(type, action, pelem, onSuccess) {
    let projectID = pelem._editorsData.projectID;
    let smartElement =
      pelem._editorsData.items[Object.keys(pelem._editorsData.items)[0]];
    let domainElementId = smartElement.domainElementId;

    let visualSources = ComponentsCommunication.functionRequest(
      this.name,
      "BlocklyVPL",
      "getVisualSourcesUseDomainElementInstaceById",
      [projectID, domainElementId, smartElement.domainElementType]
    ).value;

    switch (action) {
      case "delete-previous":
        if (
          visualSources &&
          Array.isArray(visualSources.blocks) &&
          visualSources.blocks.length > 0
        ) {
          this.onAskToDeleteSmartElementWithDependencies(
            type,
            pelem,
            smartElement,
            projectID,
            visualSources,
            onSuccess
          );
        } else {
          onSuccess.exec_open_dialogue();
        }
        // TODO: check to delete
        // in case it is ok, delete signal for the element + call on success
        break;
      case "delete-after":
        onSuccess.exec_action();
        break;
      case "rename-after":
        smartElement.title = pelem._jstreeNode.text;
        smartElement.img = pelem._jstreeNode.icon;
        smartElement.colour = pelem._jstreeNode.color;

        if (smartElement.details.state !== "Unregistered") {
          ComponentsCommunication.postSignal(
            this.name,
            "rename-" + pelem._jstreeNode.type.split("pi-")[1],
            smartElement
          );
        }
        break;
      default:
        onSuccess.exec_open_dialogue();
    }
  }

  @ExportedFunction
  public onChangeConfig(values: any): void {
    alert("on change config data not developed yet in Blockly Component");
  }

  @ExportedFunction
  public generateCodeDataForExecution(data: any) {
    // if (RuntimeManager.getMode() === "RELEASE") {
    // alert("Not implemented generateCodeDataForExecution in " + this.name);
    let envData = JSON.parse(JSON.stringify(data));
    // if (RuntimeManager.getMode() === "DEBUG") {
    envData.debugTests = this.getDebugTests(data);
    // }
    return envData;
    // } else {
    //   return this.instancesMap[data.domainElementId];
    // }
  }

  @ExportedFunction
  public loadSource(editorData: any, pitem: ProjectItem) {
    let img = pitem["_jstreeNode"].icon;
    editorData.img = img;

    this.instancesMap[editorData.editorId] = new SOVPLElemInstance(
      this,
      {
        name: pitem["_jstreeNode"].text,
        img: img,
        color: pitem["_jstreeNode"].color,
        editorData: editorData,
      },
      pitem,
      editorData.editorId,
      pitem.getPrivileges(),
      this.config
    );
  }

  @ExportedFunction
  public saveSimulateBehaviorTest(data: any) {
    let compData = this.getProjectComponentData(data.projectID);
    if (!compData.debugTests) compData.debugTests = {};
    if (!compData.debugTests.simulateBehaviorTests)
      compData.debugTests.simulateBehaviorTests = [];
    compData.debugTests.simulateBehaviorTests.push(data);
    // test = data.debugTest;
    this.saveProjectComponentData(data.projectID, compData);
  }

  @ExportedFunction
  public saveExpectedValuesCheckingTest(data: any) {
    let compData = this.getProjectComponentData(data.projectID);
    if (!compData.debugTests) compData.debugTests = {};
    if (!compData.debugTests.expectedValuesCheckingTests)
      compData.debugTests.expectedValuesCheckingTests = [];
    compData.debugTests.expectedValuesCheckingTests.push({
      time: data.time,
      projectId: data.projectId,
      test: data.debugTest,
    });
    // test = data.debugTest;
    this.saveProjectComponentData(data.projectID, compData);
  }

  @ExportedFunction
  public deleteDebugTest(data: any) {
    let compData = this.getProjectComponentData(data.projectID);
    let indexDebugTest = compData.debugTests.findIndex(
      (x) => x.id === data.debugTestId
    );
    if (indexDebugTest > -1) {
      compData.debugTests.splice(indexDebugTest, 1);
    }
    this.saveProjectComponentData(data.projectID, compData);
  }

  @ExportedFunction
  public getDebugTests(data: any) {
    let compData = this.getProjectComponentData(data.projectID);
    if (compData.debugTests) return compData.debugTests;
    return {};
  }

  @ExportedFunction
  public foldRunTimeModal() {
    document.getElementById("fold-runtime-modal").click();
  }

  @ExportedFunction
  public clickDebugConfigurationOfAction(
    smartElementId: string,
    action: any,
    privilege
  ) {
    this.instancesMap[smartElementId].onClickDebugConfigurationOfAction(
      action,
      privilege
    );
  }

  @RequiredFunction("BlocklyVPL", "openInDialogue")
  @ExportedFunction
  requestBlocklyInstance(
    editorsData: any,
    pitem: PItemView,
    confName: string,
    selector: string,
    privileges: string
  ) {
    ComponentsCommunication.functionRequest(
      this.name,
      "BlocklyVPL",
      "openInDialogue",
      [editorsData, pitem, confName, selector, privileges]
    );
  }

  @RequiredFunction("BlocklyVPL", "saveEditorData")
  @ExportedFunction
  saveEditorDataForBlocklyInstance(editorId: string) {
    return ComponentsCommunication.functionRequest(
      this.name,
      "BlocklyVPL",
      "saveEditorData",
      [editorId]
    ).value;
  }

  @RequiredFunction("BlocklyVPL", "getEditorSrc")
  @ExportedFunction
  getSrcFromBlocklyInstance(editorId: string) {
    return ComponentsCommunication.functionRequest(
      this.name,
      "BlocklyVPL",
      "getEditorSrc",
      [editorId]
    ).value;
  }

  @RequiredFunction("BlocklyVPL", "closeSRC")
  @ExportedFunction
  closeSrcForBlocklyInstance(editorId: string) {
    ComponentsCommunication.functionRequest(
      this.name,
      "BlocklyVPL",
      "closeSRC",
      [editorId]
    );
  }
}
