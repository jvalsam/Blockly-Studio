/**
 * IoT Application Editor
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */
import { ExportedFunction } from '../../../components-framework/component/ide-component';

import IoTWSPEditorTmpl from "./iot-wsp-editor.html";
import {
    UIComponentMetadata,
    IDEUIComponent,
    IViewDataComponent
} from "../../../components-framework/component/ide-ui-component";
import { IoTApplication } from "../application/iot-application";
import { IoTAutomationList, IWSPEditorIoTAutomationsListViewElement } from "./iot-automations/iot-automation-list";
import { ViewRegistry } from "../../../components-framework/view/view-registry";

@UIComponentMetadata({
    name: "IoTWSPEditor",
    description: "The basic skeleton of the IDE where the other visual components are attached in order to build the whole environment",
    selector: "#app",
    templateHTML: IoTWSPEditorTmpl
})
export class IoTWSPEditor extends IDEUIComponent {
    private app: IoTApplication;
    private automations: IWSPEditorIoTAutomationsListViewElement;
    // private smartObjectsSelected: Array<string>; // Smart Object ids, in case are not selected array is undefined, and we get them all
    // private start: ApplicationStart;
    // private automations: ApplicationAutomations;
    // private screens: ApplicationScreens;

    constructor(
        name: string,
        description: string,
        protected _selector: string,
        templateHTML: string
    ) {
        super(name, description, _selector, templateHTML);
    }

    public render(): void {
        super.render();
        this.automations.view.render();
        this.inject(this.automations);
    }

    @ExportedFunction
    public open (app: IoTApplication) {
        this.app = app;
        // data for automations, categories of automations
        this.automations = {
            selector: ".automation-list-view-area",
            view: <IoTAutomationList>ViewRegistry.getViewEntry("IoTAutomationsWSPEditor").create(this, this.app)
        };
    }
    public onOpen(): void {}
    public destroy(): void {}
    public getView(): IViewDataComponent {
        return {
            main: this._view.$el
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
    private openAutomation(automationId: string): void {
        // IoT Automation
        alert("openAutomation: not implemented yet!");
    }
    
    private createAutomation(): void {
        // new IoTAutomation, 
        // open blockly, with respective elements
        alert("createAutomation: not implemented yet!");
    }
}
