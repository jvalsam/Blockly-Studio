/**
 * ComponentViewRegistry - Map Holder of ViewEntry
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */


import { ComponentViewEntry } from "./component-view-entry";

interface MapComponentViewEntry {
  [compName: string]: ComponentViewEntry;
}

class _ComponentViewRegistry {
  private _compViewsEntry: MapComponentViewEntry;

  constructor() {
    this._compViewsEntry = {};
  }

  public initialize() {}

  public getEntry(viewName: string): ComponentViewEntry {
     return this._compViewsEntry[viewName];
   }

   public hasEntry(viewName: string): boolean {
     return viewName in this._compViewsEntry;
   }

   public createEntry(
     viewName: string,
     selector: string,
     templateHTML: string,
     create: Function,
     initData?: Array<any>
    ): ComponentViewEntry {
      this._compViewsEntry[viewName] = new ComponentViewEntry (viewName, create, initData);
      const args: any[] = initData ? [selector, templateHTML, ...initData] : [templateHTML];
      this._compViewsEntry[viewName].setArgs(args);
     return this._compViewsEntry[viewName];
   }

   public destroyEntry(compName: string) {
     delete this._compViewsEntry[compName];
   }
}

export let ComponentViewRegistry = new _ComponentViewRegistry();