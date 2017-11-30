import { ComponentRegistry } from "./component-entry";
import {
    SignalsHolder,
    FunctionsHolder,
    RequiredFunctionsHolder
} from "../holders";
import { ComponentSignal } from "./component-signal";
import { IDEError } from "../../shared/ide-error/ide-error";
import { ComponentFunction } from "./component-function";
import { BlackboardComponentRegistry } from "../../shared/blackboard/blackboard-component-registry";


/**
 * Load IDE Components in ComponentRegistry using the Component
 *
 */

export interface IAuthorData {
    name: string,
    email: string,
    date: string,
    workDescr?: string // description of changes, refactoring, extensions etc
}

export interface IComponentData {
    description: string;
    authors: Array<IAuthorData>;
    isUnique?: boolean;
    version?: string;
    initData?: Array<any>;
    menuDef?: any;
    configDef?: any;
}

export interface IUIComponentData extends IComponentData {
    componentView: string;
}

function isIUIComponentData(data: IComponentData | IUIComponentData): data is IUIComponentData {
    return (<IUIComponentData>data).componentView !== undefined;
}


function declareIDEComponentHelper(data: IComponentData | IUIComponentData) {
    return (create: Function) => {
        if (ComponentRegistry.hasEntry(name)) {
            IDEError.raise(
                "DeclareIDEComponent",
                "Component " + name + " is already defined!"
            );
        }
        BlackboardComponentRegistry.createBlackboard(create.name);

        var initData = (data.initData) ? data.initData : [];

        var compEntry = ComponentRegistry.createEntry(
            create.name,
            data.description,
            data.version,
            create,
            data.initData,
            data.menuDef,
            data.configDef,
            data.isUnique
        );

        if (isIUIComponentData(data)) {
            initData = [(<IUIComponentData>data).componentView, ...initData];
        }

        compEntry.setArgs(initData);
    };
}

// Used as decorator, declares IDEComponent
export function ComponentMetadata(data: IComponentData) {
    return declareIDEComponentHelper(data);
}

// Used as decorator, declares IDEUIComponent
export function UIComponentMetadata(data: IUIComponentData) {
    return declareIDEComponentHelper(data);
}

export function ComponentSignalKey(componentName: string, signal: string) {
    return componentName + "_" + signal;
}

export const ListenSignalsMap: { [component: string]: Array<any> } = {};

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


var LoadHelper = {
    'ListensSignal': {
        'components': new Array<string>(),
        'add': function (parent: string, child: string, data?: any) {
            const signalsElements = ListenSignalsMap[parent];
            if (signalsElements) {
                for (const signalElement of signalsElements) {
                    ListenSignalsMap[child].push(signalElement);
                }
            }
        }
    },
    'ExportedSignal': {
        'components': new Array<string>(),
        'add': function (parent: string, child: string, data?: any) {
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
        'components': new Array<string>(),
        'add': function (parent: string, child: string, data?: any) {
            addFunctionHelper(parent, child, FunctionsHolder);
        }
    },
    'RequiredFunction': {
        'components': new Array<string>(),
        'add': function (parent: string, child: string, data?: any) {
            addFunctionHelper(parent, child, RequiredFunctionsHolder);
        }
    }
};

type LoadHelperType = "ListensSignal" | "ExportedSignal" | "ExportedFunction" | "RequiredFunction";


function loadParentElements(loadKey: LoadHelperType, className: string, parent: string, data?: any): void {
    // add functions that are exported by inherited classes
    if (parent !== 'Object' && !(className in LoadHelper[loadKey]['components'])) {
        LoadHelper[loadKey].components.push(className);
        // get all exported Functions from proto and put them in this function
        LoadHelper[loadKey].add(parent, className, data);
    }
}

function listensSignalHelper(compName: string, parent: string, callback: string, signal: string, src: string, argsList?: Array<any>) {
    if (!(compName in ListenSignalsMap)) {
        ListenSignalsMap[compName] = [];
    }
    loadParentElements('ListensSignal', compName, parent);
    ListenSignalsMap[compName].push([src, signal, callback, argsList]);
}

// Used as decorator
// publishes signal will be listened by the component
export function ListensSignal(componentSignal: string, signal: string, argsList?: Array<string>) {
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
        { 'signal': signal }
    );
}

// Used as decorator
// publishes component signal will be received by the system
export function ExportedSignal(signal: string, argsList?: Array<any>, finalFunc?: boolean) {
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

// Used as decorator
// publishes enabled functionality of the component
export function ExportedFunction(
    target: any,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>
) {
    functionHelper(
        target.constructor.name,
        propertyKey,
        getParamNames(descriptor.value).length,
        target.__proto__.constructor.name,
        descriptor.value
    );
}

// Used as decorator
// publishes required functionality (from other components) of the component
export function RequiredFunction(
    component: string,
    funcName: string,
    argsLen?: number
) {
    return (target: any, propertyKey: string,
        descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>) => {
        requiredFunctionHelper(
            component,
            funcName,
            argsLen,
            target.constructor.name,
            target.__proto__.constructor.name,
            descriptor.value
        );
    };
}

// Used by components which will be developed in JS (TODO: will need more work)
// OR in case Decorators of Typescript will not be used
export class EstablishComponentsCommunicationJS {
    public static registerListensSignal(component: string, parent: string, funcName: string, signal: string, sourceComponent: string) {
        listensSignalHelper(
            component,
            parent,
            funcName,
            signal,
            sourceComponent
        );
    }

    public static registerSignal(component: string, parent: string, signal: string, argsList?: Array<any>, finalFunc?: string) {
        exportedSignalHelper(
            component,
            parent,
            signal,
            argsList,
            finalFunc
        );
    }

    public static registerFunction(component: string, parent: string, funcName: string, func: Function, argsLen: number) {
        functionHelper(
            component,
            funcName,
            argsLen,
            parent,
            func
        );
    }

    public static registerRequiredFunction(componentDst: string, componentSrc: string, parent, funcName: string, func: Function, argsLen: number) {
        requiredFunctionHelper(
            componentDst,
            funcName,
            argsLen,
            componentSrc,
            parent,
            func
        );
    }
}

export class ComponentLoader {
    private static _requestedTemplatesNO = 0;

    constructor() {}

    public static initialize(): void {

    }

    public cleanUp(): void {}
}
