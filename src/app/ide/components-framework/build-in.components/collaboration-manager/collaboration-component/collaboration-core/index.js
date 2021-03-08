import Peer from "peerjs"

import {
  collabInfo,
  generateRandom,
  filterPItem
}
from './utilities.js';

import {
  receiveRegisterUser,
  receiveRemoveUser,
  receivePItemAdded,
  receivePItemRemoved,
  receivePItemUpdated,
  receiveAddUser,
  receiveAddSuggestion
} from "./receiveHandlers.js"

export function communicationInitialize(myInfo, settings, CollabManager) {
  let receivedHandler = {
    "registerUser": receiveRegisterUser ,
    "removeUser": receiveRemoveUser ,
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser,
    "addSuggestion": receiveAddSuggestion
  };
  console.log("myInfo:",myInfo);
  collabInfo.plugin = CollabManager;
  collabInfo.myInfo = myInfo;
  collabInfo.UI = CollabManager.getCollabUI();
  // console.log(collabInfo.plugin.shProject);
  console.log(collabInfo.UI);
  let randomId = generateRandom(20);
  // let peer = new Peer(randomId, {
  //   host: '147.52.17.129',
  //   port: 9000,
  //   path: '/myapp'
  // });
  var peer = new Peer(randomId);
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    collabInfo.UI.addMemberMe(myInfo);
  });
  console.log(collabInfo.plugin);
  collabInfo.invitationCode = randomId;
  peer.on('connection', (conn) => {
    console.log('connected ' + conn);

    conn.on('open', () => {
        conn.on('data', (data) => { 
          console.log(data);
          receivedHandler[data.type](data,conn);
        });
    });
    
    conn.on('close', () => {
        //receiveRemoveUser(conn,DB);
    });
  });

  peer.on('error', function(err) { console.log(err); });

}


export function startCommunicationUser(myInfo, externalLink, CollabManager, loadProject, cbUI) {
  function acceptedUser(DB){
    collabInfo.invitationCode = externalLink;
    collabInfo.connected_users.push(conn);
    console.log(DB.info);
    DB.info.projectItems.forEach(item => filterPItem(item,false));
    console.log(DB.info);
    collabInfo.plugin.setProject(DB.info);
    loadProject(DB.info);
    collabInfo.UI = cbUI()["ui"];
    // console.log(collabInfo.plugin.shProject);
    collabInfo.UI.addMemberMe({
      name:myInfo.name,
      icon:myInfo.icon
    });
    
    collabInfo.plugin.shProject.componentsData.CollaborationManager.members.forEach((item)=>{
      if(item.name !== myInfo.name)
        collabInfo.UI.addMember({
          name: item.name,
          icon: item.icon
        });
    });

  }
  
  let receivedHandler = {
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser,
    "acceptedUser": acceptedUser,
    "addSuggestion": receiveAddSuggestion
  };
  collabInfo.plugin = CollabManager;
  collabInfo.myInfo = myInfo;
  // externalLink = "akatsarakis1234a";
  // var peer = new Peer({
  //   host: '147.52.17.129',
  //   port: 9000,
  //   path: '/myapp'
  // });
  var peer = new Peer();
  peer.on('error', function(err) { console.log(err); });
  console.log(myInfo,"trying to connect to "+externalLink);
  var conn = peer.connect(externalLink);
  conn.on('open', function () {
    console.log('connected');
    conn.on('data', function (data) {
      console.log(data);
      receivedHandler[data.type](data,conn);
    });


    //sendRegister
    var arg = {
      type: "registerUser",
      info: myInfo
    };
    conn.send(arg);
    console.log("Sent register");
  });
  
  return conn;
  
}