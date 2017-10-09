/**
 * BlocklyVPL - VPL uses jigsaws
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

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
  name: "blockly",
  description: "VPL uses jigsaws",
  selector: "main-area",
  templateHTML: "blockly.html",
  version: "1.1"
})
export class BlocklyVPL extends IDEUIComponent {
  private editor: any;
  private editorArea: string;
  private changed: boolean;

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

  @ExportedFunction
  public open(src: string, toolbox: string): void {
    this.changed = false;
    this.editor = Blockly.inject(this.editorArea, { media: "./media/", toolbox });
    Blockly.Xml.domToWorkspace(src, this.editor);
    this.editor.addChangeListener(this.onChangeListener);
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
