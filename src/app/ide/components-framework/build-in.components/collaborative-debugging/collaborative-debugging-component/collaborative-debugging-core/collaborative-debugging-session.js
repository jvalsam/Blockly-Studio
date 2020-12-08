import { PeerCommunication } from "./peer-communication";
import {
    CorrectionSuggestionsManager
} from "./correction-suggestions-manager";


export function CollaborativeDebuggingComponent (
    memberInfo,
    isMaster,
    plugin,
    project
) {
    this.plugin = plugin;
    this.memberInfo = memberInfo;
    this.isMaster = isMaster;

    this.peerCommunication = new PeerCommunication(memberInfo, settings, this);
    
    if (this.isMaster) {
        this.debuggingRooms = new DebuggingRoomsManager();
        this.correctionSuggestionsManager = new CorrectionSuggestionsManager(
            project,
            this);
        this.peerCommunication.initialize();
    }
    else {
        this.peerCommunication.startCommunicationUser(
            memberInfo,
            project);
    }

    // 
    this.sendSessionData = (user, data) => {
        this.peerCommunication.sendToUser(
            user,
            {
                project: project,
                CollaborativeDebugging: {
                    correctionSuggestions: "",
                    debuggingRooms: ""
                    // userActions: 
                }
            }
        );
    };

    this.loadSessionData = (data) => {
        
    }


    //
    this.onMemberJoin = (memberInfo) => {

    }

    this.onMemberExit = (memberInfo) => {

    }

    this.getPItemCorrectionSuggestionData = (pitemId) => {
        return this.correctionSuggestions[pitemId].getCurrentEditorsData();
    }

    this.onChangePItem = (pitemId, data) => {
        this.correctionSuggestions[pitemId].onChangeEditorData(data);
    }

    /**
     * peer communicate updates on correction suggestions 
     */
    this.correctionSuggestionUpdated = (pitemId, type, data) => {
        this.peerCommunication.sendToAll({
            receiver: "onCorrectionSuggestionUpdated",
            args: [
                pitemId,
                type,
                data
            ]});
    };
    this.onCorrectionSuggestionUpdated = (pitemId, type, data) => {
        this.correctionSuggestions[pitemId].onReceiveUpdate(type, data);
    };

    /**
     * Send and receive all messages from these two functions for other peers
     */
    this.receiveFunctionRequest = (data, conn) => {
        if (data.compName === CollaborativeDebuggingComponent.name) {
            this[data.funcName] (data, conn);
        }
        else {
            this[data.compName][data.funcName] (data, conn);
        }
    }

    this.sendFunctionRequest = (destComp, funcName, data) => {
        this.peerCommunication.sendToAll({
            compName: destComp,
            funcName: funcName,
            args: data
        });
    }
}
