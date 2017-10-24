/**
 * ComponentsCommunication - Handles components communication requests
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { Component } from "./component";
import { ComponentLoader } from "./component-loader";
import { ComponentRegistry } from "./component-registry";
import { IDEUIComponent } from "./ide-ui-component";
import { Shell } from "../common.components/shell/shell";
import { ViewRegistry } from "../view/view-registry";
import { ComponentEntry } from "./component-entry";
import { ComponentFunction, Argument } from "./component-function";
import { ComponentSignal, SignalListenerData } from "./component-signal";
import { ResponseValue } from "./response-value";
import * as $ from 'jquery';
import * as _ from 'lodash';
import {
    SignalsHolder,
    FunctionsHolder,
    SignalListenersHolder,
    RequiredFunctionsHolder
} from "../holders";
import { BlackboardComponentRegistry } from "../../shared/blackboard/blackboard-component-registry";
import { IDEError } from "../../shared/ide-error";
import { FuncsMap, FuncsCompsMap } from './../holders';


////////////////////////////////////////////////////////////////////
/////  Decorators for components communication enstablish  /////////


export interface IComponentData {
  // name: string;
  description: string;
  isUnique ?: boolean;
  version ?: string;
  initData?: Array<any>;
}
export interface IUIComponentData extends IComponentData {
  selector: string;
  templateHTML: string;
}

export interface IViewElementData {
  name: string;
  templateHTML: string;
  initData?: Array<any>;
}

function isIUIComponentData(data: IComponentData|IUIComponentData): data is IUIComponentData {
  return (<IUIComponentData>data).selector !== undefined;
}

/**
 * Load IDE Components in ComponentRegistry using the Component
 *
 */

function declareIDEComponentHelper(data: IComponentData | IUIComponentData) {
  return (create: Function) => {
    if (ComponentRegistry.hasComponentEntry(name)) {
      IDEError.raise(
        "DeclareIDEComponent",
        "Component " + name + " is already defined!"
      );
    }
    BlackboardComponentRegistry.createBlackboard(create.name);

    var initData = (data.initData) ? data.initData : [];

    var compEntry = ComponentRegistry.createComponentEntry(
      create.name,
      data.description,
      data.version,
      create,
      data.initData,
      data.isUnique
    );

    if (isIUIComponentData(data)) {
      const templateHTML = (<IUIComponentData>data).templateHTML;
      initData = [ (<IUIComponentData>data).selector, templateHTML, ...initData ];
    }

    compEntry.setArgs(initData);
  };
}
export function DeclareIDEComponent(data: IComponentData) {
  return declareIDEComponentHelper(data);
}
export function DeclareIDEUIComponent(data: IUIComponentData) {
  return declareIDEComponentHelper(data);
}

/**
 * Load View Component Elements
 *
 */
export function DeclareViewElement(data: IViewElementData) {
  return (create: Function) => {
    if (ViewRegistry.hasViewEntry(name)) {
      IDEError.raise(
        "DeclareViewElement",
        "Component " + name + " is already defined!"
      );
    }

    var initData = (data.initData) ? data.initData : [];

    ViewRegistry.createViewEntry(
      data.name,
      data.templateHTML,
      create,
      initData
    );
  };
}

function componentSignalKey(componentName: string, signal: string) { return componentName + '_' + signal; }


const listenSignalsMapTmp: {[component: string]: Array<any>} = {};

function addFunctionHelper(parent: string, child: string, Holder: any) {
    const funcMap = Holder.get(parent);
    let childFuncMap = Holder.get(child);
    if (!childFuncMap) {
      childFuncMap = {};
    }

    if (funcMap) {
      for (const key of Object.keys(funcMap)) {
        const compFunc = funcMap[key].copy();
        childFuncMap[key] = compFunc;
      }
      Holder.put(child, childFuncMap);
    }
}

