/**
 * IDEComponent - standar functionality has to be offered by ide components
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Configuration } from "./../build-in.components/configuration/configuration";
import { ComponentRegistry } from "./component-entry";
import { ExportedFunction } from "./component-loader";
import { Component } from "./component";

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

  @ExportedFunction
  public onConfig(instType?: string): void {
    let configuration: Configuration = (<Configuration>ComponentRegistry.getEntry("Configuration").getInstances()[0]);
    configuration.openComponentConfig(this.name, instType);
  }

}
