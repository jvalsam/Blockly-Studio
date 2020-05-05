import {
    getProject,
    getPItem,
    updateProject,
    pItemExists
}from "./giannis.js"


export let collabInfo = {
    /*myInfo = {
        name: "myName",
        icon: "myIcon"
    }*/
    connected_users: [],
}

export function generateRandom(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


export function initialiseProject(myInfo,settings){
    var DB = getProject();
    collabInfo.myInfo = myInfo;
    var tempCollabData = {
        members: [myInfo]
    }
    DB.collaborationData = tempCollabData;

    

}

var currentPItemsPriviledges = {
    "pItemId1": {
        "Options": ["priv1", "priv2"],
        "Tools": ["x","y","z"]
    },
    "pItemId2": {
        "Options": ["priv1", "priv3"],
        "Tools": ["x","y"]
    }
}

function pItemOptions(pItemId){
    var temp = currentPItemsPriviledges[pItemId1].Options;
    //filter temp
    return temp;
}

function pItemTools(pItemId){
    var temp = currentPItemsPriviledges[pItemId1].Tools;
    //filter temp
    return temp;
}








export function printDB(){
    let DB = getProject();
	console.log(DB);
}

function broadcastChange(info){
	//TODO:
}