/**
 * ComponentEntry -
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Component } from "./component";
import { ComponentSignal } from "./component-signal";
import { Entry } from "../../shared/entry/entry";
import { IDEError, assert } from "../../shared/ide-error/ide-error";

import * as _ from "lodash";
import { IDEUIComponent } from "./ide-ui-component";


export interface ComponentEntryInfo {
  name: string;
  description: string;
  version: string;
}

export class EditorDataHolder {
  private static _editors: { [name: string] : Array<String> };

  public static initialize(): void {
    this._editors = {};
  }

  public static addMission(editor: string, mission: string) {
    assert(editor in this._editors, "Invalid, there is not defined editor with name "+editor+". <EditorDataHolder>");
    this._editors[editor].push(mission);
  }

  public static removeMission(editor: string, mission: string) {
    assert(editor in this._editors, "Invalid, there is not defined editor with name "+editor+". <EditorDataHolder>");
    _.remove(this._editors[editor], (editorMission) => { return editorMission === mission; });
  }

  public static setMissions(editor: string, missions: Array<string>) {
    this._editors[editor] = missions;
  }

  public static getEditors(mission: string): Array<string> {
    let editors = [];
    _.forEach(this._editors, (missions, editor) => {
        if (_.indexOf(missions, mission) > -1) {
          editors.push(editor);
        }
    });
    return editors;
  }
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

  public getConfigMetadata(instType: string):any {
    return instType? this._configData[instType] : this._configData;
  }

  public getCurrentConfigValues(instType?: string): any {
    return this._creationFunc.getConfigProperties(instType);
  }

  public updateConfigValues(values: any): void {
    this._creationFunc.setConfigProperties(values);
  }
  
  ///// below methods are for visual editors only //////
  
  public setMissions(missions: Array<string>) {
    EditorDataHolder.setMissions(this.name, missions);
  }

  public addMission(mission: string) {
    EditorDataHolder.addMission(this.name, mission);
  }

  public removeMission(mission: string) {
    EditorDataHolder.removeMission(this.name, mission);
  }

  ///// above methods are for visual editors only //////

  public isUnique(): boolean { return this._isUnique; }

  public create(data?: Array<any>): Component;
  public create(data?: IDEUIComponent): Component;
  public create(data?: any): Component {
    if (this._isUnique && this._instanceList.length === 1) {
      return this._instanceList[0];
    }
    let args = this._args;
    if (data) {
      args = args.concat(data);
    }

    const newComp: Component = new (this._creationFunc)(this._compInfo.name, this._compInfo.description, this._html, ...args);
    if (this._creationFunc._configProperties) {
      newComp["_configProperties"] = this._creationFunc._configProperties;
      newComp["getConfigProperties"] = this._creationFunc.getConfigProperties;
      newComp["setConfigProperties"] = this._creationFunc.setConfigProperties;
    }
    newComp["_entry"] = this;
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
