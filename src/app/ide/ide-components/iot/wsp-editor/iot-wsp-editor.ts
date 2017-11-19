import { ComponentRegistry } from './../../../components-framework/component/component-entry';
/**
 * IoT Application Editor
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */

import {
    UIComponentMetadata,
    ExportedFunction,
    RequiredFunction
} from "./../../../components-framework/component/component-loader";
import { IoTVPL } from "./../application/iot-vpl";
import { ComponentsCommunication } from "./../../../components-framework/component/components-communication";
import {
    IDEUIComponent,
    IViewDataComponent
} from "../../../components-framework/component/ide-ui-component";
import { IoTApplication } from "../application/iot-application";
import { Automation } from "../application/automation";
import { IoTAutomationList, IWSPEditorIoTAutomationsListViewElement } from "./iot-automations/iot-automation-list";
import { ViewRegistry } from "../../../components-framework/view/view";
import { EditorManager } from "../../../components-framework/build-in.components/editor-manager/editor-manager";


@UIComponentMetadata({
    description: "The basic skeletonof the IDE where the other visual components are attached in order to build the whole environment",
    componentView: "IoTWSPEditorView"
})
export class IoTWSPEditor extends IDEUIComponent {
    private app: IoTApplication;
    private automations: IWSPEditorIoTAutomationsListViewElement;
    private _selectedAutomationId: string;
    private editorManager: EditorManager;

    constructor(
        name: string,
        description: string,
        componentView: string
    ) {
        super(name, description, componentView);
        this.editorManager = <EditorManager>ComponentRegistry.getEntry("EditorManager").create();
        this._selectedAutomationId = "";
    }

    public get selectedAutomationId(): string {
        return this._selectedAutomationId;
    }

    public set selectedAutomationId(id: string) {
        this._selectedAutomationId = id;
    }

    public render(): void {
        super.render();
        this.automations.view.render();
        this.inject(this.automations);
        this.inject(this.editorManager);
    }

    @ExportedFunction
    public open (app: IoTApplication): void {
        this.app = app;
        // data for automations, categories of automations
        this.automations = {
            selector: ".automation-list-view-area",
            view: <IoTAutomationList>ViewRegistry.getEntry("IoTAutomationsWSPEditor").create(this, this.app)
        };
    }
    public onOpen(): void {}
    public destroy(): void {}
    public getView(): IViewDataComponent {
        return {
            main: this.view.$el
        };
    }
    public onClose(): void {}
    public registerEvents(): void {}
    public update(): void {}
    public load(): void {

    }
    public save(): void {

    }

    /**
     *  Handlers for events are wsp editor template
     */
    private openAutomation(automationId: string, automationType: string): void {
        const automation: Automation = this.app.getAutomation(automationId, automationType);
        this.editorManager.open(automationId, "BlocklyVPL", automation.src, IoTVPL.getToolbox(automation.type));
    }
    
    private createAutomation(): void {
        // new IoTAutomation, 
        // open blockly, with respective elements
        alert("createAutomation: not implemented yet!");
    }
}
