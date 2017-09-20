/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * June 2017
 */

import { ComponentsBridge } from "./component/components-bridge";
import { ComponentLoader } from "./component/component-loader";
import {
  FunctionsHolder,
  RequiredFunctionsHolder,
  SignalListenersHolder,
  SignalsHolder
} from "./holders";
import { ComponentRegistry } from "./component/component-registry";
import { ComponentsCommunication } from "./component/components-communication";
import { Shell } from "./common.components/shell/shell";
import { StartPageComponent } from "./build-in.components/start-page/start-page";

export class IDECore {
  public static initialize(): void {

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
    var shell: Shell = <Shell>ComponentRegistry.getComponentEntry("Shell").create();
    shell.initialize();
    var startpage: StartPageComponent = <StartPageComponent>ComponentRegistry.getComponentEntry("StartPageComponent").create();
    startpage.initialize();
    shell.openComponent(startpage);
    shell.show();
  }

}