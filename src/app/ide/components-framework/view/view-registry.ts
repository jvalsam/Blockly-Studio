/**
 * ViewRegistry - Map Holder of ViewEntry
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import { View } from './view';
import { ViewEntry } from './view-entry';

interface MapViewEntry {
  [compName: string]: ViewEntry;
}

class _ViewRegistry {
  private _viewsEntry: MapViewEntry;

  constructor() {
    this._viewsEntry = {};
  }

  public initialize() {}

  public getViewEntry(viewName: string): ViewEntry {
     return this._viewsEntry[viewName];
   }

   public hasViewEntry(viewName: string) {
     return viewName in this._viewsEntry;
   }

   public createViewEntry(
     viewName: string,
     selector: string,
     templateHTML: string,
     create: Function,
     initData?: Array<any>
    ): ViewEntry {
      this._viewsEntry[viewName] = new ViewEntry (viewName, create, initData);
      const args: any[] = initData ? [selector, templateHTML, ...initData] : [selector, templateHTML];
      this._viewsEntry[viewName].setArgs(args);
     return this._viewsEntry[viewName];
   }

   public destroyBlackboard(compName: string) {
     delete this._viewsEntry[compName];
   }
}

export let ViewRegistry = new _ViewRegistry();