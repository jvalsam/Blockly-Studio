import Peer from "peerjs"

import {
  collabInfo,
  generateRandom
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
  let randomId = generateRandom(20);//"akatsarakis1234";//generateRandom(20);
  let peer = new Peer(randomId);
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
  });

  peer.on('error', function(err) { console.log(err); });

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
}


export function startCommunicationUser(myInfo, externalLink, CollabManager, callback) {
  function acceptedUser(DB){
    collabInfo.connected_users.push(conn);
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
  myInfo.name = generateRandom(5);
  myInfo.icon = generateRandom(5);
  collabInfo.myInfo = myInfo;
  externalLink = "akatsarakis1234";
  var peer = new Peer();
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