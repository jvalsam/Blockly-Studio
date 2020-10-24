"use strict";

import { RunPlatformData } from './src/app/ide/shared/data';
import { IDECore } from "./src/app/ide/components-framework/ide-core";

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

// debug changed command is: node --inspect=0.0.0.0:9229 --inspect-brk server.js

$(document).ready(function() {
    RunPlatformData.initialize("release");
    IDECore.initialize();
    IDECore.start();
});


