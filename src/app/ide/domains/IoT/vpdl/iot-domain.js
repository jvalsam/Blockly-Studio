import {
    DefineVPLDomainElements
} from '../../../domain-manager/administration/vpl-domain-elements';
import {
    getPredefinedCategories,
    defineGeneralCategories
} from '../../../domain-manager/common/general-blockly-toolbox';

import { SmartObject } from './domain-elems/smart-object';
import {
    SmartObjectsTask as SmartObjectsTaskElem
} from './domain-elems/smart-objects-task';

import { SmartObjectsTask } from './missions/smart-objects-task';
import { SmartObjectTask } from './project-items/smart-object/smart-object';

let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
    DefineVPLDomainElements(
        'IoT',
        () => ({
            domainElements: [
                SmartObject,
                SmartObjectsTaskElem,
            ],
            editorConfigs: [
                SmartObjectsTask
                //SmartObjectConditionEvent,
                //SmartObjectCalendarEvent
            ],
            projectItems: [
                SmartObjectTask
            ]
        })
    );
}