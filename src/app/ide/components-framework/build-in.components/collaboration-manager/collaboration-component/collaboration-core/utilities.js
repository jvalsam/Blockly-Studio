import { collabInfo } from './utilities';

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


export function collaborationFilter(projectObj, myInfo, settings){
    if (!settings.sharedPItems) {
        settings.sharedPItems = projectObj.projectItems.map(x=>x.systemID);
    }

    collabInfo.myInfo = myInfo;
    var tempCollabData = {
        members: [myInfo]
    }
    projectObj.collaborationData = tempCollabData;
    
    // pin privileges per pitem
    projectObj.projectItems.forEach(pitem => {
        pitem.componentsData = pitem.coponentsData ? pitem.coponentsData : {};
        pitem.componentsData.collaborationData = {};
        pitem.componentsData.collaborationData.privileges = {};
        pitem.componentsData.collaborationData.privileges.author = collabInfo.myInfo.name;
        pitem.componentsData.collaborationData.privileges.owner = collabInfo.myInfo.name;
        pitem.componentsData.collaborationData.privileges.shared = {};
        // TODO: add info for settings hidden field
        pitem.componentsData.collaborationData.privileges.shared.type = settings.sharedPItems.indexOf(pitem.systemID) > -1
            ? "SHARED_PROJECT"
            : "NOT_SHARED";
        pitem.componentsData.collaborationData.privileges.shared.readOnly = false;
    });

    collabInfo.plugin.setProject (projectObj);

    return projectObj;
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
    let DB = collabInfo.plugin.getProject();
	console.log(DB);
}

function broadcastChange(info){
	//TODO:
}