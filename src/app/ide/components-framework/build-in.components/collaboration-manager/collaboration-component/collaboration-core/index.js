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
  // console.log(collabInfo.plugin.shProject);
  let randomId = "akatsarakistest123123";//generateRandom(20);
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

function acceptedUser(DB){
  collabInfo.connected_users.push(conn);
  updateProject(DB.info);
}

export function startCommunicationUser(myInfo, externalLink) {
  let receivedHandler = {
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser,
    "acceptedUser": acceptedUser
  };
  collabInfo.myInfo = myInfo;
  let peer = new Peer();//({key: 'lwjd5qra8257b9'});
  console.log(myInfo,"trying to connect to "+ externalLink);
  
  // let conn = peer;  
  peer.on('error', (err) => console.log(err));
  peer.on('open', () => {
    console.log('connected');
    peer.on('data', (data) => {
      console.log(data);
      receivedHandler[data.type](data,peer);
    });
  });
  
  let conn = peer.connect(externalLink);
  //sendRegister
  let arg = {
    type: "registerUser",
    info: myInfo
  };
  conn.send(arg);
}