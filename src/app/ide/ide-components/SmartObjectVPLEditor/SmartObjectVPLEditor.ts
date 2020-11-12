import {
    Editor,
    IDomainElementData
} from '../../components-framework/build-in.components/editor-manager/editor';
import {
    ExportedSignal,
    ExportedFunction,
    RequiredFunction,
    ListensSignal,
    PlatformEditorMetadata
  } from "../../components-framework/component/component-loader";
import {
    VPLElemNames,
    SignalsPrefix,
    SmartObjectState,
    SOVPLElemInstance
} from "./sovpleditor-component/sovplelem-instance";
import {
    PItemView
} from "../../components-framework/build-in.components/editor-manager/project-item/pitem-view";
import { assert } from "../../shared/ide-error/ide-error";
import { ProjectItem } from '../../components-framework/build-in.components/project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item';
import { ITool } from '../../components-framework/build-in.components/editor-manager/editor-manager-toolbar-view/editor-manager-toolbar-view';
import { ComponentsCommunication } from '../../components-framework/component/components-communication';


var menuJson: any = require("./conf_menu.json");
var confJson: any = require("./conf_props.json");

@PlatformEditorMetadata({
  description: "VPL editor handles smart objects",
  authors: [
    {
      name: "Yannis Valsamakis",
      email: "jvalsam@ics.forth.gr",
      date: "October 2020"
    }
  ],
  componentView: "SmartObjectVPLEditorView",
  menuDef: menuJson,
  configDef: confJson,
  version: "1.1"
})
export class SmartObjectVPLEditor extends Editor {
    private instancesMap: {[id: string]: any};

    constructor(
        name: string,
        description: string,
        compViewName: string,
        hookSelector: string,
        private config = { profile: "default" }
    ) {
        super(
            name,
            description,
            compViewName,
            hookSelector
          );
          this.instancesMap = {};
    }

    @ExportedFunction
    public open(
        selector: string,
        pitem: PItemView,
        config: any
    ): void {
        let editorData = pitem.pi.editorsData.items[selector];
        assert(editorData, "Source with id not found in SmartObject visual editor.");

        if (!this.instancesMap.hasOwnProperty(editorData.editorId)) {
            this.instancesMap[editorData.editorId] = new SOVPLElemInstance(
                this,
                {
                    name: pitem.pi["_jstreeNode"].text,
                    img: pitem.pi["_jstreeNode"].icon,
                    color: pitem.pi["_jstreeNode"].color,
                    editorData: editorData
                },
                pitem,
                selector,
                pitem.pi.getPrivileges(),
                this.config
            );
        }
        this.instancesMap[editorData.editorId].open();
    }

    @ExportedFunction
    public update_src(data: any, pitem: any, focus: boolean =false): void {
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
                pitem["_jstreeNode"].color,
            );
        }
    }

    @ExportedFunction
    public factoryNewItem(
        pitemName: string,
        eConfName: string,
        pitemInfo: any,
        editorConfig: any): any {
            let type = eConfName.split("ec-")[1];
            switch (type) {
                case VPLElemNames.SMART_OBJECT:
                    return {
                        type: type,
                        details: {
                            state: SmartObjectState.UNREGISTERED,
                            groups: []
                        }
                    };
                case VPLElemNames.SMART_GROUP:
                    return {
                        type: type,
                        details: {
                        }
                    };
                default:
                    throw Error('Invalid type VLP element' + type);
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
    public closeSRC(srcId: string): void {
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

    public getDomainElementData(projectId: string, domainElemId: string): IDomainElementData {
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
    public render(): void {

    }

    @RequiredFunction("ProjectManager", "saveEditorData")
    private saveElement(element) {
        this.save(
            element.id,
            element.pitem.pi,
            (mode) => mode === "SHARED"
              ? element.data
              : element.data
            );
    }

    private registerSmartObject (data, handleGroups) {
        let groups = this.retrievePItemGroups(data.elemData.editorData.projectID);
        handleGroups(groups);
    }

    private createSmartGroup(group, type) {
        // call project manager -> request new project item with data
        alert("not implemented yet createSmartGRoup");
    }

    private deleteSmartGroupFromObject(smartObject, smartGroup, type) {
        // retrieve smart group to edit innner data of the list with the smart objects
        alert("not implemented yet deleteSmartGroupFromObject");
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

    private deleteSmartObjectFromGroup(smartGroup, smartObject, type) {
        // retrieve smart group to edit innner data of the list with the smart objects
        alert("not implemented yet deleteSmartObjectFromGroup");
    }

    @RequiredFunction("ProjectManager", "getProjectItems")
    private retrievePItemGroups(projectId) {
        return ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "getProjectItems",
            [
                projectId,
                "pi-smart-group"
            ]
        ).value;
    }

    private retrievePItemDevices(projectId) {
        return ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "getProjectItems",
            [
                projectId,
                "pi-smart-object"
            ]
        ).value;
    }

    @ExportedFunction
    public onChangeConfig(values: any): void {
        alert("on change config data not developed yet in Blockly Component");
    }
}
