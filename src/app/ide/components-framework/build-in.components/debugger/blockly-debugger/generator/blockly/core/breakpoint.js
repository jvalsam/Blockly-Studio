import {Blockly_Debugger, Debuggee_Worker} from '../../../debugger/debugger.js';


export var Breakpoint_Icon = function(block) {
    Blockly.Icon.call(this, block);
    this.createIcon();
  };

  Breakpoint_Icon.prototype = Object.create(Blockly.Icon.prototype);
  Breakpoint_Icon.prototype.width_ = 160;
  Breakpoint_Icon.prototype.height_ = 80;

  Breakpoint_Icon.prototype.drawIcon_ = function(group) {
    Blockly.utils.createSvgElement('circle',
        {'class': 'breakpoint_enable', 'id' : this.block_.id, 'r': '6', 'cx': '8', 'cy': '8'},
        group); 
        
  }


  Breakpoint_Icon.prototype.setVisible = function (visible){
    var isEnable = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{if(obj.block_id==this.block_.id) return obj.enable;});
    console.log(isEnable);
    if(isEnable[0]){
      Blockly_Debugger.actions["Breakpoint"].disable(this.block_.id);
    }else {
      this.myDisable();
      var index = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{return obj.block_id;}).indexOf(this.block_.id);
      if (index !== -1) Blockly_Debugger.actions["Breakpoint"].breakpoints.splice(index, 1);
    }
}
  
Breakpoint_Icon.prototype.myDisable = function (){
  goog.dom.removeNode(this.iconGroup_);  
  this.iconGroup_=null;
}


// ---------------------------------------------------------------------     

Blockly.utils.createSvgElement=function(a,b,c){
  a=document.createElementNS(Blockly.SVG_NS,a);
  for(var d in b)a.setAttribute(d,b[d]);
  document.body.runtimeStyle&&(a.runtimeStyle=a.currentStyle=a.style);
  c&&c.appendChild(a);
  return a;
}
