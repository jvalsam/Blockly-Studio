import { PeerCommunication } from "./peer-communication";


export class CollaborativeDebuggingComponent {
    
    constructor(memberInfo, plugin) {
        this.plugin = plugin;
        this.masterInfo = memberInfo;
        this.peerCommunication = PeerCommunication(memberInfo, settings, this);

        this.debuggingRooms = [];
        this.correctionSuggestions = {};
    }

    onMemberJoin(memberInfo) {

    }

    onMemberExit(memberInfo) {

    }

    getPItemCorrectionSuggestionData(pitemId) {
        return this.correctionSuggestions[pitemId].getCurrentEditorsData();
    }

    onChangePItem(pitemId, data) {
        
    }
}
