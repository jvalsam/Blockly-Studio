import { SessionHolder } from './session-holder';
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ComponentsCommunication
} from "./../../component/components-communication";
import { 
    openStartSessionDialogue,
    openJoinSessionDialogue 
} from "./collaboration-component/collaboration-gui/dialogs";

import { 
    communicationInitialize,
    startCommunicationUser 
} from "./collaboration-component/collaboration-core/index";
import {
    ProjectItem
} from "../project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item";

var menuJson;
var configJson;

interface IOption {
    label: string;
    icon: string;
    action: Function;
};
interface ITool {
    icon: string;
    tooltip: string;
    action: Function;
};

enum PItemEditType {
    SRC = "src",              // source editor changed
    RENAME = "rename",        // rename (color, title, img)
    OWNERSHIP = "ownership",  // change the floor
    PRIVILEGES = "privileges" // change if it will be visible or not
}


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
                /*let sharedProject = collaborationFilter(
                    projectObj,
                    memberInfo,
                    settings
                );*/

                communicationInitialize(memberInfo);
                //
                //callback(sharedProject);
                callback(projectObj);
            },
            () => { callback(null); }
        );
    }

    @ExportedFunction
    public joinSession(selDialog: any, callback: Function) {
        openJoinSessionDialogue(
            selDialog,
            (memberInfo, externalLink) => {
                console.log("Will try to connect to "+externalLink);
                startCommunicationUser(memberInfo, externalLink);
            },
            () => { callback(null); }
        );
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
    public pitemOptions(pitemId: string): Array<IOption> {
        return [];
    }

    @ExportedFunction
    public pitemTools(pitemId: string): Array<ITool> {
        return [
            {
                tooltip: "Change project item floor.",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert("test")
            }
        ];
    }

    @ExportedFunction
    public getMembers(sessionId) {
        let resp = ComponentsCommunication.functionRequest (
            this.name,
            "ProjectManager",
            "function",
            []
        );
    }

    /** IDE provided API functions */

    public getPItem(pitemId: string): ProjectItem {
        return ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "getProjectItem",
            [pitemId ]
        ).value;
    }

    public getProject(projectId: string): any {
        // ?????????????????????????????????
    }

    public pitemUpdated(pitemId: string, type: PItemEditType, data: any): any {

        return true;
    }

    public pitemRemoved(pitemId: string): boolean {
        return true;
    }

    public pitemAdded(pitem: any): boolean {
        return true;
    }

    public pitemFocus(pitemId: string, location: number =2): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "EditorManager",
            "open",
            [
                this.getPItem(pitemId),
                location
            ]
        );
    }

    @RequiredFunction("ProjectManager", "saveProjectObj")
    public saveProject(projectObj: any, cb: Function) {
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "saveProjectObj",
            [
                projectObj,
                (resp) => cb(resp)
            ]
        );
    }
}
