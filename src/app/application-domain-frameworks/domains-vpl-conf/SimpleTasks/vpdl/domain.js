import {
    DefineVPLDomainElements
} from '../../../../ide/domain-manager/administration/vpl-domain-elements';
import {
    getPredefinedCategories,
    defineGeneralCategories
} from '../../../../ide/domain-manager/common/general-blockly-toolbox';

import {
    BlocklyTask as BlocklyTaskElem
} from './domain-elems/blockly-task';
import {
    BlocklyTask
} from './editor-configs/blockly-task';
import {
    BlocklySimple
} from './project-items/blockly-simple/blockly-simple';
import {
    BlocklyTask as BlocklyTask_PI
} from './project-items/blockly-task/blockly-task';

let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
    DefineVPLDomainElements(
        'SimpleTasks',
        () => ({
            domainElements: [
                BlocklyTaskElem
            ],
            domainStaticElements: [],
            editorConfigs: [
                BlocklyTask
            ],
            projectItems: [
                BlocklyTask_PI,
                BlocklySimple
            ]
        })
    );
}