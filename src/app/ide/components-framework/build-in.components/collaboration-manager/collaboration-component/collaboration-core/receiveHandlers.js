import {
    getPItem,
    updateProject,
    pItemExists,
    pItemAdd,
    pItemRemove
}from "./giannis.js"

import {
    collabInfo,
    printDB
}from "./utilities.js"

import {
    filterProjectItem
}from "./projectItemFilters"

//Communication between users on collab level





//Receive functions
export function receiveRegisterUser(data,conn){
    let DB = collabInfo.plugin.getProject();
    let info = data.info;
	for(let item in DB.collaborationData.members){
		item = DB.collaborationData.members[item];
		if(item.name === info.name){
			console.log("THIS USERNAME ALREADY EXIST") //TODO: this
			return;
		}
    }
    acceptUser(conn,info);
	printDB();
}

export function receiveRemoveUser(data,conn){
    let DB = collabInfo.plugin.getProject();
	var info = data.info;
	var position = 0;
	for(var item in DB.collaborationData.members){
		item = DB.collaborationData.members[item];
		if(item.name === info.name){
            DB.collaborationData.members.splice(position, 1);
			printDB();
			return;
		}
		position++;
	}
	console.log("THIS USERNAME DOESNT EXIST"); //TODO: this
}

export function receivePItemAdded(data,conn){
    // ADD THE PITEM TO DATABASE
    let DB = collabInfo.plugin.getProject();
    DB.projectItems.push(filterProjectItem(data.info));
    collabInfo.connected_users.forEach(user => {
        if(user.id !== conn.id){
            sendPItemAdded(data.info,user);
        }
    });
	printDB();
}

export function receivePItemRemoved(data,conn){
    if(!pItemExists(data.info.systemID)){
        console.log("THIS PROJECT ITEM DOESNT EXIST"); //TODO: this
        return;
    }
    if(!pItemRemove(data.info.systemID)){
        console.log("THIS PROJECT ITEM WASN'T REMOVED SUCCESSFULLY"); //TODO: this
        return;
    }
    collabInfo.connected_users.forEach(user => {
        if(user.id !== conn.id){
            sendPItemRemoved(data.info,user);
        }
    });
    printDB();
}

export function receivePItemUpdated(data,conn){
    if(!pItemExists(data.pItemId)){
        console.log("THIS PROJECT ITEM DOESNT EXIST"); //TODO: this
        return;
    }
	var info = data.info;
	var updateType = data.updateType;
    var pItemId = data.pItemId;
    console.log(data);
    let DB = collabInfo.plugin.getProject();
	for(var item in DB.projectItems){
        item = DB.projectItems[item];
		if(item.systemID === pItemId){
            pItemUpdateHandler[updateType](item,info);
            collabInfo.connected_users.forEach(user => {
                if(user.id !== conn.id){
                    sendPItemUpdated(info,updateType,pItemId, user);
                }
            });
			printDB();
			return;
		}
	}
}


export function receiveAddUser(data,conn){
    let DB = collabInfo.plugin.getProject();
    DB.collaborationData.members.push(data.info);
    printDB();
}

function acceptUser(conn,infom){
    let DB = collabInfo.plugin.getProject();

    let arg = {
        type: "addUser",
        info: {
            name: infom.name,
            icon: infom.icon
        }
    };
    collabInfo.connected_users.forEach(user => {
        user.send(arg);
    });

    conn.name = infom.name;
    collabInfo.connected_users.push(conn);
	DB.collaborationData.members.push({
        name: infom.name,
        icon: infom.icon
    });
    arg = {
        type: "acceptedUser",
        info: DB
    };
    conn.send(arg);
    
}




var pItemUpdateHandler = {
	"passOwnership": pItemPassOwnership,
	"changeSharedStatus": pItemChangeSharedStatus,
	"changeRenderParts": pItemChangeRenderParts
}

function pItemPassOwnership(pItem,info){
	//TODO: checks if he can invoke this
	pItem.privileges.owner = info;
}

function pItemChangeSharedStatus(pItem,info){
	//TODO: checks if he can invoke this
	pItem.privileges.shared = info;
}

function pItemChangeRenderParts(pItem,info){
	//TODO: checks if he can invoke this
	pItem.renderParts = info;
}

//Sender functions
function sendPItemAdded(data,conn){
    let arg = {
        type: "addPItem",
        info: data
    };
    conn.send(arg);
}

function sendPItemRemoved(data,conn){
    let arg = {
        type: "removePItem",
        info: data
    };
    conn.send(arg);
}

function sendPItemUpdated(data,updateType, pItemId, conn){
    let arg = {
        type: "updatePItem",
        updateType: updateType,
        pItemId: pItemId,
        info: data
    };
    conn.send(arg);
}