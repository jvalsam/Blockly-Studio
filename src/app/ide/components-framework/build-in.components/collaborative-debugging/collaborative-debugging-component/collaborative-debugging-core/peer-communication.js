import {
    generateRandom as generateRandomURL
} from "../../../collaboration-manager/collaboration-component/collaboration-core/utilities";
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
    this.url = "";

    this.initialize = () => {
        this.url = generateRandomURL(20);
        let peer = new Peer();
        peer.on('open', (id) => {
            // TODO: call UI Lib to add member
        });
        
        peer.on('connection', (conn) => {
            conn.on('open', () => {
                conn.on('data', (data) => {
                    this.receiveHandler(data, conn);
                });
            });
            
            conn.on('close', () => {
                
            });
        });
    };

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
    this.receiveHandler = (msg, conn) => {
        this.collabDebugComp[msg.receiver] (msg.args, conn);
    }
}