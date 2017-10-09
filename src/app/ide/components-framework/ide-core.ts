import { ComponentCommunicationElement } from './component/component-communication-element';
/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * June 2017
 */

import { ComponentsBridge } from "./component/components-bridge";
import { ComponentLoader } from "./component/component-loader";
import {
  FunctionsHolder,
  RequiredFunctionsHolder,
  SignalListenersHolder,
  SignalsHolder
} from "./holders";
import { ComponentRegistry } from "./component/component-registry";
import { ComponentsCommunication } from "./component/components-communication";
import { Shell } from "./common.components/shell/shell";
import { StartPageComponent } from "./build-in.components/start-page/start-page";

// var Blockly = require("../../../../node_modules/node-blockly/browser");

// var editor: any;
// var code: any;

export class IDECore {
  public static initialize(): void {

    SignalsHolder.initialize();
    SignalListenersHolder.initialize();
    FunctionsHolder.initialize();
    RequiredFunctionsHolder.initialize();
    ComponentLoader.initialize();

    ComponentRegistry.initialize();
    ComponentsBridge.initialize();
    ComponentsCommunication.initialize();
  }

  // public static updateCode() {
  //   document.getElementById("js").innerText = Blockly.JavaScript.workspaceToCode(editor);
  //   document.getElementById("php").innerText = Blockly.PHP.workspaceToCode(editor);
  //   document.getElementById("lua").innerText = Blockly.Lua.workspaceToCode(editor);
  //   document.getElementById("dart").innerText = Blockly.Dart.workspaceToCode(editor);
  //   document.getElementById("python").innerText = Blockly.Python.workspaceToCode(editor);
  // }

  // public static render(element, toolbox) {
  //   if(editor) {
  //     editor.removeChangeListener(IDECore.updateCode);
  //     code = Blockly.Xml.workspaceToDom(editor);
  //     editor.dispose();
  //   }

  //   editor = Blockly.inject(element, {
  //     toolbox: document.getElementById(toolbox)
  //   });

  //   Blockly.Xml.domToWorkspace(code, editor);

  //   editor.addChangeListener(IDECore.updateCode);

  //   return editor;
  // }

  public static start(): void {
    var shell: Shell = <Shell>ComponentRegistry.getComponentEntry("Shell").create();
    shell.initialize();
    var startpage: StartPageComponent = <StartPageComponent>ComponentRegistry.getComponentEntry("StartPageComponent").create();
    startpage.initialize();
    shell.openComponent(startpage);
    shell.show();

    // code = document.getElementById("startBlocks");
    // editor = IDECore.render("blocklyDiv", "toolbox");
    // IDECore.updateCode();
  }

}