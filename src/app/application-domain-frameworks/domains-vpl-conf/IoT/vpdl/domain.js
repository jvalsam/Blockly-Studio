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

import { SmartGroup as SmartGroupConf } from './editor-configs/smart-group';
import { SmartGroup as SmartGroupPI } from './project-items/smart-group/smart-group';

import {
    BlocklyConditional as BlocklyConditionalConf
} from './editor-configs/blockly-conditional/blockly-conditional';
import {
    BlocklyConditional as BlocklyConditionalPI
} from './project-items/blockly-conditional/blockly-conditional';

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
                SmartObjectConf,
                SmartGroupConf,
                BlocklyConditionalConf
            ],
            projectItems: [
                SmartObjectPI,
                SmartGroupPI,
                BlocklyConditionalPI
            ]
        })
    );
}