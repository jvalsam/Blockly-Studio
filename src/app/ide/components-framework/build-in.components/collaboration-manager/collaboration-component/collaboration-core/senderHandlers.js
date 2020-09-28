import { pick } from "lodash";
import {
    collabInfo
}from "./utilities.js"

function fillPItemInfo(pItem){
    delete pItem.privileges;
    pItem.privileges = {};
    var tmpItem = {
        author: collabInfo.myInfo.name,
        owner: collabInfo.myInfo.name,
        shared: {
            type: "SHARED_PROJECT"
        },
        hidden: "false",
        readOnly: false
    }
    pItem.privileges = tmpItem;
    return pItem;
}

export function sendPItemAdded(pItem){
    // pItem = fillPItemInfo(pItem);
    console.log("Sending:",pItem);
    var arg = {
        type: "addPItem",
        info: pItem
    };
    sendToAll(arg);
}

export function sendPItemRemoved(pItem){
    //@ Shouldn't be here since he shared it
    // if(pItem.owner !== collabInfo.myInfo.name && pItem.author !== collabInfo.myInfo.name){
    //     console.log("YOU DONT HAVE PERMITION TO DELETE THAT ITEM");
    //     return;
    // }
    var arg = {
        type: "removePItem",
        info: pItem
    };
    sendToAll(arg);
}

export function pItemUpdate(data){
    var arg = {
        type: "updatePItem",
        updateType: data.updateType,
        pItemId: data.pItemId,
        info: data.info
    };
    sendToAll(arg);
}




function sendToAll(arg){
    collabInfo.connected_users.forEach(user => {
        user.send(arg);
    });
}