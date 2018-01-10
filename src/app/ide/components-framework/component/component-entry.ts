/**
 * ComponentEntry -
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Component } from "./component";
import { ComponentSignal } from "./component-signal";
import { Entry } from "../../shared/entry/entry";
import { IDEError } from "../../shared/ide-error/ide-error";

import * as _ from "lodash";


export interface ComponentEntryInfo {
  name: string;
  description: string;
  version: string;
}

export class ComponentEntry extends Entry<Component> {
  private _signalList: Array<string>;
  private _signalListensList: Array<ComponentSignal>;

  constructor(
    private readonly _compInfo?: ComponentEntryInfo,
    _creationFunc?: any,
    _args?: Array<any>,
    private _menuData?: any,
    private _configData?: any,
    private _isUnique: boolean = false
  ) {
    super(_compInfo.name, _creationFunc, _args);
    this._signalList = new Array<string>();
    this._signalListensList = new Array<ComponentSignal>();
  }

  get componentInfo(): ComponentEntryInfo { return this._compInfo; }

  public hasInstance(): boolean {
    return this._instanceList.length > 0;
  }

  public getMenuMetadata():any {
    return this._menuData;
  }

  public getConfigMetadata():any {
    return this._configData;
  }

  public getCurrentConfigValues(): any {
    return this._creationFunc.getConfigProperties();
  }

  public updateConfigValues(values: any): void {
    this._creationFunc.setConfigProperties(values);
    _.forEach(this._instanceList, (instance: any) => {
      instance.updateConfigProperties(values);
    });
  }

  public isUnique(): boolean { return this._isUnique; }

  public create(): Component {
    if (this._isUnique && this._instanceList.length === 1) {
      return this._instanceList[0];
    }

    const newComp: Component = new (this._creationFunc)(this._compInfo.name, this._compInfo.description, ...this._args);
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

export class _ComponentRegistry {
  private entries: { [name: string]: ComponentEntry };

  constructor() {
    this.entries = {};
  }

  public initialize() { }

  public getEntry(name: string): ComponentEntry {
    return this.entries[name];
  }

  public getEntries(): { [name: string]: ComponentEntry } {
      return this.entries;
  }

  public hasEntry(name: string): boolean {
    return name in this.entries;
  }

  public createEntry(
     compName: string,
     description: string,
     version: string,
     create: Function,
     initData?: Array<any>,
     menuData?: any,
     configData?: any,
     isUnique?: boolean
    ): ComponentEntry {
      this.entries[compName] = new ComponentEntry (
        { name: compName, description: description, version: version },
        create,
        initData,
        menuData,
        configData,
        isUnique
     );
     return this.entries[compName];
   }

  public destroyEntry(name: string) {
    delete this.entries[name];
  }
}

export let ComponentRegistry = new _ComponentRegistry();
