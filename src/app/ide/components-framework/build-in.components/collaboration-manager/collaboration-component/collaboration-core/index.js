import Peer from "peerjs";
import {
  generateRandom,
  receiveRegisterUser,
  receiveRemoveUser,
  receivePItemAdded,
  receivePItemRemoved,
  receivePItemUpdated
}
from './utilities.js';

export function communicationInitialize() {
  var receivedHandler = {
    "registerUser": receiveRegisterUser ,
    "removeUser": receiveRemoveUser ,
    "addPItem": receivePItemAdded ,
    "removePItem": receivePItemRemoved ,
    "updatePItem": receivePItemUpdated
  };

  var connected_users = [];

  var randomId = generateRandom(20);
  var peer = new Peer(randomId);
  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
  });

  peer.on('connection', function (conn) {
    console.log('connected ' + conn.id);

    conn.on('open', function () {
        connected_users.push(conn);
        console.log(connected_users);
        console.log("connection is open");
        conn.on('data', function (data) { 
          receivedHandler[data.type](data);
        });
    });

    conn.on('close', function () {
        //receiveRemoveUser(conn,DB);
    });
  });
}