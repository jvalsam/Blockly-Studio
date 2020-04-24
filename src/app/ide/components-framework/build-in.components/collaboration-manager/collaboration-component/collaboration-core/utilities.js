export function generateRandom(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


//Communication between users on collab level

export function receiveRegisterUser(data){
	var info = data.info;
	for(var item in DB.collaborationData.members){
		item = DB.collaborationData.members[item];
		if(item.name === info.name){
			console.log("THIS USERNAME ALREADY EXIST") //TODO: this
			return;
		}
	}
	DB.collaborationData.members.push(
		{
			name: info.name,
			icon: info.icon
		}
	)
	printDB();
}

export function receiveRemoveUser(data){
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

export function receivePItemAdded(data){
	DB.projectItems.push(data.info);
	printDB();
}

export function receivePItemRemoved(data){
	var info = data.info;
	var position = 0;
	for(var item in DB.projectItems){
		item = DB.projectItems[item];
		if(item.systemID === info.systemID){
			DB.projectItems.splice(position, 1);
			printDB();
			return;
		}
		position++;
	}
	console.log("THIS PROJECT ITEM DOESNT EXIST"); //TODO: this
}

export function receivePItemUpdated(data){
	var info = data.info;
	var updateType = data.updateType;
	var pItemId = data.pItemId;
	for(var item in DB.projectItems){
		item = DB.projectItems[item];
		if(item.systemID === pItemId){
			pItemUpdateHandler[updateType](item,info);
			printDB();
			return;
		}
	}
	console.log("THIS PROJECT ITEM DOESNT EXIST"); //TODO: this
}


//Events to be done after an action on IDE

function startSession(selDialogObj,projectObj,selCompObj,cb){
    //BuildDialogObj ...agapakis
    //if successfull agapakis inform me...
    //and agapakis call my callback
    for(item in projectObj.projectItems){
        //Initialise
        var priv = projectObj.projectItems[item].priviliges;
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

function pItemAdded(pItem){
    var arg = {
        type: "addPItem",
        info: pItem
    };
    //Send either to master or broadcast if I am the master
}

function pItemUpdate(pItem, updateType, data){
    var arg = {
        type: "updatePItem",
        updateType: updateType,
        pItemId: pItem,
        info: data
    };
    //Send either to master or broadcast if I am the master
}

function pItemRemove(pItem){
    var arg = {
        type: "removePItem",
        info: pItem
    };
    //Send either to master or broadcast if I am the master
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







var pItemUpdateHandler = {
	"passOwnership": pItemPassOwnership,
	"changeSharedStatus": pItemChangeSharedStatus,
	"changeRenderParts": pItemChangeRenderParts
}

function pItemPassOwnership(pItem,info){
	//TODO: checks if he can invoke this
	pItem.priviliges.owner = info;
}

function pItemChangeSharedStatus(pItem,info){
	//TODO: checks if he can invoke this
	pItem.priviliges.shared = info;
}

function pItemChangeRenderParts(pItem,info){
	//TODO: checks if he can invoke this
	pItem.renderParts = info;
}

/*var DB = {
  author: {
      _id: "5ac8e06dac135912cc2314ac",
      username: "alex"
  },
  systemIDs: 2,
  projectItems: [ 
      {
          renderParts : [ 
              {
                  _id : "5e8e414b1ac1a02720c7682a",
                  type : "img",
                  value : {
                      fa : "fa fa-tablet"
                  }
              }, 
              {
                  _id : "5e8e414b1ac1a02720c76829",
                  type : "title",
                  value : {
                      text : "Blockly Task 16"
                  }
              }, 
              {
                  _id : "5e8e414b1ac1a02720c76828",
                  type : "colour",
                  value : {
                      colour : "#DAD9D9"
                  }
              }
          ],
          systemID : "5e8278e38d8bb7792f314fa0_17",
          priviliges: {
              author: "memberInfo",
              owner: "memberInfo",
              shared: {
                  type: "NOT_SHARED | SHARED_PROJECT | SHARED_PERSONAL",
                  members: [
                      "has memberInfo items in case type is SHARED_PERSONAL"
                  ]
              },
              hidden: "based_on_collab_settings"
          },
          parent : "jstree_BlocklyTasks",
          orderNO : 1,
          type : "pi-blockly-task"
      }
  ],
  domainElements: [],
  collaborationData: {
      members: [
          {
              name: "alex",
              icon: "..."
          }
      ],
      whatMore: "whatMore"
  },
  title: "First App",
  description: "This is first application with only start task empy.",
  domainType: "SimpleTasks",
  created: "2019-01-01T00:00:00.000Z",
  lastModified: "2019-01-01T00:00:00.000Z"
};*/

function printDB(){
	console.log(DB);
}

function broadcastChange(info){
	//TODO:
}

export function collaborationFilter(project, memberInfo, settings) {
    return project;
}