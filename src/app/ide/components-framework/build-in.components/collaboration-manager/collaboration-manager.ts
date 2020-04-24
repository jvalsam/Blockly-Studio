import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ComponentsCommunication
} from "./../../component/components-communication";
import { openStartSessionDialogue } from "./collaboration-component/collaboration-gui/dialogs";
import { collaborationFilter } from "./collaboration-component/collaboration-core/utilities";
import { communicationInitialize } from "./collaboration-component/collaboration-core/index";

var menuJson;
var configJson;

@UIComponentMetadata({
    description: "Collaboration Manager of the IDE",
    authors: [
        {
            date: "",
            name: "",
            email: ""
        }
    ],
    componentView: "CollaborationManagerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class CollaborationManager extends IDEUIComponent {
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

    /**
     * 1. Pop up modal dialogue to start the collaboration process
     * 2. Collaboration toolbar opens...
     * @param dialogSel JQUERY div
     * @param dialogSel JQUERY div
     * @param dialogSel JQUERY div
     * @param dialogSel JQUERY div
     * 
     */
    @ExportedFunction
    public startSession(
        $dialog: any,
        projectObj: any,
        $container: any,
        callback: (sharedProjectObj:any) => void
    ) {
        openStartSessionDialogue(
            $dialog,
            $container,
            (memberInfo, settings) => {
                let sharedProject = collaborationFilter(
                    projectObj,
                    memberInfo,
                    settings
                );
                // TODO: initialize communication
                communicationInitialize();
                //
                callback(sharedProject);
            },
            () => { callback(null); }
        );
    }

    @ExportedFunction
    public joinSession(selDialog: any, callback: Function) {
        alert("Collabotaion join session is not implemented yet.");
    }

    // @RequiredFunction("ProjectManager", "getProject")
    // public getProject(projectId): any {
    //     let project = ComponentsCommunication.functionRequest(
    //         this.name,
    //         "ProjectManager",
    //         "getProject",
    //         []
    //     ).value;
    // }

    @ExportedFunction
    // public pitemOptions(pitemId): Array<Option> {} /* Option = { label, icon, action } */
    // public pitemTools(pitemId): Array<Tool> {} /* Tool = { icon, tooltip, action } */


    @ExportedFunction
    public getMembers(sessionId) {
        let resp = ComponentsCommunication.functionRequest (
            this.name,
            "ProjectManager",
            "function",
            []
        );
    }
}