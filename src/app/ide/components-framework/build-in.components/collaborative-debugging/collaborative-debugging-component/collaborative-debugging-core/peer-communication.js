
var CollabDebugSession = null;

export class PeerCommunication {
    constructor(memberInfo, settings, collabDebugSession) {
        this.collaborativeDebuggingSession = collabDebugSession;
        this.url = ""; // TODO: use the library peerjs
    }
    
    startCommunicationUser (myInfo, externalLink, CollabManager, loadProject, cbUI) {
        
    }
}
