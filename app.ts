"use strict";

// import * as $ from 'jquery';
import { IDECore } from "./src/app/ide/components-framework/ide-core";
// import { Application } from "./src/app/ide/shared/application";

// var iotJSON = require("./src/app/ide/ide-components/iot/defs/myapplication-iot.json");


// function login(): void {
//     let email, password;
//     $("#submit").click(function () {
//         email = $("#email").val();
//         password = $("#password").val();
//         $.post(
//             "http://localhost:3000/login",
//             { email: email, pass: password },
//             function (data: any): void {
//                 if (data === 'done') {
//                     IDECore.start();
//                 }
//             }
//         );
//     });
// }

$(document).ready(function() {
    IDECore.initialize();
    IDECore.start();
});
