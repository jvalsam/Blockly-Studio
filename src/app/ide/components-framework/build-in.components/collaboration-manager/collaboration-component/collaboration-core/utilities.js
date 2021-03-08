import { collabInfo } from './utilities';

export let collabInfo = {
    /*myInfo = {
        name: "myName",
        icon: "myIcon"
    },
    plugin:,*/
    connected_users: [],
}

export function generateRandom(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

export function filterPItem(pitem,itsMine){
    pitem.componentsData = pitem.componentsData ? pitem.componentsData : {};
    if(itsMine){
        pitem.componentsData.collaborationData = {};
        pitem.componentsData.collaborationData.privileges = {};
        pitem.componentsData.collaborationData.privileges.author = collabInfo.myInfo.name;
        pitem.componentsData.collaborationData.privileges.owner = collabInfo.myInfo.name;
        pitem.componentsData.collaborationData.privileges.shared = {};
        pitem.componentsData.collaborationData.privileges.shared.type = "SHARED_PROJECT";
        pitem.componentsData.collaborationData.privileges.shared.readOnly = false;
        pitem.privileges = "EDITING";
    }else{
        pitem.privileges = "READ_ONLY";
    }
}

export function collaborationFilter(projectObj, myInfo, settings){
    if (!settings.sharedPItems) {
        settings.sharedPItems = projectObj.projectItems.map(x=>x.systemID);
    }

    collabInfo.myInfo = myInfo;
    var tempCollabData = {
        members: [myInfo],
        //
        projectInfo: {
            createPItem: true,
            makeNotes: true,
            reqOwnership: true,
            createPersonalPItem: true,
            sharePersonalProjectItem: true
        }
        //
    }

    //projectObj.componentsData = projectObj.componentsData ? projectObj.componentsData : {};
    //projectObj.componentsData.collabInfo = tempCollabData;
    let collabData = collabInfo.plugin.getComponentData(projectObj._id);
    collabData = tempCollabData;
    collabInfo.plugin.saveComponentData(collabData,projectObj._id);
    // pin privileges per pitem
    projectObj.projectItems.forEach(pitem => {
        pitem.componentsData = pitem.componentsData ? pitem.componentsData : {};
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
        pitem.privileges = "EDITING";
    });

    collabInfo.plugin.setProject (projectObj);

    return projectObj;
}

export function printDB(){
    let DB = collabInfo.plugin.getProject();
	console.log(DB);
}

export function handleSaveSuggestion(data){
    let pitem = collabInfo.plugin.getPItem(data.systemID);
    if(!pitem.componentsData.collaborationData.suggestions)
        pitem.componentsData.collaborationData.suggestions = [];
    
    if(!data.suggestionID)data.suggestionID = generateRandom(20);
    pitem.componentsData.collaborationData.suggestions[data.suggestionID] = data;

    collabInfo.plugin.logAction(
        {
            type: "addSuggestion", 
            user: collabInfo.myInfo, 
            pitemID: data.systemID,
            suggestionID: data.suggestionID
        });
}

// export function handleRemoveSuggestion(data){
//     let pitem = collabInfo.plugin.getPItem(data.systemID);
//     if(!pitem.componentsData.collaborationData.suggestions)
//         pitem.componentsData.collaborationData.suggestions = [];
    
//     if(!data.suggestionID)data.suggestionID = generateRandom(20);
//     pitem.componentsData.collaborationData.suggestions[data.suggestionID] = data;
//     return data.suggestionID;
// }