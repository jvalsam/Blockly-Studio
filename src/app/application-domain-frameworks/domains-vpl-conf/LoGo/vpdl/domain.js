import {
    DefineVPLDomainElements
} from '../../../../ide/domain-manager/administration/vpl-domain-elements';
import {
    getPredefinedCategories,
    defineGeneralCategories
} from '../../../../ide/domain-manager/common/general-blockly-toolbox';

let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
    // DefineVPLDomainElements( ... )
}