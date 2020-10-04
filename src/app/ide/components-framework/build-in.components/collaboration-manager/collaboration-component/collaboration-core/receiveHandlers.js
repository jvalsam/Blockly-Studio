import {
    collabInfo,
    printDB
}from "./utilities.js"

import {
    filterProjectItem
}from "./projectItemFilters"

import {
    sendPItemAdded,
    sendPItemRemoved,
    sendPItemUpdated
}from './senderHandlers'



//Receive functions
export function receiveRegisterUser(data,conn){
    let DB = collabInfo.plugin.getProject();
    let info = data.info;
    let members = DB.componentsData.collaborationData.members;
	for(let item in members){
		item = members[item];
		if(item.name === info.name){
			console.log("THIS USERNAME ALREADY EXIST") //TODO: this
			return;
		}
    }
    acceptUser(conn,info);
	printDB();
}

export function receiveAddUser(data,conn){
    let DB = collabInfo.plugin.getProject();
    DB.componentsData.collaborationData.members.push(data.info);
    printDB();
}

export function receiveRemoveUser(data,conn){
    let DB = collabInfo.plugin.getProject();
	var info = data.info;
	var position = 0;
	for(var item in DB.componentsData.collaborationData.members){
		item = DB.componentsData.collaborationData.members[item];
		if(item.name === info.name){
            DB.componentsData.collaborationData.members.splice(position, 1);
			printDB();
			return;
		}
		position++;
	}
	console.log("THIS USERNAME DOESNT EXIST"); //TODO: this
}

export function receivePItemAdded(data,conn){
    collabInfo.plugin.onPitemAdded(data.info);//(filterProjectItem(data.info));
    collabInfo.connected_users.forEach(user => {
        if(user.id !== conn.id){
            sendPItemAdded(data.info,user);
        }
    });
	printDB();
}

export function receivePItemRemoved(data,conn){
    // if(!pItemExists(data.info.systemID)){
    //     console.log("THIS PROJECT ITEM DOESNT EXIST"); //TODO: this
    //     return;
    // }
    collabInfo.plugin.onPitemRemoved(data.info);
    collabInfo.connected_users.forEach(user => {
        if(user.id !== conn.id){
            sendPItemRemoved(data.info,user);
        }
    });
    printDB();
}

export function receivePItemUpdated(data,conn){
    // if(!pItemExists(data.pItemId)){
    //     console.log("THIS PROJECT ITEM DOESNT EXIST"); //TODO: this
    //     return;
    // }

	let info = JSON.parse(data.info);
	let updateType = data.updateType;
    let pItemId = data.pItemId;
    
    let DB = collabInfo.plugin.getProject();
    // DB.projectItems.filter(item => item.systemID === pItemID)
	for(var item in DB.projectItems){
        item = DB.projectItems[item];
		if(item.systemID === pItemId){
            if(pItemUpdateHandler[updateType])pItemUpdateHandler[updateType](item,info); // If it has a specific handler
            else collabInfo.plugin.onPItemUpdate(pItemId,updateType,info,()=>{}); // Else let the IDE handle the event
            collabInfo.connected_users.forEach(user => {
                if(user.id !== conn.id){
                    sendPItemUpdated(pItemId, updateType, info, user.id);
                }
            });
			printDB();
			return;
		}
	}
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
	DB.componentsData.collaborationData.members.push({
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
    "rename" : pItemRename,
	"passOwnership": pItemPassOwnership,
	"changeSharedStatus": pItemChangeSharedStatus,
	"changeRenderParts": pItemChangeRenderParts
}

function pItemRename(pItem,info){
    console.log("Rename ",pItem);
    console.log(info);
    collabInfo.plugin.onPItemUpdate(pItem.systemID,"rename",info,()=>{});
}

function pItemPassOwnership(pItem,info){
    
	pItem.privileges.owner = info;
}

function pItemChangeSharedStatus(pItem,info){
    
	pItem.privileges.shared = info;
}

function pItemChangeRenderParts(pItem,info){
    
	pItem.renderParts = info;
}
