/**
 * ComponentsCommunication - Handles components communication requests
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { Component } from "./component";
import { ComponentRegistry } from "./component-entry";
import { IDEUIComponent } from "./ide-ui-component";
import { ComponentSignalKey, ListenSignalsMap } from "./component-loader";
import { Shell } from "../common.components/shell/shell";
import { ComponentEntry } from "./component-entry";
import { SignalListenerData, ComponentSignal } from "./component-signal";
import { ResponseValue } from "./response-value";
import {
    SignalsHolder,
    FunctionsHolder,
    SignalListenersHolder,
    RequiredFunctionsHolder
} from "../holders";
import {
  BlackboardComponentRegistry
} from "../../shared/blackboard/blackboard-component-registry";
import { IDEError } from "../../shared/ide-error/ide-error";
import { FuncsCompsMap } from "./../holders";


function hasMetadata(compName: string): boolean {
  return compName !== "Component" && compName !== "IDEComponent";
}

function establishSignals() {
  // load component signals
  for (const compName of SignalsHolder.getKeys()) {
    if (!hasMetadata(compName)) {
      continue;
    }
    for (const signal of SignalsHolder.get(compName)) {
      PostsSignal(compName, signal);
    }
  }
  // load signals listeners
  for (const component in ListenSignalsMap) {
    //TODO: check following if, it seems useless...
    if (ListenSignalsMap.hasOwnProperty(component)) {
      for (const data of ListenSignalsMap[component]) {
        const source = data[0];
        const signal = data[1];
        const callback = data[2];
        ListensSignal(source, signal, callback, component);
      }
    }
  }
}

export function ListensSignal (
  source,
  signal,
  callback,
  component
) {
  const key = ComponentSignalKey(source, signal);
  const compSignalData = SignalListenersHolder.get(key);
  if (compSignalData) {
    compSignalData.components.push({
      "component": component,
      "callback": callback
    });

    BlackboardComponentRegistry.getBlackboard(source).addEventHandler(
      signal,
      {
        compSource: component,
        funcName: callback
      }
    );
  }
  else {
    IDEError.warn(
      "Component listens signal does not exist.",
      component
      + " listens "
      + signal
      + " which is not exported by "
      + source,
      "components-communication.EstablishSignals"
    );
  }
}

export function ListensSignals(compName: string, signals: Array<any>) {
  signals.forEach(data => {
    ListensSignal(data.source, data.signal, data.callback, compName);
  });
}

export function PostsSignal(compName: string, signal) {
  const key = ComponentSignalKey(compName, signal.name);
  SignalListenersHolder.put(
    key,
    {
      signal: signal,
      components: new Array<SignalListenerData>()
    }
  );
  BlackboardComponentRegistry.getBlackboard(compName).addEvent(signal.name);
}

export function PostsSignals(compName: string, signals: Array<string>) {
  signals.forEach(signal =>
    PostsSignal(compName, new ComponentSignal(compName, signal))
  );
}

export function ComponentCommAddFunction(
  compName: string,
  funcName: string,
  argsLen?: number
  ) {
  BlackboardComponentRegistry.getBlackboard(compName).addFunction(funcName, argsLen);
}

function establishFunctions() {
  // Add function in Blackboard
  for(const compName of FunctionsHolder.getKeys()) {
    if (!hasMetadata(compName)) {
      continue;
    }
    const funcsMap = FunctionsHolder.get(compName);
    if (funcsMap) {
      for(const key of Object.keys(funcsMap)) {
        const compFunc = funcsMap[key];
        ComponentCommAddFunction(compName, compFunc.name, compFunc.argsLen);
      }
    }
  }

  // Check required functions are enable from other components as exported functions
  for (const componentName of RequiredFunctionsHolder.getKeys()) {
    const funcMap = RequiredFunctionsHolder.get(componentName);
    if (funcMap) {
      for (const funcName of Object.keys(funcMap)) {
        for(const compFunc of funcMap[funcName]) {
          const srcComponent = compFunc.srcName;
          if (!(funcName in FunctionsHolder.get(srcComponent))) {
            IDEError.raise(
              'Function is Required by ' + componentName + ' that is not exported',
              'Function ' + funcName + ' is not exported by component ' + srcComponent,
              'components-communication .. ManageComponentsFunctionalityRequired'
            );
          }
        }
      }
    }
  }
}

function establishCommunication() {
  establishSignals();
  establishFunctions();
}


///////////////////////////////////////////////////////////////////

interface ISpecialFunctionRequestMap {
  [funcName: string]: (srcCompName: string, dstCompName: string, args: Array<any>, dstComponentId ?: string) => ResponseValue;
};

class _ComponentsCommunication {
  private readonly fullPermissionComponents : Array<String> = [
    "Shell",
    "Menu",
    "Toolbar",
    "ApplicationWSPManager",
    "ProjectManager",
    "EditorManager"
  ];
  private readonly specialFunctionRequests: ISpecialFunctionRequestMap = {
    "open" : this.specialFuncRequestOpen,
    "close" : this.specialFuncRequestClose
  };

  public initialize(): void {
    establishCommunication();
  }

  private assertComponentHelperCommonExists(dst: ComponentEntry, src?: Component): void {
      if (!dst) {
          if (src) {
              IDEError.raise(
                  _ComponentsCommunication.name,
                  "Not found component " + dst.componentInfo.name + "requested by",
                  src.getComponentInfoMsg()
              );
          }
          else {
              IDEError.raise(
                  _ComponentsCommunication.name,
                  "Not found component " + dst.componentInfo.name + "."
              );
          }
      }
  }

  public assertComponentFunctionExists(
      functionName: string,
      dstComponentName: string,
      srcComponent?: Component
  ): void {
      const dstComponentEntry = ComponentRegistry.getEntry(dstComponentName);
      this.assertComponentHelperCommonExists(dstComponentEntry, srcComponent);
      if (!dstComponentEntry.hasOwnProperty(functionName)) {
          IDEError.raise(
              _ComponentsCommunication.name,
              "Requested function " + functionName + " is not exported by",
              dstComponentEntry.componentInfo.name
          );
      }
  }

  public assertComponentSignalExists(
      signalName: string,
      dstComponentName: string,
      srcComponent: Component
  ): void {
      const dstComponentEntry = ComponentRegistry.getEntry(dstComponentName);
      this.assertComponentHelperCommonExists(dstComponentEntry, srcComponent);
      if (!(signalName in SignalsHolder.get(dstComponentName))) {
          IDEError.raise(
              _ComponentsCommunication.name,
              "Requested signal " + signalName + " is not exported by",
              dstComponentEntry.componentInfo.name
          );
      }
  }

  private assertComponentExists(comp: Component | string): void {
      const compName: string = ((<Component>comp).name !== undefined) ? (<Component>comp).name : <string>comp;
      if (!ComponentRegistry.hasEntry(compName)) {
          IDEError.raise(
              _ComponentsCommunication.name,
              "Component with name " + compName + " is not registered."
          );
      }
  }

  private hasPermissions(compName: string, dstCompName: string, funcName: string): boolean {
    if (this.fullPermissionComponents.indexOf(compName)>-1) {
      return true;
    }

    const reqFuncs: FuncsCompsMap = RequiredFunctionsHolder.get(compName);
    if (reqFuncs && Object.keys(reqFuncs).indexOf(funcName)>-1) {
      for (const compFunc of reqFuncs[funcName]) {
        if (dstCompName === compFunc.srcName) {
          return true;
        }
      }
    }
    return false;
  }

  private specialFuncRequestOpen(
    srcComponentName: string,
    dstComponentName: string,
    args: Array<any>=[],
    dstComponentId ?: string
  ): ResponseValue {
    BlackboardComponentRegistry.getBlackboard(dstComponentName).callFunction("open", args, srcComponentName, dstComponentId);
    let comp: IDEUIComponent = <IDEUIComponent>ComponentRegistry.getEntry(dstComponentName).getInstances()[0];
    var shell: Shell = <Shell>ComponentRegistry.getEntry("Shell").getInstances()[0];
    shell.openComponent(comp);
    return new ResponseValue(dstComponentName, "open", true);
  }

  private specialFuncRequestClose(
      srcComponentName: string,
      dstComponentName: string,
      args: Array<any>=[],
      dstComponentId ?: string
  ): ResponseValue {
      return new ResponseValue(dstComponentName, "close", true);
  }

  public functionRequest(
      srcComponentName: string,
      dstComponentName: string,
      funcName: string,
      args: Array<any>=[],
      dstComponentId: string="",
      compInstData: Array<any>=[]
  ): ResponseValue {
    if (!this.hasPermissions(srcComponentName, dstComponentName, funcName)) {
      IDEError.raise(
        _ComponentsCommunication.name,
        "Requested function " + funcName + " which is not defined as a requiredFunction by the component \"" + srcComponentName + "\"."
      );
    }

    let componentEntry = ComponentRegistry.getEntry(dstComponentName);

    if (!componentEntry.hasStaticMember(funcName)) {

      if (!dstComponentId && !componentEntry.hasInstance()) {
        ComponentRegistry.getEntry(dstComponentName).create(compInstData);
      }

      if (funcName in this.specialFunctionRequests) {
        return this.specialFunctionRequests[funcName] (srcComponentName, dstComponentName, args, dstComponentId);
      }
      else {
        return BlackboardComponentRegistry.getBlackboard(dstComponentName).callFunction(funcName, args, srcComponentName, dstComponentId);
      }
    }
    else {
      let respValue = componentEntry.callStaticMember(funcName, args);
      return new ResponseValue(dstComponentName, funcName, respValue);
    }
  }

  public postSignal(component: string, signal: string, argsList?: Array<any>): void {
    const blackboardComp = BlackboardComponentRegistry.getBlackboard(component);

    if (!blackboardComp) {
      IDEError.raise(
        _ComponentsCommunication.name,
        "Component " + component + " posts signal which is not exported",
        "Signal " + signal + " is not defined as exported signal of the component " + component + "."
      );
    }

    blackboardComp.postEvent(signal, {data: argsList});
  }
}

export let ComponentsCommunication = new _ComponentsCommunication();