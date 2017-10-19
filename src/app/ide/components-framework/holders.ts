/**
 *  Holders - Holds components and data are registered in IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { Component } from './component/component';
import { ComponentSignal, ComponentSignalData } from './component/component-signal';
import { ComponentFunction } from './component/component-function';
import { ApplicationModel } from "../shared/models/application.model";

import { MapHolder } from '../shared/map-holder';


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