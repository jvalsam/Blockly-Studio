import {
    collabInfo
}from "./utilities.js"

export function sendPItemAdded(pItem,conn){
    console.log("Sending:",pItem);
    var arg = {
        type: "addPItem",
        info: pItem
    };

    if(!conn)sendToAll(arg);
    else conn.send(arg);
}

export function sendPItemRemoved(pItem,conn){
    var arg = {
        type: "removePItem",
        info: pItem
    };
    if(!conn)sendToAll(arg);
    else conn.send(arg);
}

export function sendAddSuggestion(sugg,conn){
    var arg = {
        type: "addSuggestion",
        info: JSON.stringify(sugg)
    };
    if(!conn)sendToAll(arg);
    else conn.send(arg);
}

export function sendAcceptSuggestion(info,conn){
    var arg = {
        type: "acceptSuggestion",
        info: JSON.stringify(info)
    };
    if(!conn)sendToAll(arg);
    else conn.send(arg);
}

export function sendDenySuggestion(info,conn){
    var arg = {
        type: "denySuggestion",
        info: JSON.stringify(info)
    };
    if(!conn)sendToAll(arg);
    else conn.send(arg);
}

export function sendPItemUpdated(pItemId,updateType,info,conn){
    var arg = {
        type: "updatePItem",
        updateType: updateType,
        pItemId: pItemId,
        info: info
    };
    if(!conn)sendToAll(arg);
    else conn.send(arg);
}


function sendToAll(arg){
    collabInfo.connected_users.forEach(user => {
        user.send(arg);
    });
}