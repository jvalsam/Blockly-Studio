/**
 * ComponentEntry -
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Component } from './component';
import { ComponentSignal } from './component-signal';
import { IDEError } from '../../shared/ide-error';


export interface ComponentEntryInfo {
  name: string;
  description: string;
  version: string;
}

export class ComponentEntry {
  private _instanceList: Array<Component>;
  private _signalList: Array<string>;
  private _signalListensList: Array<ComponentSignal>;

  constructor(
    private readonly _compInfo: ComponentEntryInfo,
    private _creationFunc: any,
    private _args?: Array<any>,
    private _isUnique: boolean = false
  ) {
    this._instanceList = new Array<Component>();
    this._signalList = new Array<string>();
    this._signalListensList = new Array<ComponentSignal>();
  }

  get componentInfo(): ComponentEntryInfo { return this._compInfo; }

  public getInstances(): Array<Component> {
    return this._instanceList;
  }

  public hasInstance(): boolean {
    return this._instanceList.length > 0;
  }

  public setArgs(args: Array<any>) {
    this._args = args;
  }

  public isUnique(): boolean { return this._isUnique; }

  public create(): Component {
    if (this._isUnique && this._instanceList.length === 1) {
      return this._instanceList[0];
    }

    const newComp: Component = new (this._creationFunc) (this._compInfo.name, this._compInfo.description, ...this._args);
    this._instanceList.push(newComp);
    return newComp;
  }

  public destroy(comp: Component) {
    comp.destroy();
    const index = this._instanceList.indexOf(comp);
    if (index === -1) {
      IDEError.raise(
        ComponentEntry.name,
        'Try to remove component instance of ' + comp.name + ' ' + comp.id + '.'
      );
    }
    this._instanceList.splice(this._instanceList.indexOf(comp), 1);
  }
}