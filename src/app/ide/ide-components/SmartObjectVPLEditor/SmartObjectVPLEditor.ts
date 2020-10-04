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
                pitem.pi.getPrivilleges(),
                this.config
            );
        }
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
            let type = eConfName.split(SignalsPrefix.CREATE)[1];
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
    public tools(editorId: string): import("../../components-framework/build-in.components/editor-manager/editor-manager-toolbar-view/editor-manager-toolbar-view").ITool[] {
        throw new Error("Method not implemented.");
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

    private saveElement(element) {
        // this.save(
        //     element.data.id,

    }

    private registerSmartObject (data) {
        this.saveElement(data);
        // responsible to save SO and look up for the groups that match with
        // API of this smart object
    }

    private createSmartGroup(group) {
        // call project manager -> request new project item with data
        alert("not implemented yet createSmartGRoup");
    }

    private deleteSmartGroupFromObject(smartObject, smartGroup) {
        // retrieve smart group to edit innner data of the list with the smart objects
        alert("not implemented yet deleteSmartGroupFromObject");
    }

    private updateSmartObjectPropAlias(smartObject) {
        alert("not implemented yet updateSmartObjectPropAlias");
    }

    private updateSmartObjectPropProgrammingActive(smartObject) {
        alert("not implemented yet updateSmartObjectPropProgrammingActive");
    }

    private updateSmartGroupPropAlias(smartGroup) {
        alert("not implemented yet updateSmartGroupPropAlias");
    }

    private updateSmartGroupPropActive(smartGroup) {
        alert("not implemented yet updateSmartGroupPropActive");
    }

    private deleteSmartObjectFromGroup(smartGroup, smartObject) {
        // retrieve smart group to edit innner data of the list with the smart objects
        alert("not implemented yet deleteSmartObjectFromGroup");
    }

    @ExportedFunction
    public onChangeConfig(values: any): void {
        alert("on change config data not developed yet in Blockly Component");
    }
}
