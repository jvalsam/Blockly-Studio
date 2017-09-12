/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * June 2017
 */

import { ComponentsBridge } from "./components-bridge";
import { ComponentLoader } from "./component-loader";
import {
  FunctionsHolder,
  RequiredFunctionsHolder,
  SignalListenersHolder,
  SignalsHolder
} from "./holders";
import { ComponentRegistry } from "./component-registry";
import { ComponentsCommunication } from "./components-communication";
import { Shell } from "./common.components/shell/shell";
import { StartPageComponent } from "./build-in.components/start-page/start-page";

export class IDECore {
  public static Initialize(): void {

    SignalsHolder.Initialize();
    SignalListenersHolder.Initialize();
    FunctionsHolder.Initialize();
    RequiredFunctionsHolder.Initialize();
    ComponentLoader.Initialize();

    ComponentRegistry.Initialize();
    ComponentsBridge.Initialize();
    ComponentsCommunication.Initialize();
  }

  public static Start(): void {
    var shell: Shell = <Shell>ComponentRegistry.GetComponentEntry("Shell").Create();
    shell.Initialize();
    var startpage: StartPageComponent = <StartPageComponent>ComponentRegistry.GetComponentEntry("StartPageComponent").Create();
    startpage.Initialize();
    shell.OpenComponent(startpage);
    shell.Show();
  }

  public static OnTemplatesLoadCompleted(): void {
    IDECore.Start();
  }

}