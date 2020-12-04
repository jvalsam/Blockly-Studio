import { PeerCommunication } from "./peer-communication";


export function CollaborativeDebuggingComponent (
    memberInfo,
    project,
    isMaster,
    plugin,
) {
    this.plugin = plugin;
    this.memberInfo = memberInfo;
    this.isMaster = isMaster;

    this.peerCommunication = new PeerCommunication(memberInfo, settings, this);
    
    this.debuggingRooms = [];
    // each pitem has correction suggestions handling
    this.projectItemsCSH = {};

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
}
