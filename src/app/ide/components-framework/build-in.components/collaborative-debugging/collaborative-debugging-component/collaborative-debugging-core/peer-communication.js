import { settings } from "cluster";

var CollabDebugSession = null;

export function PeerCommunication (
    memberInfo,
    settings,
    collabDebugComp
) {
    this.collabDebugComp = collabDebugComp;
    this.users = [];
    this.collaborativeDebuggingSession = collabDebugSession;
    this.url = ""; // TODO: use the library peerjs

    this.startCommunicationUser = (
        myInfo,
        externalLink,
        CollabManager,
        loadProject,
        cbUI) => {

    };

    //
    this.sendToUser = (user, data) => {
        // TODO: send the message
    };
    this.sendToAll = (data) => {
        this.users.forEach(user => this.sendToUser(user, data));
    };

    //
    this.receive = (msg) => {
        this.collabDebugComp[msg.receiver](...msg.args);
    };

}