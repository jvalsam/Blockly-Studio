/**
 * ICEVPL - Adapter of ICEVPL to import it in Puppy as component
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
  name: "ICEVPL",
  description: "VPL Editor uses structure of source code with 3 different boxes I C E",
  selector: "main-area",
  templateHTML: "ice.html",
  version: "1.0"
})
export class ICEVPL extends IDEUIComponent {

  @ExportedFunction
  public OnOpen(): void {

  }

  @ExportedFunction
  public OnClose(): void {

  }

  @ExportedFunction
  public Update(){}
  
  @ExportedFunction
  public GetView(): IViewDataComponent {
      return {
          main: this._templateJQ.html()
      };
  }

  @ExportedFunction
  public Destroy(){}

  /////////////////////////////////////////////////
  //// Establish Component Communication

  @ExportedSignal('Open')
  @ExportedSignal('Close')

  @ExportedFunction
  public saveProgram(path: string): void {
    console.log('testing... saveProgram called!');
  }

  @ExportedFunction
  public loadProgram (path: string): void {
    console.log('testing... loadProgram called!');
  }

  @RequiredFunction('BlocklyVPL', 'OpenProject')

  @ListensSignal('BlocklyVPL', 'Open')
  public onOpenEditor(data) {

  }

  @ListensSignal('BlocklyVPL', 'Close')
  public onCloseEditor(data: any) {
  }

}