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
  ],
  componentView: "SmartObjectVPLEditorView",
  menuDef: menuJson,
  configDef: confJson,
  version: "1.1",
})
export class SmartObjectVPLEditor extends Editor {
  private _groupDataOnCreate: any;
  private instancesMap: { [id: string]: any };

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
  public open(selector: string, pitem: PItemView, config: any): void {
    let editorData = pitem.pi.editorsData.items[selector];
    let img = pitem.pi["_jstreeNode"].icon;
    editorData.img = img;
    assert(
      editorData,
      "Source with id not found in SmartObject visual editor."
    );
    if (this._groupDataOnCreate) {
      editorData.details = this._groupDataOnCreate;
    }

    if (!this.instancesMap.hasOwnProperty(editorData.editorId)) {
      this.instancesMap[editorData.editorId] = new SOVPLElemInstance(
        this,
        {
          name: pitem.pi["_jstreeNode"].text,
          img: img,
          color: pitem.pi["_jstreeNode"].color,
          editorData: editorData,
        },
        pitem,
        selector,
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
      this.instancesMap[srcId],
      "Request to close not existing source ID in Blockly Editor!"
    );
    this.instancesMap[srcId].close();
  }

  @ExportedFunction
  public update_src(data: any, pitem: any, focus: boolean = false): void {
    let id = data.editorId;
    if (this.instancesMap[id] && focus) {
      this.instancesMap[id].sync(data, pitem);
    }
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
    editorConfig: any
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
    this.save(element.id, element.pitem.pi, (mode) =>
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
        let domainElementId = data.elemData.editorData.editorId;
        data.elemData.editorData.domainElementId = domainElementId;
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
    this._groupDataOnCreate = group;

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
        onCreated,
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

  @ExportedFunction
  public onChangeConfig(values: any): void {
    alert("on change config data not developed yet in Blockly Component");
  }
}
