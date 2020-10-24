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
  receiveAddUser
} from "./receiveHandlers.js"

export function communicationInitialize(myInfo, settings, CollabManager) {
  let receivedHandler = {
    "registerUser": receiveRegisterUser ,
    "removeUser": receiveRemoveUser ,
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser
  };
  console.log("myInfo:",myInfo);
  collabInfo.plugin = CollabManager;
  collabInfo.myInfo = myInfo;
  // console.log(collabInfo.plugin.shProject);
  console.log(collabInfo.plugin.getCollabUI());
  let randomId = generateRandom(20);
  // let peer = new Peer(randomId, {
  //   host: '147.52.17.129',
  //   port: 9000,
  //   path: '/myapp'
  // });
  var peer = new Peer(randomId);
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);

  });
  
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


export function startCommunicationUser(myInfo, externalLink, CollabManager, callback) {
  function acceptedUser(DB){
    collabInfo.connected_users.push(conn);
    console.log(DB.info);
    DB.info.projectItems.forEach(item => filterPItem(item,false));
    console.log(DB.info);
    collabInfo.plugin.setProject(DB.info);
    callback(DB.info);
  }
  
  let receivedHandler = {
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser,
    "acceptedUser": acceptedUser
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