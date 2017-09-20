/**
import { IDECore } from "./ide-core";
 * ComponentLoader - Construct each components instances
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * May 2017
 */

import { Component } from './component';
import { ComponentRegistry } from './component-registry';
import { IDECore } from '../ide-core';


export class ComponentLoader {
    private static _requestedTemplatesNO = 0;

    constructor() {}

    public static initialize(): void {}

    public cleanUp(): void {}
}
