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

import {
    collaborationFilter,
    collabInfo
} from "./collaboration-component/collaboration-core/utilities";

import {
    sendPItemAdded,
    sendPItemRemoved
} from "./collaboration-component/collaboration-core/senderHandlers";
import { CollaborationSharePopup } from './collaboration-component/collaboration-gui/CollaborationPopups';

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
    private shProject: any;

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
        $popupContainer: any,
        projectObj: any,
        $toolbarContainer: any,
        success: (sharedProjectObj:any) => void,
        failure: () => void
    ) {
        openStartSessionDialogue(
            this,
            $popupContainer,
            $toolbarContainer,
            (memberInfo, settings) => {
                communicationInitialize(memberInfo, settings, this);
                
                let sharedProject = collaborationFilter(
                    projectObj,
                    memberInfo,
                    settings
                );
                success(sharedProject);
            },
            () => { failure(); }
        );
    }

    @ExportedFunction
    public joinSession(selDialog: any, callback: Function) {
        openJoinSessionDialogue(
            selDialog,
            (memberInfo, externalLink) => {
                startCommunicationUser(memberInfo, externalLink, this, callback);
            }
        );
    }

    @RequiredFunction("ProjectManager", "resizeContainerArea")
    private resizeToolbar($toolbarContainer, width, callback) {
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "resizeContainerArea",
            [
                this.name,
                $toolbarContainer,
                width,
                callback
            ]
        )
    }

    private reservedOptions = {
        jstree_BlocklyTasks: [
            {
                label: "A button",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert(1)
            }
        ]
    }

    private optionsFiltering(pitem){
        console.log(pitem);

        let opts = [];
        
        if(true){
            opts.push(
                {
                label: "Share",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert(pitem["renderParts"][1].value.text)
            })
        }
        
        return opts;
    }

    private toolsFiltering(pitem){
        let opts = [];
        opts.push({
            tooltip: "Get Name",
            icon: "../../../../../../images/collaboration/name.png",
            action: () => alert(pitem["renderParts"][1].value.text)
        });

        let settings = this.shProject.componentsData.collaborationData.projectInfo;
        let collabData = pitem.componentsData.collaborationData;
        if(settings.createPItem){ // Add Logic if "Allow members to create project item" was enabled
            opts.push(
                {
                tooltip: "Create Project Item",
                icon: "../../../../../../images/collaboration/addItem.png",
                action: () => alert('Create Project Item')
            })
        }
        if(settings.makeNotes){ // Add Logic if "Allow members to make notes" was enabled
            opts.push(
                {
                tooltip: "Make Note",
                icon: "../../../../../../images/collaboration/note.png",
                action: () => alert('Make a note on the current project item')
            })
        }
        if(settings.reqOwnership && collabData.privileges.owner !== collabInfo.myInfo.name){ // Add Logic if "Allow members request for ownership" was enabled
            opts.push(
                {
                tooltip: "Request Ownership of Project Item",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert('Request ownership for the current project item')
            })
        }
        if(collabData.privileges.owner === collabInfo.myInfo.name){
            opts.push(
                {
                tooltip: "Give Floor",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => {console.log('Give floor');collabData.privileges.owner = "whatevernew";}
            })
        }
        if(settings.createPersonalPItem){ // Add Logic if "Allow members to create personal project items" was enabled
            opts.push(
                {
                tooltip: "Create Personal Project Item",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert("Create Personal Project Item")
            })
        }
        if(settings.sharePersonalProjectItem){ // Add Logic if "Allow members to share personal project items" was enabled
            opts.push(
                {
                tooltip: "Share Personal Project Item",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert("Share Personal Project Item")
            })
        }
        // console.log(this.shProject);
        return opts;
    }


    @ExportedFunction
    public pitemOptions(pitemId: string): Array<IOption> {
        console.log(pitemId,this.getPItem(pitemId));
        if(this.getPItem(pitemId)){
            return this.optionsFiltering(this.getPItem(pitemId));
        }else if(this.reservedOptions.hasOwnProperty(pitemId)){
            return this.reservedOptions[pitemId];
        }
        return [];
    }

    @ExportedFunction
    public pitemTools(pitemId: string): Array<ITool> {
        if(this.getPItem(pitemId)){
            return this.toolsFiltering(this.getPItem(pitemId));
        }else if(this.reservedOptions.hasOwnProperty(pitemId)){
            return this.reservedOptions[pitemId];
        }
        return [];
    }

    @ExportedFunction
    public getMembers(sessionId) {
        let resp = ComponentsCommunication.functionRequest (
            this.name,
            "ProjectManager",
            "function",
            []
            // [collabInfo.connected_users]
        );
    }

    public getPItem(pitemId: string): ProjectItem {
        return this.shProject.projectItems.find(pi => pi.systemID === pitemId);
    }

    public setProject(projectObj: any) {
        this.shProject = projectObj;
    }

    public getProject(): any {
        return this.shProject;
    }

    @ExportedFunction
    public pitemUpdated(pitemId: string, type: PItemEditType, data: any): any {
        console.log("pitemUpdated",pitemId,type);
        return true;
    }

    @ExportedFunction
    public pitemRemoved(pitemId: string): boolean {
        sendPItemRemoved(pitemId);
        return true;
    }


    @ExportedFunction
    public pitemAdded(pitem: any): boolean {
        sendPItemAdded(pitem);
        return true;
    }


    /** Blockly Studio provided functionality */

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

    @RequiredFunction("ProjectManager", "pitemUpdated")
    public onPItemUpdate(pitemId: string, type: string, data: any) {
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "pitemUpdated",
            [
                pitemId,
                type,
                data
            ]
        );
    }

    private pItemUpdateLocally(pitemId: string, type: string, data: any){
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "pItemUpdatedLocally",
            [
                pitemId,
                type,
                data
            ]
        );
    }

    @RequiredFunction("ProjectManager", "pitemAdded")
    public onPitemAdded(pitem: any): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "pitemAdded",
            [
                pitem,
                // callback to notify the member for action
                (msg) => {
                   console.log("PITEMADDED"); 
                }
            ]
        );
    }

    @RequiredFunction("ProjectManager", "pitemRemoved")
    public onPitemRemoved(pitemId: string): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "pitemRemoved",
            [
                pitemId,
                // callback to notify the member for action
                (msg) => {

                }
            ]
        );
    }
}
