/**
 * IDEComponent - standar functionality has to be offered by ide components
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Configuration } from "./../build-in.components/configuration/configuration";
import { ComponentRegistry } from "./component-entry";
import { ExportedFunction, ExportedFunctionAR, RequiredFunction } from "./component-loader";
import { Component } from "./component";
import { ComponentsCommunication } from "./components-communication";

export abstract class IDEComponent extends Component {
  protected _componentsData: { [projectId: string]: any };

  constructor(name: string, description: string) {
    super(name, description);
    this._componentsData = {};
  }

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

  @ExportedFunctionAR(false)
  public onConfig(instType?: string): void {
    let configuration: Configuration = (<Configuration>ComponentRegistry.getEntry("Configuration").getInstances()[0]);
    configuration.openComponentConfig(this.name, instType);
  }

  
  @RequiredFunction("ProjectManager", "saveComponentData")
  protected saveProjectComponentData(projectId: string, data: any) {
      this._componentsData[projectId] = data;

      ComponentsCommunication.functionRequest(
          this.name,
          "ProjectManager",
          "saveComponentData",
          [
              this.name,
              projectId,
              this._componentsData[projectId]
          ]
      );
  }

  @RequiredFunction("ProjectManager", "getComponentData")
  protected getProjectComponentData(projectId: string) {
      if (this._componentsData[projectId]) {
          return this._componentsData[projectId];
      }
      else {
          let data = ComponentsCommunication.functionRequest(
              this.name,
              "ProjectManager",
              "getComponentData",
              [
                  this.name,
                  projectId
              ]
          ).value;
          return data || {};
      }
  }


}
