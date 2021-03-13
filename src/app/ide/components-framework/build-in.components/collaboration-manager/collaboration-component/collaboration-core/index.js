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
  receiveAddSuggestion,
  receiveAcceptSuggestion,
  receiveDenySuggestion
} from "./receiveHandlers.js"

export function communicationInitialize(myInfo, settings, CollabManager) {
  let receivedHandler = {
    "registerUser": receiveRegisterUser ,
    "removeUser": receiveRemoveUser ,
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser,
    "addSuggestion": receiveAddSuggestion,
    "acceptSuggestion": receiveAcceptSuggestion,
    "denySuggestion": receiveDenySuggestion
  };
  console.log("myInfo:",myInfo);
  collabInfo.plugin = CollabManager;
  collabInfo.myInfo = myInfo;
  collabInfo.UI = CollabManager.getCollabUI();
  // console.log(collabInfo.plugin.shProject);
  console.log(collabInfo.UI);
  let randomId = generateRandom(20);
  let peer = new Peer(randomId, {
    host: '147.52.17.129',
    port: 9000,
    path: '/myapp'
  });
  // var peer = new Peer(randomId);
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    collabInfo.UI.addMemberMe(myInfo);
  });
  console.log(collabInfo.plugin);
  collabInfo.invitationCode = randomId;
  peer.on('connection', (conn) => {
    console.log('connected ' + conn.id);

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
    "addSuggestion": receiveAddSuggestion,
    "acceptSuggestion": receiveAcceptSuggestion,
    "denySuggestion": receiveDenySuggestion
  };
  collabInfo.plugin = CollabManager;
  collabInfo.myInfo = myInfo;
  var peer = new Peer(generateRandom(20),{
    host: '147.52.17.129',
    port: 9000,
    path: '/myapp'
  });
  // var peer = new Peer();
  peer.on('error', function(err) { console.log(err); });
  console.log(myInfo,"trying to connect to "+externalLink);
  peer.on('open', function (id) {
    conn.on('open', function () {

      console.log('connected',id);
      conn.on('data', function (data) {
        console.log(data);
        receivedHandler[data.type](data,conn);
      });
      
      //sendRegister
      setTimeout(()=>{
        if(conn.open === false)debugger;
        var arg = {
          type: "registerUser",
          info: myInfo
        };
        conn.send(arg);
        console.log("Sent register");
      },1000)
    });
  });
  var conn = peer.connect(externalLink);
  
  return conn;
  
}