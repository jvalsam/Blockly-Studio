﻿/**
 *  Holders - Holds components and data are registered in IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 * 
 * updated by jvalsam: DataLoader for DB data are retrieved
 * August 2018
 */

import { ComponentSignal, ComponentSignalData } from './component/component-signal';
import { ComponentFunction } from './component/component-function';
import { ApplicationModel } from "../shared/models/application.model";
import { MapHolder } from '../shared/map-holder';
import { ProjectManagerMetaDataHolder } from './build-in.components/project-manager/project-manager-meta-map';
import { assert } from '../shared/ide-error/ide-error';
import * as _ from "lodash";


export interface FuncsMap {
  [funcName: string]: ComponentFunction;
}

export interface FuncsCompsMap {
  [funcName: string]: Array<ComponentFunction>;
}

/**
 * Map: key => Component Name, value => Array of ComponentSignals
 */
export let SignalsHolder =
  new MapHolder<Array<ComponentSignal>>("ComponentSignal");


export let SignalListenersHolder =
  new MapHolder<ComponentSignalData>("SignalListeners");

/**
 * Map: key => Component Name, value =>Map of functions are exported
 */
export let FunctionsHolder =
  new MapHolder<FuncsMap>("ComponentFunction");

/**
 * Map: key => Component Name, value =>Map of functions are exported
 */
export let RequiredFunctionsHolder =
  new MapHolder<FuncsCompsMap>("ComponentRequiredFunction");

/**
 * Map: key => Application ID, value =>ApplicationModel
 */
export let ApplicationsHolder =
new MapHolder<ApplicationModel>("ApplicationModel");

class _EditorDataHolder {
  private _editors: { [name: string] : Array<String> };

  constructor() {
    this._editors = {};
  }

  public initialize(): void {

  }

  public addMission(editor: string, mission: string) {
    assert(editor in this._editors, "Invalid, there is not defined editor with name "+editor+". <EditorDataHolder>");
    this._editors[editor].push(mission);
  }

  public removeMission(editor: string, mission: string) {
    assert(editor in this._editors, "Invalid, there is not defined editor with name "+editor+". <EditorDataHolder>");
    _.remove(this._editors[editor], (editorMission) => { return editorMission === mission; });
  }

  public setMissions(editor: string, missions: Array<string>) {
    this._editors[editor] = missions;
  }

  public getEditors(mission: string): Array<string> {
    let editors = [];
    _.forEach(this._editors, (missions, editor) => {
        if (_.indexOf(missions, mission) > -1) {
          editors.push(editor);
        }
    });
    return editors;
  }
}

export let EditorDataHolder = new _EditorDataHolder();

export class DataLoader {
  public static start(callback: Function) {
    ProjectManagerMetaDataHolder.load(callback);
  }
}