"use strict";

// import * as $ from 'jquery';
import { IDECore } from "./src/app/ide/components-framework/ide-core";


$(document).ready(function(){
       IDECore.initialize();
       IDECore.start();
});
