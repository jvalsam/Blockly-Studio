/**
 * IDEComponent - standar functionality has to be offered by ide components
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Component } from "./component";
import {
  DeclareIDEComponent as CI,
  DeclareIDEUIComponent as UCI,
  ExportedSignal as ES,
  ExportedFunction as EF,
  RequiredFunction as RF,
  ListensSignal as LS
} from "./components-communication";


/////////////////////////////////////////////////////////////////////////
// package all required for components to be exported by ide-component

export let ComponentMetadata = CI;
export let ExportedSignal = ES;
export let ExportedFunction = EF;
export let RequiredFunction = RF;
export let ListensSignal = LS;

export abstract class IDEComponent extends Component {

  @ExportedFunction
  public initialize(): void {
    super.initialize();
    // TODO: add initializations for ide components
  }

  @ExportedFunction
  public cleanUp(): void {
  }

  @ExportedFunction
  public addUserAction() {
    // this functionality has to be exported in the component framework
  }

}
