import './init_blockly.js';
import '../debugger/debugger.js';
import '../generator/blockly/blockly.js';
import {Blockly_Debugger} from '../debugger/debugger.js';

document.getElementById("ContinueButton").onclick = Blockly_Debugger.actions["Continue"].handler;
document.getElementById("StepInButton").onclick = Blockly_Debugger.actions["StepIn"].handler;
document.getElementById("StepOverButton").onclick = Blockly_Debugger.actions["StepOver"].handler;
document.getElementById("StepParentButton").onclick = Blockly_Debugger.actions["StepParent"].handler;
document.getElementById("StepOutButton").onclick = Blockly_Debugger.actions["StepOut"].handler;
document.getElementById("StopButton").onclick = Blockly_Debugger.actions["Stop"].handler;
document.getElementById("StartButton").onclick = Blockly_Debugger.actions["Start"].handler;

//$("#RunButton").onclick((ev)=> Run(ev));


// if (document.addEventListener) { // IE >= 9; other browsers
//     document.getElementById("val_table").addEventListener('contextmenu', function(e) {
//         alert("You've tried to open context menu"); //here you draw your own menu
//         e.preventDefault();
//     }, false);
// } else { // IE < 9
//     document.getElementById("val_table").attachEvent('oncontextmenu', function() {
//         alert("You've tried to open context menu");
//         window.event.returnValue = false;
//     });
// }

// let menuVisible = false;

// const toggleMenu = command => {
//     var menu = document.getElementById("menu");
//     menu.style.display = command === "show" ? "block" : "none";
//     menuVisible = !menuVisible;
//   };
  
//   const setPosition = (top, left) => {
//     var menu = document.getElementById("menu");
//     menu.style.left = left + 'px';//`${left}px`;
//     menu.style.top = top + 'px';//`${top}px`;
//     toggleMenu('show');
//   };
  
//   window.addEventListener("click", e => {
//     if(menuVisible)toggleMenu("hide");
//   });
  
//   document.getElementById("val_table").addEventListener("contextmenu", e => {
//     e.preventDefault();
//     const origin = {
//       left: e.pageX,
//       top: e.pageY
//     };
//     setPosition( e.pageY, e.pageX);
//     return false;
//   });