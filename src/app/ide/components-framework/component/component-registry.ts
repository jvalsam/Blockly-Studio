/**
 * ComponentRegistry - Map Holder of ComponentEntry
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import { Component } from './component';
import { ComponentEntry } from './component-entry';
import { ComponentFunction } from './component-function';

interface MapComponentEntry {
  [compName: string]: ComponentEntry;
}

class _ComponentRegistry {
  private _componentsEntry: MapComponentEntry;

  constructor() {
    this._componentsEntry = {};
  }

  public initialize() {}

  public getComponentEntry(compName: string) {
     return this._componentsEntry[compName];
   }

   public hasComponentEntry(compName: string) {
     return compName in this._componentsEntry;
   }

   public createComponentEntry(
     compName: string,
     description: string,
     version: string,
     create: Function,
     initData?: Array<any>
    ): ComponentEntry {
      this._componentsEntry[compName] = new ComponentEntry (
        { name: compName, description: description, version: version },
        create,
        initData
     );
     return this._componentsEntry[compName];
   }

   public destroyBlackboard(compName: string) {
     delete this._componentsEntry[compName];
   }
}

export let ComponentRegistry = new _ComponentRegistry();