const LoadHelper = {
  'ListensSignal': {
    'components' : new Array<string>(),
    'add' : function(parent: string, child: string, data?: any) {
        const signalsElements = listenSignalsMapTmp[parent];
        if (signalsElements) {
          for (const signalElement of signalsElements){
            listenSignalsMapTmp[child].push(signalElement);
          }
        }
    }
  },
  'ExportedSignal': {
    'components' : new Array<string>(),
    'add' : function(parent: string, child: string, data?: any) {
      const componentSignals = SignalsHolder.get(parent);
      if (componentSignals) {
        for (const signal of SignalsHolder.get(parent)) {
          const compSignal = signal.copy();
          compSignal.srcName = child;
          let csignals = SignalsHolder.get(child);
          csignals.push(compSignal);
          SignalsHolder.put(child, csignals);
        }
      }
    }
  },
  'ExportedFunction': {
    'components' : new Array<string>(),
    'add' : function(parent: string, child: string, data?: any) {
      addFunctionHelper(parent, child, FunctionsHolder);
    }
  },
  'RequiredFunction': {
    'components' : new Array<string>(),
    'add' : function(parent: string, child: string, data?: any) {
      addFunctionHelper(parent, child, RequiredFunctionsHolder);
    }
  }
};

type LoadHelperType = 'ListensSignal' | 'ExportedSignal' | 'ExportedFunction' | 'RequiredFunction';


function loadParentElements(loadKey: LoadHelperType, className: string, parent: string, data?: any): void {
  // add functions that are exported by inherited classes
  if (parent !== 'Object' && !(className in LoadHelper[loadKey]['components'])) {
    LoadHelper[loadKey].components.push(className);
    // get all exported Functions from proto and put them in this function
    LoadHelper[loadKey].add(parent, className, data);
  }
}

function listensSignalHelper (compName: string, parent: string, callback: string, signal: string, src: string, argsList?: Array<any>) {
  if (!(compName in listenSignalsMapTmp)) {
    listenSignalsMapTmp[compName] = [];
  }
  loadParentElements('ListensSignal', compName, parent);
  listenSignalsMapTmp[compName].push([src, signal, callback, argsList]);
}

export function ListensSignal (componentSignal: string, signal: string, argsList?: Array<string>) {
  return function (
    target: any, propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>) {
      listensSignalHelper(
        target.constructor.name,
        target.__proto__.constructor.name,
        propertyKey,
        signal,
        componentSignal,
        argsList
      );
  };
}

function exportedSignalHelper(compName: string, parent: string, signal: string, argsList?: Array<any>, finalFunc?: string) {
  const compSignal = new ComponentSignal(compName, signal, argsList);
  if (finalFunc !== '') {
    compSignal.finalCallback = finalFunc;
  }

  const compSignals = (!SignalsHolder.containsKey(compName)) ? new Array<ComponentSignal>() : SignalsHolder.get(compName);
  compSignals.push(compSignal);
  SignalsHolder.put(compName, compSignals);
  loadParentElements(
    'ExportedSignal',
    compName,
    parent,
    {'signal': signal}
  );
}

export function ExportedSignal (signal: string, argsList?: Array<any>, finalFunc?: boolean) {
  return (target: any, propertyKey: string,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    exportedSignalHelper(
      target.constructor.name,
      target.__proto__.constructor.name,
      signal,
      argsList,
      finalFunc ? propertyKey : ''
    );
  };
}

function functionHelper(component: string, funcName: string, argsLen: number, parent, method) {
      let funcMap = FunctionsHolder.get(component);

      if (funcMap === null) {
        FunctionsHolder.put(component, {});
        loadParentElements('ExportedFunction', component, parent);
        funcMap = FunctionsHolder.get(component);
      }

      funcMap[funcName] = new ComponentFunction(component, funcName, argsLen);
      FunctionsHolder.put(component, funcMap);
}

function requiredFunctionHelper(componentDest: string, funcName: string, argsLen: number, componentSrc: string, parent: string, method) {
  let funcMap = RequiredFunctionsHolder.get(componentSrc);
  
  if (funcMap === null) {
    RequiredFunctionsHolder.put(componentSrc, {});
    loadParentElements('RequiredFunction', componentSrc, parent);
    funcMap = RequiredFunctionsHolder.get(componentSrc);
  }

  if (!(funcName in funcMap)) {
    funcMap[funcName] = new Array<ComponentFunction>();  
  }

  funcMap[funcName].push(new ComponentFunction(componentDest, funcName, argsLen));
  RequiredFunctionsHolder.put(componentSrc, funcMap);
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func): Array<any> {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) {
     result = [];
  }
  return result;
}

