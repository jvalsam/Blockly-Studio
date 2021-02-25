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
    let info = data.info;
    let members = collabInfo.plugin.getComponentData().members;
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
    let compData = collabInfo.plugin.getComponentData();
    compData.members.push(data.info);
    collabInfo.plugin.saveComponentData(compData);
    collabInfo.UI.addMember(data.info);
    printDB();
}

export function receiveRemoveUser(data,conn){
	var info = data.info;
    var position = 0;
    let compData = collabInfo.plugin.getComponentData();
	for(var item in compData.members){
		item = compData.members[item];
		if(item.name === info.name){
            compData.members.splice(position, 1);
            collabInfo.plugin.saveComponentData(compData);
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

	let info = data.info;
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
    
    let toUpdate = collabInfo.plugin.getComponentData();
	toUpdate.members.push({
        name: infom.name,
        icon: infom.icon
    });
    collabInfo.plugin.saveComponentData(toUpdate);

    arg = {
        type: "acceptedUser",
        info: DB
    };
    collabInfo.UI.addMember({
        name: infom.name,
        icon: infom.icon
    });
    conn.send(arg);
    
}

var pItemUpdateHandler = {
    "rename" : pItemRename,
	"ownership": pItemPassOwnership,
	"changeSharedStatus": pItemChangeSharedStatus,
	"changeRenderParts": pItemChangeRenderParts
}

function pItemRename(pItem,info){
    console.log("Rename ",pItem);
    console.log(info);
    collabInfo.plugin.onPItemUpdate(pItem.systemID,"rename",info,()=>{});
}

function pItemPassOwnership(pItem,info){
    let collabData = pItem.componentsData.collaborationData;
    collabData.privileges.owner = info;
    if(info !== collabInfo.myInfo.name){
        collabData.privileges.shared.readOnly = true;
        pItem.privileges = "READ_ONLY";
    }else{
        collabData.privileges.shared.readOnly = false;
        pItem.privileges = "EDITING";
    }
    collabInfo.plugin.onPItemUpdate(pItem.systemID,"ownership",info,()=>{});
}

function pItemChangeSharedStatus(pItem,info){
    
	pItem.privileges.shared = info;
}

function pItemChangeRenderParts(pItem,info){
    
	pItem.renderParts = info;
}
