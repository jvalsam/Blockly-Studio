/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * June 2017
 */

import { IDEError } from "./../shared/ide-error/ide-error";

import { ComponentLoader } from "./component/component-loader";
import {
  FunctionsHolder,
  RequiredFunctionsHolder,
  SignalListenersHolder,
  SignalsHolder,
  DataLoader
} from "./holders";

import { DomainLibsHolder } from "../domain-manager/domain-libs-holder";
import { ComponentsBridge } from "./component/components-bridge";

import { ComponentRegistry } from "./component/component-entry";
import { ComponentsCommunication } from "./component/components-communication";
import { Shell } from "./common.components/shell/shell";
import { Configuration } from "./build-in.components/configuration/configuration";
import { StartPageComponent } from "./build-in.components/start-page/start-page";
import "jquery";
import "bootstrap";

export class IDECore {
  public static initialize(): void {
    IDEError.initialize();
    SignalsHolder.initialize();
    SignalListenersHolder.initialize();
    FunctionsHolder.initialize();
    RequiredFunctionsHolder.initialize();
    ComponentLoader.initialize();
    DomainLibsHolder.initialize();

    ComponentRegistry.initialize();
    ComponentsBridge.initialize();
    ComponentsCommunication.initialize();
  }

  public static start(): void {
    DataLoader.start(
      () => {
        var shell: Shell = <Shell>ComponentRegistry.getEntry("Shell").create([".ide-platform-container"]);
        shell.initialize();
        var configuration: Configuration = <Configuration>ComponentRegistry.getEntry("Configuration").create([".modal-platform-container"]);
        configuration.initialize();
        ComponentRegistry.getEntry("ApplicationWSPManager").create();
        var startpage: StartPageComponent = <StartPageComponent>ComponentRegistry.getEntry("StartPageComponent").create([".main-area-platform-container"]);
        shell.openComponent(startpage);
      }
    );
  }

}