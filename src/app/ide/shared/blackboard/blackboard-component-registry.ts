/**
 * BlackboardRegistry Map of ComponentsBlackBoard
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { BlackboardComponent, BlackboardId } from './blackboard-component';

interface Blackboards {
  [id: string]: BlackboardComponent;
}

class _BlackboardComponentRegistry {
  private _blackboards: Blackboards;

  constructor() {
    this._blackboards = {};
  }

   public getBlackboard(id: BlackboardId) {
     return this._blackboards[id];
   }

   public hasBlackboard(id: BlackboardId) {
     return id in this._blackboards;
   }

   public createBlackboard(id: BlackboardId) {
     this._blackboards[id] = new BlackboardComponent(id);
   }

   public destroyBlackboard(id: BlackboardId) {
     delete this._blackboards[id];
   }
}

export let BlackboardComponentRegistry = new _BlackboardComponentRegistry();
