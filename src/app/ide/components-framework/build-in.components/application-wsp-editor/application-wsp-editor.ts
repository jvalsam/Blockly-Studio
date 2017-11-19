/**
 * Application - Application Data and View of the end-user development
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import { IDEUIComponent, IViewDataComponent } from "../../component/ide-ui-component";
import { UIComponentMetadata } from "../../component/component-loader";
import { ApplicationStart } from "./application-start/application-start";
import { ApplicationAutomations } from "./application-automations/application-automations";
import { ApplicationScreens } from "./application-screens/application-screens";

@UIComponentMetadata({
    description: "The basic skeleton of the IDE where the other visual components are attached in order to build the whole environment",
    componentView: "ApplicationWSPEditorView"
})
export class ApplicationWSPEditor extends IDEUIComponent {
    private smartObjectsSelected: Array<string>; // Smart Object ids, in case are not selected array is undefined, and we get them all
    private start: ApplicationStart;
    private automations: ApplicationAutomations;
    private screens: ApplicationScreens;

    constructor(
        name: string,
        description: string,
        componentView: string
    ) {
        super(name, description, componentView);
    }

    public open (applicationId: string) {
        // request application
        // 
    }
    public onOpen(): void {}
    public destroy(): void {}
    public onClose(): void {}
    public registerEvents(): void {}
    public update(): void {}
    public load(): void {

    }
    public save(): void {

    }
}