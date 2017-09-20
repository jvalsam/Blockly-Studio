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


@UIComponentMetadata({
  name: "blockly",
  description: "VPL uses jigsaws",
  selector: "main-area",
  templateHTML: "blockly.html",
  version: "1.1"
})
export class BlocklyVPL extends IDEUIComponent {

  @ExportedFunction
  public onOpen(): void {

  }

  @ExportedFunction
  public onClose(): void {

  }
  
  @ExportedFunction
  public getView(): IViewDataComponent {
      return {
          main: this.templateHTML
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
