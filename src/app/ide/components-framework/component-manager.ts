/**
 * ComponentManager - Handles components communication requests
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * May 2017
 */

import { Component } from './component';

class _ComponentManager {
    public PostSignal(c: Component, signal) { }
}

export let ComponentManager = new _ComponentManager();