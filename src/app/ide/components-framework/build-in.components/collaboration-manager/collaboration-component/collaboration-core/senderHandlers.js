import {
    collabInfo
}from "./utilities.js"

export function sendPItemAdded(pItem,conn){
    console.log("Sending:",pItem);
    var arg = {
        type: "addPItem",
        info: pItem
    };

    collabInfo.plugin.logAction({type: "createPItem", user: collabInfo.myInfo, pitemID: pItem.itemData.id});
    if(!conn)sendToAll(arg);
    else conn.send(arg);
}

export function sendPItemRemoved(pItem,conn){
    var arg = {
        type: "removePItem",
        info: pItem
    };
    collabInfo.plugin.logAction({type: "removePItem", user: collabInfo.myInfo, pitemID: pItem});
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