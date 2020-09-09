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
  let randomId = generateRandom(20);
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
  externalLink = "akatsarakis12341";
  console.log(myInfo,"trying to connect to "+ externalLink);
  let peer = new Peer();//({key: 'lwjd5qra8257b9'});
  peer.on('error', (err) => console.log(err));
  let conn = peer.connect(externalLink);
  console.log(peer);
  conn.on('open', (id) => {
    console.log('connected',id);
    conn.on('data', (data) => {
      console.log(data);
      receivedHandler[data.type](data,peer);
    });
    //sendRegister
    let arg = {
      type: "registerUser",
      info: myInfo
    };
    conn.send(arg);
  });
  
}