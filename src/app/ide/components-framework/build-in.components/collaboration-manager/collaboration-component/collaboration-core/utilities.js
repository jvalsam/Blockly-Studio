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


export function initialiseProject(myInfo){
    var DB = getProject();
    collabInfo.myInfo = myInfo;
    var tempCollabData = {
        members: [myInfo]
    }
    DB.collaborationData = tempCollabData;
}


//Events to be done after an action on IDE

function startSession(selDialogObj,projectObj,selCompObj,cb){
    //BuildDialogObj ...agapakis
    //if successfull agapakis inform me...
    //and agapakis call my callback
    for(item in projectObj.projectItems){
        //Initialise
        var priv = projectObj.projectItems[item].privileges;
        priv.author = myName;
        priv.owner = myName;
        priv.shared.type = "SHARED_PROJECT";
        priv.shared.members = [];
    }
    //start the whole session
}

function joinSession(selDialogObj,cb){
    //BuildDialogObj ...agapakis
    //if successfull agapakis inform me...
    /* my callback consist of the following + other new
    var arg = {
        type: "registerUser",
        info: {
          name: "myName",
          icon: "myIcon"
        }
      };
    */
   //cb(project);
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