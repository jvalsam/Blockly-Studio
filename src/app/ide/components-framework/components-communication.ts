/**
 * ComponentsCommunication - Handles components communication requests
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { Component } from "./component";
import { ComponentLoader } from "./component-loader";
import { ComponentRegistry } from "./component-registry";
import { ComponentEntry } from "./component-entry";
import { ComponentFunction, Argument } from "./component-function";
import { ComponentSignal, SignalListenerData } from "./component-signal";
import { ResponseValue } from "./response-value";
import * as $ from "jquery";
import * as _ from "lodash";
import {
    SignalsHolder,
    FunctionsHolder,
    SignalListenersHolder,
    RequiredFunctionsHolder
} from "./holders";
import { BlackboardComponentRegistry } from "./../shared/blackboard/blackboard-component-registry";
import { IDEError } from "../shared/ide-error";


////////////////////////////////////////////////////////////////////
/////  Decorators for components communication enstablish  /////////


export interface IComponentData {
  name: string;
  description: string;
  version ?: string;
  initData?: Array<any>;
}
export interface IUIComponentData extends IComponentData {
  selector: string;
  templateHTML: string;
}

function isIUIComponentData(data: IComponentData|IUIComponentData): data is IUIComponentData {
  return (<IUIComponentData>data).selector !== undefined;
}

/**
 * Load IDE Components in ComponentRegistry using the Component
 *
 */
function DeclareIDEComponentHelper(data: IComponentData | IUIComponentData) {
  return (create: Function) => {
    if (ComponentRegistry.HasComponentEntry(name)) {
      IDEError.raise(
        "DeclareIDEComponent",
        "Component " + name + " is already defined!"
      );
    }

    var initData = (data.initData) ? data.initData : [];

    var compEntry = ComponentRegistry.CreateComponentEntry(
      data.name,
      data.description,
      data.version,
      create,
      data.initData
    );

    if (isIUIComponentData(data)) {
      const templateHTML = (<IUIComponentData>data).templateHTML;
      initData = [ (<IUIComponentData>data).selector, templateHTML, ...initData ];
    }
    
    compEntry.SetArgs(initData);

  };
}
export function DeclareIDEComponent(data: IComponentData) {
  return DeclareIDEComponentHelper(data);
}
export function DeclareIDEUIComponent(data: IUIComponentData) {
  return DeclareIDEComponentHelper(data);
}

function ComponentSignalKey(componentName: string, signal: string) { return componentName + '_' + signal; }


const listenSignalsMapTmp: {[component: string]: Array<any>} = {};

