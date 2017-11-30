import {
  UIComponentMetadata,
  ExportedSignal,
  ExportedFunction,
  RequiredFunction,
  ListensSignal
} from "../../components-framework/component/component-loader";
import {
  IDEUIComponent,
  IViewDataComponent
} from "../../components-framework/component/ide-ui-component";


@UIComponentMetadata({
  description: "VPL Editor uses structure of source code with 3 different boxes I C E",
  authors: [
    {
      name: "Yannis Valsamakis",
      email: "jvalsam@ics.forth.gr",
      date: "August 2017"
    }
  ],
  componentView: "ICEView",
  version: "1.0"
})
export class ICEVPL extends IDEUIComponent {

  @ExportedFunction
  public onOpen(): void {

  }

  @ExportedFunction
  public onClose(): void {

  }

  public registerEvents(): void {
      
  }

  @ExportedFunction
  public update(): void {}

  @ExportedFunction
  public getView(): IViewDataComponent {
      return {
          main: this.view.$el
      };
  }

  @ExportedFunction
  public destroy(){}

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

  @RequiredFunction('BlocklyVPL', 'openProject')

  @ListensSignal('BlocklyVPL', 'Open')
  public onOpenEditor(data) {

  }

  @ListensSignal('BlocklyVPL', 'Close')
  public onCloseEditor(data: any) {
  }

}