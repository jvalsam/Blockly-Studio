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
} from "./collaborative-debugging-component/collaborative-debugging-gui/dialogs";
import {
    CollaborativeDebuggingComponent
} from "./collaborative-debugging-component/collaborative-debugging-core/collaborative-debugging-session";


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


@UIComponentMetadata({
    description: "Collaborative Debugging of the IDE",
    authors: [
        {
            name: "Alex Katsarakis",
            email: "akatsarakis@csd.uoc.gr",
            date: "December 2020"
        },
        {
            name: "Emmanuel Agapakis",
            email: "agapakis@csd.uoc.gr",
            date: "December 2020"
        },
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "December 2020"
        }
    ],
    componentView: "CollaborativeDebuggingView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class CollaborativeDebugging extends IDEUIComponent {
    private shProject: any;
    private collabUI: any;
    private isMaster: boolean;
    private collabDebugInst: CollaborativeDebuggingComponent;

    /**
     * Handle start of the collaborative debugging session
     */

    @ExportedFunction
    public startSession(
        $popupContainer: any,
        projectObj: any,
        $toolbarContainer: any,
        success: (sharedProjectObj:any) => void,
        failure: () => void
    ) {
        this.collabUI = openStartSessionDialogue(
            this,
            $popupContainer,
            $toolbarContainer,
            (memberInfo, settings) => {
                // communicationInitialize(memberInfo, settings, this);
                // this.isMaster = true;

                // success(
                //     collaborationFilter(
                //         projectObj,
                //         memberInfo,
                //         settings
                //     )
                // );
            },
            () => {
                failure();
            }
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
                // startCommunicationUser(memberInfo, externalLink, this, success, cbUI);
                // this.isMaster = false;
            },
            ()=>{console.log('closed join session');}
        );
    }

    /**
     * Handle close of the collaborative debugging session
     */

    // dialogue to select the correction suggestions
    @RequiredFunction("ProjectManager", "onCloseCollaborationDebuggingSession")
    private onCloseCollaborativeDebuggingSession() {
        if (this.isMaster) {
            // pop up UI to select which of the correction suggestions will be applied
            // on success callback
            this.closeCollaborativeDebuggingSession([/* collected corrections
                that will apply to the project */]);
        }
        else {
            ComponentsCommunication.functionRequest(
                this.name,
                "ProjectManager",
                "onCloseCollaborationDebuggingSession",
                [ this.shProject._id ]
            );
        }
    }
    @RequiredFunction("CollaborationManager", "onCloseCollaborativeDebuggingSession")
    private closeCollaborativeDebuggingSession(corrections: Array<any>) {
        if (this.shProject.saveMode === "SHARED") {
            // 
            ComponentsCommunication.functionRequest(
                this.name,
                "CollaborationManager",
                "onCloseCollaborativeDebuggingSession",
                [
                    this.shProject._id,
                    corrections,
                    () => { // on complete update project and correction suggestions to all the members
                        ComponentsCommunication.functionRequest(
                            this.name,
                            "ProjectManager",
                            "onCloseCollaborationDebuggingSession",
                            [ this.shProject._id ]
                        );
                    }
                ]
            )
        }
        else {
            ComponentsCommunication.functionRequest(
                this.name,
                "ProjectManager",
                "onCloseCollaborationDebuggingSession",
                [ this.shProject._id ]
            );
        }
    }

    @ExportedFunction
    public onClickProjectElement(pitemId: string) {
        // request to open the pitem with specific view of the correction suggestion...
        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "openProjectItem_COLLAB_DEBUG",
            [
                pitemId,
                this.collabDebugInst.getPItemCorrectionSuggestionData(pitemId)
            ]
        );
    }

    @ExportedFunction
    public pitemUpdated(pitemId: string, type: string, data: any) {
        // notifiled by the project manager that changed data
        // is type usefu? only src update are available
        // update works for the current view of correction suggestion

    }

    /**
     * Handle debugging rooms of the collaborative debugging session
     */

    private createDebuggingRoom () {

    }

    private joinDebuggingRoom () {

    }

    private deleteDebuggingRoom () {

    }

    private renameDebuggingRoom () {

    }

    /**
     * Handle debugging rooms of the collaborative debugging session
     */

    private createCorrectionSuggestion () {

    }

    private deleteCorrectionSuggestion () {

    }

    private updateCorrectionSuggestion () {

    }

    // functions for IDE UI components
    public registerEvents(): void { throw new Error("Method not implemented."); }
    public update(): void { throw new Error("Method not implemented."); }
    public onOpen(): void { throw new Error("Method not implemented."); }
    public onClose(): void { throw new Error("Method not implemented."); }
    public destroy(): void { throw new Error("Method not implemented."); }
}
