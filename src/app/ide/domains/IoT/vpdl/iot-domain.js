import {
    DefineVPLDomainElements
} from '../../../domain-manager/administration/vpl-domain-elements';
import {
    getPredefinedCategories,
    defineGeneralCategories
} from '../../../domain-manager/common/general-blockly-toolbox';

import { SmartObject } from './elems/smart-object';
import {
    SmartObjectsTask as SmartObjectsTaskElem
} from './elems/smart-objects-task';

import { SmartObjectsTask } from './missions/smart-objects-task';


let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
    DefineVPLDomainElements(
        'IoTAutomations',
        () => ({
            elements: [
                SmartObject,
                SmartObjectsTaskElem,
            ],
            missions: [
                SmartObjectsTask
                //SmartObjectConditionEvent,
                //SmartObjectCalendarEvent
            ]
        })
    );
}