/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * June 2017
 */

import { IDEError } from "./../shared/ide-error/ide-error";
import { ComponentsBridge } from "./component/components-bridge";
import { ComponentLoader } from "./component/component-loader";
import {
  FunctionsHolder,
  RequiredFunctionsHolder,
  SignalListenersHolder,
  SignalsHolder
} from "./holders";
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

    ComponentRegistry.initialize();
    ComponentsBridge.initialize();
    ComponentsCommunication.initialize();
  }

  public static start(): void {
    var shell: Shell = <Shell>ComponentRegistry.getEntry("Shell").create();
    shell.initialize();
    var configuration: Configuration = <Configuration>ComponentRegistry.getEntry("Configuration").create();
    configuration.initialize();
    ComponentRegistry.getEntry("ApplicationWSPManager").create();
    var startpage: StartPageComponent = <StartPageComponent>ComponentRegistry.getEntry("StartPageComponent").create();
    shell.openComponent(startpage);
    shell.show();
  }

}