// view exported Functions from
export function ExportedFunction (
    target: any,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>
  ) {
      functionHelper (
        target.constructor.name,
        propertyKey,
        getParamNames(descriptor.value).length,
        target.__proto__.constructor.name,
        descriptor.value
      );
}

export function RequiredFunction (
  component: string,
  funcName: string,
  argsLen?: number
) {
  return (target: any, propertyKey: string,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    requiredFunctionHelper (
        component,
        funcName,
        argsLen,
        target.constructor.name,
        target.__proto__.constructor.name,
        descriptor.value
    );
  };
}

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
      const key = componentSignalKey(compName, signal.name);
      SignalListenersHolder.put(key, { signal: signal, components: new Array<SignalListenerData>() });

      BlackboardComponentRegistry.getBlackboard(compName).addEvent(signal.name);
    }
  }
  // load signals listeners
  for (const component in listenSignalsMapTmp) {
    if (listenSignalsMapTmp.hasOwnProperty(component)) {
      for (const data of listenSignalsMapTmp[component]) {
        const source = data[0];
        const signal = data[1];
        const callback = data[2];
        const argsList = data[3];
        const key = componentSignalKey(source, signal);
        const compSignalData = SignalListenersHolder.get(key);
        if (compSignalData) {
          compSignalData.components.push({'component': component, 'callback': callback});

          BlackboardComponentRegistry.getBlackboard(source).addEventHandler(
            signal,
            {
              compSource: component,
              funcName:   callback
            }
          );
        }
        else {
          IDEError.warn(
            'Component listens signal does not exist.',
            component + ' listens ' + signal + ' which is not exported by ' + source,
            'components-communication.EstablishSignals'
          );
        }
      }
    }
  }
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
        BlackboardComponentRegistry.getBlackboard(compName).addFunction(compFunc.name, compFunc.argsLen);
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
    "ApplicationWSPManager"
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
      const dstComponentEntry = ComponentRegistry.getComponentEntry(dstComponentName);
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
      const dstComponentEntry = ComponentRegistry.getComponentEntry(dstComponentName);
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
      if (!ComponentRegistry.hasComponentEntry(compName)) {
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
    let comp: IDEUIComponent = <IDEUIComponent>ComponentRegistry.getComponentEntry(dstComponentName).getInstances()[0];
    var shell: Shell = <Shell>ComponentRegistry.getComponentEntry("Shell").getInstances()[0];
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
      dstComponentId ?: string
  ): ResponseValue {
    if (!this.hasPermissions(srcComponentName, dstComponentName, funcName)) {
      IDEError.raise(
        _ComponentsCommunication.name,
        "Requested function " + funcName + " which is not defined as a requiredFunction by the component \"" + srcComponentName + "\"."
      );
    }

    if (!dstComponentId && !ComponentRegistry.getComponentEntry(dstComponentName).hasInstance()) {
      ComponentRegistry.getComponentEntry(dstComponentName).create();
    }

    if (funcName in this.specialFunctionRequests) {
      return this.specialFunctionRequests[funcName] (srcComponentName, dstComponentName, args, dstComponentId);
    }
    else {
      return BlackboardComponentRegistry.getBlackboard(dstComponentName).callFunction(funcName, args, srcComponentName, dstComponentId);
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

  public registerListensSignal(component: string, parent: string, funcName: string, signal: string, sourceComponent: string) {
    listensSignalHelper (
      component,
      parent,
      funcName,
      signal,
      sourceComponent
    );
  }

  public registerSignal(component: string, parent: string, signal: string, argsList?: Array<any>, finalFunc?: string) {
    exportedSignalHelper (
      component,
      parent,
      signal,
      argsList,
      finalFunc
    );
  }

  public registerFunction(component: string, parent: string, funcName: string, func: Function, argsLen: number) {
    functionHelper (
      component,
      funcName,
      argsLen,
      parent,
      func
    );
  }

  public registerRequiredFunction(componentDst: string, componentSrc: string, parent, funcName: string, func: Function, argsLen: number) {
    requiredFunctionHelper (
      componentDst,
      funcName,
      argsLen,
      componentSrc,
      parent,
      func
    );
  }
}

export let ComponentsCommunication = new _ComponentsCommunication();