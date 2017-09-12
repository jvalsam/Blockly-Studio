/**
import { IDECore } from "./ide-core";
 * ComponentLoader - Construct each components instances
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * May 2017
 */

import { Component } from './component';
import { ComponentRegistry } from './component-registry';
import { IDECore } from './ide-core';


export class ComponentLoader {
    private static _requestedTemplatesNO = 0;

    constructor() {}

    get RequestedTemplatesNO() {
        return ComponentLoader._requestedTemplatesNO;
    }

    public static IncreaseRequestedTemplates() {
        ++ComponentLoader._requestedTemplatesNO;
    }
    
    public static DecreaseRequestedTemplates() {
        --ComponentLoader._requestedTemplatesNO;
        if (ComponentLoader._requestedTemplatesNO == 0) {
            IDECore.OnTemplatesLoadCompleted();
        }
    }

    public static Initialize(): void {}

    public CleanUp(): void {
        ComponentLoader._requestedTemplatesNO = 0;
    }
}
