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
    collabInfo,
    filterPItem
} from "./collaboration-component/collaboration-core/utilities";

import {
    sendPItemAdded,
    sendPItemRemoved,
    sendPItemUpdated
} from "./collaboration-component/collaboration-core/senderHandlers";

import { 
    PassFloorPopup,
    SharePersonalFilePopup 
} from './collaboration-component/collaboration-gui/CollaborationPopups';

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
            name: "Alex Katsarakis",
            email: "akatsarakis@csd.uoc.gr",
            date: "June 2020"
        },
        {
            name: "Emmanuel Agapakis",
            email: "agapakis@csd.uoc.gr",
            date: "June 2020"
        },
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "June 2020"
        }
    ],
    componentView: "CollaborationManagerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class CollaborationManager extends IDEUIComponent {
    private shProject: any;
    private collabUI: any;

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
    loadComponentDataOfProject(projectId: string, componentsData: any) {
      // no action is required on loading project
    }

    @ExportedFunction
    public startSession(
        $popupContainer: any,
        projectObj: any,
        $toolbarContainer: any,
        success: (sharedProjectObj:any) => void,
        failure: () => void
    ) {
        // if(projectObj.componentsData.collaborationData){
        //     return; // Reopen already shared project
        // }
        this.collabUI = openStartSessionDialogue(
            this,
            $popupContainer,
            $toolbarContainer,
            (memberInfo, settings) => {
                communicationInitialize(memberInfo, settings, this);
                
                success(
                    collaborationFilter(
                        projectObj,
                        memberInfo,
                        settings
                    )
                );
            },
            () => { failure(); }
        );
    }

    @ExportedFunction
    public joinSession(
        selDialog: any,
        $toolbarSel: any,
        success: Function
    ) {
        this.collabUI = openJoinSessionDialogue(
            this,
            selDialog,
            $toolbarSel,
            (memberInfo, externalLink, cbUI) => {
                startCommunicationUser(memberInfo, externalLink, this, success, cbUI);
            },
            ()=>{console.log('closed join session');}
        );
    }

    @RequiredFunction("ProjectManager", "saveComponentData")
    private saveComponentData(data: any, id?: string){
        this.saveProjectComponentData(id || this.shProject._id, data);
    }

    @RequiredFunction("ProjectManager", "getComponentData")
    private getComponentData(id?: string) {
        return this.getProjectComponentData(id || this.shProject._id);
    }
//   @RequiredFunction("ProjectManager", "saveComponentData")
//   protected saveProjectComponentData(projectId: string, data: any) {
//       this._componentsData[projectId] = data;

//       ComponentsCommunication.functionRequest(
//           this.name,
//           "ProjectManager",
//           "saveComponentData",
//           [
//               this.name,
//               projectId,
//               this._componentsData[projectId]
//           ]
//       );
//   }

    public getCollabUI(){
        return this.collabUI["ui"];
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

    public getInvitationCode() {
        return collabInfo.invitationCode;
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
        let allData = this.getProjectComponentData(this.shProject._id);
        let settings = this.getProjectComponentData(this.shProject._id).projectInfo;
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
        opts.push({
            tooltip: "print code",
            icon: "../../../../../../images/collaboration/send.png",
            action: () => alert(this.getInvitationCode())
        })
        if(settings.reqOwnership && collabData.privileges.owner !== collabInfo.myInfo.name){ // Add Logic if "Allow members request for ownership" was enabled
            opts.push(
                {
                tooltip: "Request Ownership of Project Item",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert('Request ownership for the current project item')
            })
        }
        if(collabData.privileges.owner !== collabInfo.myInfo.name && collabData.privileges.author === collabInfo.myInfo.name){ // Add Logic if "Allow members request for ownership" was enabled
            opts.push(
                {
                tooltip: "Retrieve floor on project item",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => {
                    let newOwner = collabInfo.myInfo.name;
                    collabData.privileges.owner = newOwner;
                    if(newOwner !== collabInfo.myInfo.name){
                        collabData.privileges.shared.readOnly = true;
                        pitem.privileges = "READ_ONLY";
                    }else{
                        collabData.privileges.shared.readOnly = false;
                        pitem.privileges = "EDITING";
                    }
                    console.log(pitem);
                    this.onPItemUpdate(pitem.id, PItemEditType.OWNERSHIP, newOwner);
                    this.pitemUpdated(pitem.id, PItemEditType.OWNERSHIP, newOwner);
                }
            })
        }
        if(collabData.privileges.owner === collabInfo.myInfo.name){
            opts.push(
                {
                tooltip: "Give Floor",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => {
                    let container = $("<div></div>");
                    $("body").append(container);
                    let passFloorPopup = new PassFloorPopup(container);
                    passFloorPopup.setMembers(allData.members.filter((member)=>member.name !== collabInfo.myInfo.name));
                    passFloorPopup.setOnPassFloorCb((newOwner)=>{
                        collabData.privileges.owner = newOwner;
                        if(newOwner !== collabInfo.myInfo.name){
                            collabData.privileges.shared.readOnly = true;
                            pitem.privileges = "READ_ONLY";
                        }else{
                            collabData.privileges.shared.readOnly = false;
                            pitem.privileges = "EDITING";
                        }
                        console.log(pitem);
                        this.onPItemUpdate(pitem.id, PItemEditType.OWNERSHIP, newOwner);
                        this.pitemUpdated(pitem.id, PItemEditType.OWNERSHIP, newOwner);
                    });
                    // console.log('Give floor');
                    // let newOwner = 'whatever';
                    // collabData.privileges.owner = newOwner;
                    // this.pitemUpdated(pitem.id, PItemEditType.OWNERSHIP ,newOwner);
                }
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

    @ExportedFunction
    public getPItem(pitemId: string): ProjectItem {
        return this.shProject.projectItems.find(pi => pi.systemID === pitemId);
    }

    public setProject(projectObj: any) {
        this.shProject = projectObj;
    }

    public getProject(): any {
        return this.shProject;
    }
    
    private iAmMaster(myName): Boolean {
        console.log(myName, this.shProject.author.username);
        return this.shProject.author.username === myName;
    }

    @ExportedFunction
    public pitemUpdated(pitemId: string, type: PItemEditType, data: any): any {
        // if(this.iAmMaster(collabInfo.myInfo.name))this.saveProject(this.shProject,()=>{});
        console.log("pitemUpdated",pitemId,type,data);
        sendPItemUpdated(pitemId, type, data);
        return true;
    }

    @ExportedFunction
    public pitemRemoved(pitemId: string): boolean {
        sendPItemRemoved(pitemId);
        return true;
    }


    @ExportedFunction
    public pitemAdded(pitem: any): boolean {
        filterPItem(this.getPItem(pitem.itemData.systemID),true);
        // if(this.shProject.componentsData.collaborationData) TODO: ADD ON DB
        sendPItemAdded(pitem);
        return true;
    }

    @ExportedFunction
    public onCloseCollaborativeDebuggingSession(
        projectId: string,
        correctionSuggestions: Array<any>,
        callback: Function): void {
        // find session of the project (in case there are more than one instances)
        // update correction suggestions to the project
        // communicate and update all the member project
        // on finish call callback
    }

    /** Blockly Studio provided functionality */
    @RequiredFunction("EditorManager", "open")
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
                data,
                ()=>{
                    // if(this.iAmMaster(collabInfo.myInfo.name))this.saveProject(this.shProject,()=>{});
                }
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
                (pitem2) => {
                    filterPItem(pitem2,false);
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
