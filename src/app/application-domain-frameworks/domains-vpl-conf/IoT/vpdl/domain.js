import {
    DefineVPLDomainElements
} from '../../../../ide/domain-manager/administration/vpl-domain-elements';
import {
    getPredefinedCategories,
    defineGeneralCategories
} from '../../../../ide/domain-manager/common/general-blockly-toolbox';

import { SmartObject as SmartObjectVPLElem } from './domain-elems/smart-object';
import { SmartObject as SmartObjectConf } from './editor-configs/smart-object';
import { SmartObject as SmartObjectPI } from './project-items/smart-object/smart-object';

let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
    DefineVPLDomainElements(
        'IoT',
        () => ({
            domainElements: [
                SmartObjectVPLElem
            ],
            editorConfigs: [
                SmartObjectConf
            ],
            projectItems: [
                SmartObjectPI
            ]
        })
    );
}