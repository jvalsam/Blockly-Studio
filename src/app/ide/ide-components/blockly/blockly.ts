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
} from "../../components-framework/ide-ui-component";
import {
  ExportedSignal,
  ExportedFunction,
  RequiredFunction,
  ListensSignal
} from "../../components-framework/ide-component";


@UIComponentMetadata({
  name: "blockly",
  description: "VPL uses jigsaws",
  selector: "main-area",
  templateHTML: "blockly.html",
  version: "1.1"
})
export class BlocklyVPL extends IDEUIComponent {

  @ExportedFunction
  public OnOpen(): void {

  }

  @ExportedFunction
  public OnClose(): void {

  }
  
  @ExportedFunction
  public GetView(): IViewDataComponent {
      return {
          main: this._templateJQ.html()
      };
  }

  @ExportedFunction
  public Update(){}

  @ExportedFunction
  public Destroy(){}

  /////////////////////////////////////////////////
  //// Establish Component Communication

  @ExportedSignal('Open')
  @ExportedSignal('Close')

  @RequiredFunction('ICEVPL', 'loadProgram')

  @ExportedFunction
  public OpenProject (path: string): void {
    console.log('testing... OpenProject called!');
  }

  @ListensSignal('ICEVPL', 'Close')
  public onCloseEditor(data: any): void {
    console.log('testing... onCloseEditor called!');
  }

}