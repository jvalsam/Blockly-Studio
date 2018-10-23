import { ComponentRegistry, ComponentEntry } from "./component-entry";
import {
    SignalsHolder,
    FunctionsHolder,
    RequiredFunctionsHolder
} from "../holders";
import { ComponentSignal } from "./component-signal";
import { IDEError } from "../../shared/ide-error/ide-error";
import { ComponentFunction } from "./component-function";
import { BlackboardComponentRegistry } from "../../shared/blackboard/blackboard-component-registry";

import * as _ from "lodash";


/**
 * Load IDE Components in ComponentRegistry using the Component
 *
 */

export interface IAuthorData {
    name: string;
    email: string;
    date?: string;
    workDescr?: string; // description of changes, refactoring, extensions etc
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

export interface ΙEditorData extends IUIComponentData {
    missions?: Array<any>; // fix me type of mission (model each mission static or not method)
}

function isIUIComponentData(data: IComponentData | IUIComponentData): data is IUIComponentData {
    return (<IUIComponentData>data).componentView !== undefined;
}


function checkIDEComponentValidityHelper(name: string, create: Function, data: IComponentData | IUIComponentData, funcNames: Array<string>=[]): void {
    if (ComponentRegistry.hasEntry(name)) {
        IDEError.raise(
            "DeclareIDEComponent",
            "Component " + name + " is already defined!"
        );
    }
    _.forEach (funcNames, (funcName:string) => {
        if (!create[funcName] && !create.prototype[funcName]) {
            IDEError.raise(
                "DeclareIDEComponent",
                "Component " + name + " has not defined static method " + funcName + "!"
            );
        }
    });
}

function checkIDEComponentValidity(name: string, create: Function, data: IComponentData | IUIComponentData): void {
    let funcNames = [];
    if (data.configDef && !(name === "IDEComponent" || name === "IDEUIComponent")) {
        funcNames.push("onChangeConfig");
    }
    checkIDEComponentValidityHelper(name, create, data, funcNames);
}

function checkIDEEditorValidity(name: string, create: Function, data: IComponentData | IUIComponentData): void {
    let funcNames = [];
    if (data.configDef) {
        funcNames.push("onChangeConfig");
    }
    if (data["missions"]) {
        _.forEach(data["missions"], (mission) => {
                funcNames.push(mission);
        });
    }
    checkIDEComponentValidityHelper(name, create, data, funcNames);
}

function configPropertiesInst (configData): Object {
    // TODO: apply json schema validator
    let configProperties: Object = {};
    _.forEach(configData.properties, (property) => {
        configProperties[property.name] = property.value;
    });
    return configProperties;
}

function declareComponentConfigProperties(create: Function, configData: any): void {
    if (typeof(configData) === "undefined") {
        return;
    }
    
    let configProperties;
    if (configData.properties) {
        configProperties = configPropertiesInst (configData);
    }
    else {
        configProperties = {};
        _.forEach(Object.keys(configData), (instType) => {
            configProperties[instType] = configPropertiesInst (configData[instType]);
        });
    }

    create["_configProperties"] = configProperties;
    create["getConfigProperties"] = function(instType?: string) { return instType ? this._configProperties[instType] : this._configProperties; };
    create["setConfigProperties"] = function (values: Object) {
        // if (typeof (this._configProperties) === "undefined") { this._configProperties = {}; }
        _.forOwn(values, (value, key) => {
            this._configProperties[key] = value;
        });
        for (let component of ComponentRegistry.getEntry(this.name).getInstances()) {
            component["_configProperties"] = this._configProperties;
            component["onChangeConfig"] (this._configProperties);
        }
    };
}

function registerIDEComponent (name: string, data: IComponentData | IUIComponentData, create: Function) {
    declareComponentConfigProperties(create, data.configDef);
    BlackboardComponentRegistry.createBlackboard(create.name);
    var initData = (data.initData) ? data.initData : [];

    var compEntry: ComponentEntry = ComponentRegistry.createEntry(
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
    return compEntry;
}

function declareIDEComponentHelper(data: IComponentData | IUIComponentData) {
    return (create: Function) => {
        let name: string = create["name"];
        checkIDEComponentValidity(name, create, data);
        registerIDEComponent(name, data, create);
    };
}

function declareIDEEditorHelper(data: ΙEditorData) {
    return (create: Function) => {
        let name: string = create["name"];
        checkIDEEditorValidity(name, create, data);
        let compEntry = registerIDEComponent(name, data, create);
        compEntry.setMissions(data.missions);
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

// Used as decorator, declares Platform Editor
export function PlatformEditorMetadata(data: ΙEditorData) {
    return declareIDEEditorHelper(data);
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

function FunctionHelper(component: string, funcName: string, argsLen: number, parent, method, isStatic=false) {
    let funcMap = FunctionsHolder.get(component);

    if (funcMap === null) {
        FunctionsHolder.put(component, {});
        loadParentElements('ExportedFunction', component, parent);
        funcMap = FunctionsHolder.get(component);
    }

    funcMap[funcName] = new ComponentFunction(component, funcName, argsLen, isStatic);
    FunctionsHolder.put(component, funcMap);
}

function RequiredFunctionHelper(componentDest: string, funcName: string, argsLen: number, isStatic: boolean, componentSrc: string, parent: string, method) {
    let funcMap = RequiredFunctionsHolder.get(componentSrc);

    if (funcMap === null) {
        RequiredFunctionsHolder.put(componentSrc, {});
        loadParentElements('RequiredFunction', componentSrc, parent);
        funcMap = RequiredFunctionsHolder.get(componentSrc);
    }

    if (!(funcName in funcMap)) {
        funcMap[funcName] = new Array<ComponentFunction>();
    }

    funcMap[funcName].push(new ComponentFunction(componentDest, funcName, argsLen, isStatic));
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

// function AddFunctionBodyFunctionality (propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>): void {
//     if (propertyKey === "updateConfigProperties") {
//         let method = descriptor.value;
//         descriptor.value = function () {
//             this.setConfigProperties(arguments[0]);
//             return method.apply(this, arguments);
//         };
//     }
// }

// Used as decorator
// publishes enabled functionality of the component
export function ExportedFunction(
    target: any,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>
) {
    // AddFunctionBodyFunctionality(propertyKey, descriptor);

    FunctionHelper(
        target.constructor.name,
        propertyKey,
        getParamNames(descriptor.value).length,
        target.__proto__.constructor.name,
        descriptor.value
    );
}

export function ExportedStaticFunction(
    target: any,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>
) {
    // AddFunctionBodyFunctionality(propertyKey, descriptor);

    FunctionHelper(
        target.constructor.name,
        propertyKey,
        getParamNames(descriptor.value).length,
        target.__proto__.constructor.name,
        descriptor.value
    );
}

export function ExportedFunctionAR(argsLenRestriction: boolean) {
    return (
        target: any,
        propertyKey: string,
        descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        FunctionHelper(
            target.constructor.name,
            propertyKey,
            argsLenRestriction ? getParamNames(descriptor.value).length : -1,
            target.__proto__.constructor.name,
            descriptor.value
        );
    }
}

// Used as decorator
// publishes required functionality (from other components) of the component
export function RequiredFunction(
    component: string,
    funcName: string,
    argsLen?: number,
    isStatic?: boolean
) {
    return (
        target: any,
        propertyKey: string,
        descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        RequiredFunctionHelper(
            component,
            funcName,
            argsLen,
            isStatic,
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

    public static registerFunction(
        component: string,
        parent: string,
        funcName: string,
        func: Function,
        argsLen: number
    ) {
        FunctionHelper(
            component,
            funcName,
            argsLen,
            parent,
            func
        );
    }

    public static registerRequiredFunction(
        componentDst: string,
        componentSrc: string,
        parent,
        funcName: string,
        func: Function,
        argsLen: number,
        isStatic: boolean
    ) {
        RequiredFunctionHelper(
            componentDst,
            funcName,
            argsLen,
            isStatic,
            componentSrc,
            parent,
            func
        );
    }
}

export class ComponentLoader {
    private static _requestedTemplatesNO = 0;

    constructor() {
    }

    public static initialize(): void {
    }

    public cleanUp(): void {
    }
}
