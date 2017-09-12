/**
 *  Holders - Holds components and data are registered in IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { Component } from './component';
import { ComponentSignal, ComponentSignalData } from './component-signal';
import { ComponentFunction } from './component-function';

import { MapHolder } from '../shared/map-holder';


export interface FuncsMap {
  [funcName: string]: ComponentFunction;
}


/**
 * Map: key => Component Name, value => Array of ComponentSignals
 */
export let SignalsHolder =
  new MapHolder<Array<ComponentSignal>>('ComponentSignal');


export let SignalListenersHolder =
  new MapHolder<ComponentSignalData>('SignalListeners');

/**
 *Map: key => Component Name, value =>Map of functions are exported
 */
export let FunctionsHolder =
  new MapHolder<FuncsMap>('ComponentFunction');

/**
 *Map: key => Component Name, value =>Map of functions are exported
 */
export let RequiredFunctionsHolder =
  new MapHolder<FuncsMap>('ComponentRequiredFunction');

