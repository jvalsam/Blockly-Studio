/**
 * BlocklyVPL - VPL uses jigsaws
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */
import { ComponentsCommunication } from '../../components-framework/component/components-communication';

import {
  IDEUIComponent,
  UIComponentMetadata,
  IViewDataComponent
} from "../../components-framework/component/ide-ui-component";
import {
  ExportedSignal,
  ExportedFunction,
  RequiredFunction,
  ListensSignal
} from "../../components-framework/component/ide-component";

var Blockly = require("../../../../../node_modules/node-blockly/browser");


@UIComponentMetadata({
  description: "VPL uses jigsaws",
  selector: ".blockly-editor-container",
  templateHTML: "blockly.html",
  version: "1.1"
})
export class BlocklyVPL extends IDEUIComponent {
  private editor: any;
  private editorArea: string;
  private changed: boolean;
  private toolbox: any;

  constructor(
    name: string,
    description: string,
    selector: string,
    templateHTML: string
  ) {
    super(name, description, selector, templateHTML);
  }

  @ExportedFunction
  public onOpen() {}

  @RequiredFunction("Shell", "createComponentEmptyContainer")
  @ExportedFunction
  public open(src: string, toolbox: string): void {
    this._view.selector = <string>ComponentsCommunication.functionRequest(
      this.name,
      "Shell",
      "createComponentEmptyContainer",
      [this, ".main-area-container", false]
    ).value;
    this.changed = false;
    this.toolbox = (toolbox === undefined) ? require("./toolbox.xml") : toolbox;
    this.editor = Blockly.inject(this._view.selector, { "media": "./media/", "toolbox": this.toolbox });
    if (src) {
      Blockly.Xml.domToWorkspace(src, this.editor);
    }
    this.editor.addChangeListener(this.onChangeListener);
    this._view.$el = $("#"+this._view.selector);
  }

  @ExportedFunction
  public onClose(): void {
    // changeListeners
    // this.editor.removeChangeListener();
    let code = Blockly.Xml.workspaceToDom(this.editor);
    // TODO: notify AutomationEditingManager
    this.editor.dispose();
  }

  private onChangeListener(){
    alert("on change listener is not implemented yet.");
    let code = Blockly.Xml.workspaceToDom(this.editor);
    // TODO: notify AutomationEditingManager
  }
  
  @ExportedFunction
  public getView(): IViewDataComponent {
      return {
          main: this.templateJQ
      };
  }

  public registerEvents(): void {
      
  }

  @ExportedFunction
  public update(){}

  @ExportedFunction
  public destroy(){}

  /////////////////////////////////////////////////
  //// Establish Component Communication

  @ExportedSignal('Open')
  @ExportedSignal('Close')

  @RequiredFunction('ICEVPL', 'loadProgram')

  @ExportedFunction
  public openProject (path: string): void {
    console.log('testing... openProject called!');
  }

  @ListensSignal('ICEVPL', 'Close')
  public onCloseEditor(data: any): void {
    console.log('testing... onCloseEditor called!');
  }

}