function addFunctionHelper(parent: string, child: string, Holder: any) {
    const funcMap = Holder.Get(parent);
    let childFuncMap = Holder.Get(child);
    if (!childFuncMap) {
      childFuncMap = {};
    }

    if (funcMap) {
      for (const key of Object.keys(funcMap)) {
        const compFunc = funcMap[key].copy();
        childFuncMap[key] = compFunc;
      }
      Holder.Put(child, childFuncMap);
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
      const componentSignals = SignalsHolder.Get(parent);
      if (componentSignals) {
        for (const signal of SignalsHolder.Get(parent)) {
          const compSignal = signal.copy();
          compSignal.srcName = child;
          let csignals = SignalsHolder.Get(child);
          csignals.push(compSignal);
          SignalsHolder.Put(child, csignals);
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


function LoadParentElements(loadKey: LoadHelperType, className: string, parent: string, data?: any): void {
  // add functions that are exported by inherited classes
  if (parent !== 'Object' && !(className in LoadHelper[loadKey]['components'])) {
    LoadHelper[loadKey].components.push(className);
    // get all exported Functions from proto and put them in this function
    LoadHelper[loadKey].add(parent, className, data);
  }
}

function ListensSignalHelper (compName: string, parent: string, callback: string, signal: string, src: string, argsList?: Array<any>) {
  if (!(compName in listenSignalsMapTmp)) {
    listenSignalsMapTmp[compName] = [];
  }
  LoadParentElements('ListensSignal', compName, parent);
  listenSignalsMapTmp[compName].push([src, signal, callback, argsList]);
}

export function ListensSignal (componentSignal: string, signal: string, argsList?: Array<string>) {
  return function (
    target: any, propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>) {
      ListensSignalHelper(
        target.constructor.name,
        target.__proto__.constructor.name,
        propertyKey,
        signal,
        componentSignal,
        argsList
      );
  };
}

function ExportedSignalHelper(compName: string, parent: string, signal: string, argsList?: Array<any>, finalFunc?: string) {
  const compSignal = new ComponentSignal(compName, signal, argsList);
  if (finalFunc !== '') {
    compSignal.finalCallback = finalFunc;
  }

  const compSignals = (!SignalsHolder.ContainsKey(compName)) ? new Array<ComponentSignal>() : SignalsHolder.Get(compName);
  compSignals.push(compSignal);
  SignalsHolder.Put(compName, compSignals);
  LoadParentElements(
    'ExportedSignal',
    compName,
    parent,
    {'signal': signal}
  );
}

export function ExportedSignal (signal: string, argsList?: Array<any>, finalFunc?: boolean) {
  return (target: any, propertyKey: string,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    ExportedSignalHelper(
      target.constructor.name,
      target.__proto__.constructor.name,
      signal,
      argsList,
      finalFunc ? propertyKey : ''
    );
  };
}

function FunctionHelper(component: string, funcName: string, argsLen: number, parent, method) {
      let funcMap = FunctionsHolder.Get(component);

      if (funcMap === null) {
        FunctionsHolder.Put(component, {});
        LoadParentElements('ExportedFunction', component, parent);
        funcMap = FunctionsHolder.Get(component);
      }

      funcMap[funcName] = new ComponentFunction(component, funcName, argsLen);
      FunctionsHolder.Put(component, funcMap);
}

function RequiredFunctionHelper(componentDest: string, funcName: string, argsLen: number, componentSrc: string, parent: string, method) {
  let funcMap = RequiredFunctionsHolder.Get(componentSrc);
  
  if (funcMap === null) {
    RequiredFunctionsHolder.Put(componentSrc, {});
    LoadParentElements('RequiredFunction', componentSrc, parent);
    funcMap = RequiredFunctionsHolder.Get(componentSrc);
  }

  funcMap[funcName] = new ComponentFunction(componentDest, funcName, argsLen);
  RequiredFunctionsHolder.Put(componentSrc, funcMap);
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
      FunctionHelper (
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
    RequiredFunctionHelper (
        component,
        funcName,
        argsLen,
        target.constructor.name,
        target.__proto__.constructor.name,
        descriptor.value
    );
  };
}


function EstablishSignals() {
  // load component signals
  for (const compName of SignalsHolder.GetKeys()) {
    if (!BlackboardComponentRegistry.HasBlackboard(compName)) {
      BlackboardComponentRegistry.CreateBlackboard(compName);
    }
    for (const signal of SignalsHolder.Get(compName)) {
      const key = ComponentSignalKey(compName, signal.name);
      SignalListenersHolder.Put(key, { signal: signal, components: new Array<SignalListenerData>() });

      BlackboardComponentRegistry.GetBlackboard(compName).AddEvent(signal.name);
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
        const key = ComponentSignalKey(source, signal);
        const compSignalData = SignalListenersHolder.Get(key);
        if (compSignalData) {
          compSignalData.components.push({'component': component, 'callback': callback});

          BlackboardComponentRegistry.GetBlackboard(source).AddEventHandler(
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

function EstablishFunctions() {
  // Add function in Blackboard
  for(const compName of FunctionsHolder.GetKeys()) {
    if (!BlackboardComponentRegistry.HasBlackboard(compName)) {
      BlackboardComponentRegistry.CreateBlackboard(compName);
    }
    const funcsMap = FunctionsHolder.Get(compName);
    if (funcsMap) {
      for(const key of Object.keys(funcsMap)) {
        const compFunc = funcsMap[key];
        BlackboardComponentRegistry.GetBlackboard(compName).AddFunction(compFunc.name, compFunc.argsLen);
      }
    }
  }

  // Check required functions are enable from other components as exported functions
  for (const componentName of RequiredFunctionsHolder.GetKeys()) {
    const funcMap = RequiredFunctionsHolder.Get(componentName);
    if (funcMap) {
      for (const funcName of Object.keys(funcMap)) {
        const srcComponent = funcMap[funcName].srcName;
        if (!(funcName in FunctionsHolder.Get(srcComponent))) {
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

function EstablishCommunication() {
  EstablishSignals();
  EstablishFunctions();
}


///////////////////////////////////////////////////////////////////


class _ComponentsCommunication {

  public Initialize() {
    EstablishCommunication();
  }

  private AssertComponentHelperCommonExists(dst: ComponentEntry, src?: Component) {
      if (!dst) {
          if (src) {
              IDEError.raise(
                  _ComponentsCommunication.name,
                  'Not found component ' + dst.componentInfo.name + 'requested by',
                  src.getComponentInfoMsg()
              );
          }
          else {
              IDEError.raise(
                  _ComponentsCommunication.name,
                  'Not found component ' + dst.componentInfo.name + '.'
              );
          }
      }
  }

  public AssertComponentFunctionExists(
      functionName: string,
      dstComponentName: string,
      srcComponent?: Component
  ): void {
      const dstComponentEntry = ComponentRegistry.GetComponentEntry(dstComponentName);
      this.AssertComponentHelperCommonExists(dstComponentEntry, srcComponent);
      if (!dstComponentEntry.hasOwnProperty(functionName)) {
          IDEError.raise(
              _ComponentsCommunication.name,
              'Requested function ' + functionName + ' is not exported by',
              dstComponentEntry.componentInfo.name
          );
      }
  }

  public AssertComponentSignalExists(
      signalName: string,
      dstComponentName: string,
      srcComponent: Component
  ): void {
      const dstComponentEntry = ComponentRegistry.GetComponentEntry(dstComponentName);
      this.AssertComponentHelperCommonExists(dstComponentEntry, srcComponent);
      if (!(signalName in SignalsHolder.Get(dstComponentName))) {
          IDEError.raise(
              _ComponentsCommunication.name,
              'Requested signal ' + signalName + ' is not exported by',
              dstComponentEntry.componentInfo.name
          );
      }
  }

  private AssertComponentExists(comp: Component | string) {
      const compName: string = ((<Component>comp).name !== undefined) ? (<Component>comp).name : <string>comp;
      if (!ComponentRegistry.HasComponentEntry(compName)) {
          IDEError.raise(
              _ComponentsCommunication.name,
              'Component with name ' + compName + ' is not registered.'
          );
      }
  }

  public FunctionRequest(
      srcComponentName: string,
      dstComponentName: string,
      funcName: string,
      args: Array<any>=[],
      dstComponentId ?: string
  ): ResponseValue {
    // check if requested function is not defined as requiredFunction
    const reqFuncs = RequiredFunctionsHolder.Get(srcComponentName); 
    if ( srcComponentName!="Shell" &&
         (!reqFuncs || Object.keys(reqFuncs).indexOf(funcName)<=-1)
    ) {
      IDEError.raise(
        _ComponentsCommunication.name,
        'Requested function ' + funcName + ' which is not defined as a requiredFunction by the component "' + srcComponentName + '".'
      );
    }
    return BlackboardComponentRegistry.GetBlackboard(dstComponentName).CallFunction(funcName, args, srcComponentName, dstComponentId);
  }

  public PostSignal(component: string, signal: string, argsList?: Array<any>): void {
    const blackboardComp = BlackboardComponentRegistry.GetBlackboard(component);

    if (!blackboardComp) {
      IDEError.raise(
        _ComponentsCommunication.name,
        'Component ' + component + ' posts signal which is not exported',
        'Signal ' + signal + ' is not defined as exported signal of the component ' + component + '.'
      );
    }

    blackboardComp.PostEvent(signal, {data: argsList});
  }

  public RegisterListensSignal(component: string, parent: string, funcName: string, signal: string, sourceComponent: string) {
    ListensSignalHelper (
      component,
      parent,
      funcName,
      signal,
      sourceComponent
    );
  }

  public RegisterSignal(component: string, parent: string, signal: string, argsList?: Array<any>, finalFunc?: string) {
    ExportedSignalHelper (
      component,
      parent,
      signal,
      argsList,
      finalFunc
    );
  }

  public RegisterFunction(component: string, parent: string, funcName: string, func: Function, argsLen: number) {
    FunctionHelper (
      component,
      funcName,
      argsLen,
      parent,
      func
    );
  }

  public RegisterRequiredFunction(componentDst: string, componentSrc: string, parent, funcName: string, func: Function, argsLen: number) {
    RequiredFunctionHelper (
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