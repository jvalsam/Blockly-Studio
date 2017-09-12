/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * June 2017
 */

import { ComponentFunction, Argument, Type } from './component-function';
import { ComponentSignal } from './component-signal';
import {
  ComponentsCommunication,
  ExportedFunction
} from './components-communication';
import { ResponseValue } from './response-value';
import { IDEError } from '../shared/ide-error';


enum ComponentState {
  Loaded,
  Initialized
};

export abstract class Component {
  private static serialNoId = 0;
  private _children: Array<Component> = []; // support development of components
  private _parent: Component;          // that will share common UI containers

  private readonly _serialId: number;

  /**
   * Empty static function used and called by all Components OnInit of the IDE
   *
   * @static
   * @memberof Component
   */
  public static OnInit(): void {}

  constructor(
    protected readonly _name: string,
    protected readonly _description: string,
    protected _isActive: boolean = true,
    protected _isVisible: boolean = false
  ) {
    this._serialId = ++Component.serialNoId;
    // init maps
  }

  @ExportedFunction
  public Initialize(): void {
    // TODO: add initializations for components
  }

  // public abstract Create(args: Array<any>): Component;
  public abstract Destroy(): void;

  get name(): string { return this._name; }
  get serialNo(): number { return this._serialId; }
  get id(): string { return this._name + this._serialId; }

  public getComponentInfoMsg(): string {
    return '{' + this._name + ':' + this._serialId + '}';
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions to communicate with other IDE components

  protected postSignal(signal: string, argsList?: Array<any>) {
    ComponentsCommunication.PostSignal(this.name, signal, argsList);
  }

  protected requestFunction(componentName: string, funcName: string, args: Array<Argument>): ResponseValue {
    return ComponentsCommunication.FunctionRequest(this._name, componentName, funcName, args);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions are used by ComponentsCommunication

  public receiveFunctionRequest(funcName: string, argsList: Array<any>): ResponseValue {
    const reqFunction = this[funcName];
    if (!reqFunction) {
       IDEError.raise(
         Component.name,
         'Requested function ' + funcName + ' is not supported by',
         this.getComponentInfoMsg()
       );
     }
    const response = this[funcName](...argsList);
    return new ResponseValue (this.name, funcName, response);
  }

  public listenSignal(callback: string, signal: string, argsList?: Array<any>) {
    const func = this[callback];
    if (!func || !(typeof func === 'function')) {
      IDEError.raise(
        Component.name,
        'Signal ' + signal + ' is listened by component ' + this.name + '. Not found callback with name ' + callback
      );
    }
    func(argsList);
  }

  // Establishing Components Communication for Components that are developed in JS
  // Export
  protected addExportedFunction(parent: string, funcName: string, argsLen: number, func: Function) {
    ComponentsCommunication.RegisterFunction (
      this.name,
      parent,
      funcName,
      func,
      argsLen
    );
  }
  protected addExportedSignal(parent: string, signal: string, argList?: Array<any>, finalFunc?: string) {
    ComponentsCommunication.RegisterSignal (
      this.name,
      parent,
      signal,
      argList,
      finalFunc
    );
  }
  // Import
  protected addRequestedFunction(parent: string, funcName: string, func: Function, argsLen: number, componentName: string) {
    ComponentsCommunication.RegisterRequiredFunction (
      componentName,
      this.name,
      parent,
      funcName,
      func,
      argsLen
    );
  }
  protected addSignalListener(parent: string, signal: string, sourceComponent: string, callback: string) {
    ComponentsCommunication.RegisterListensSignal (
      this.name,
      parent,
      callback,
      signal,
      sourceComponent
    );
  }
}
