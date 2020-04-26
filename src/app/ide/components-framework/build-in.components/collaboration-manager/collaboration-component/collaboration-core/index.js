import Peer from "peerjs"

import {
  collabInfo,
  generateRandom,
  initialiseProject
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

export function communicationInitialize(myInfo) {
  var receivedHandler = {
    "registerUser": receiveRegisterUser ,
    "removeUser": receiveRemoveUser ,
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser
  };

  initialiseProject(myInfo);

  var randomId = "Alexkatsarakis123";//generateRandom(20);
  var peer = new Peer(randomId);
  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
  });

  peer.on('connection', function (conn) {
    console.log('connected ' + conn.id);

    conn.on('open', function () {
        conn.on('data', function (data) { 
          receivedHandler[data.type](data,conn);
        });
    });

    conn.on('close', function () {
        //receiveRemoveUser(conn,DB);
    });
  });
}

function acceptedUser(DB){
  collabInfo.connected_users.push(conn);
  updateProject(DB.info);
}

export function startCommunicationUser(myInfo, externalLink) {
  var receivedHandler = {
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated ,
    "addUser": receiveAddUser,
    "acceptedUser": acceptedUser
  };
  collabInfo.myInfo = myInfo;
  var peer = new Peer({key: 'lwjd5qra8257b9'});
  console.log(myInfo,"tring to connect to "+externalLink);
  var conn = peer.connect(externalLink);
  conn.on('open', function () {
    console.log('connected');
    conn.on('data', function (data) {
        if(data === "print"){
          console.log(data);
          receivedHandler[data.type](data,conn);
        }
    });


    //sendRegister
    var arg = {
      type: "registerUser",
      info: myInfo
    };
    conn.send(arg);

  });

}