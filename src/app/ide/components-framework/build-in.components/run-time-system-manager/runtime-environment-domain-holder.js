/**
 * Auto-generated holder for the domain authored runtime environment view
 */

import {
    ThirdPartyLibsList as ThirdPartyLibsListIoT,
    ThirdPartyStylesList as ThirdPartyStylesListIoT
} from "../../../../application-domain-frameworks/domains-vpl-conf/IoT/execution/third-party-libs";


class _RuntimeEnvironmentDomainHolder {
    constructor() {
        this.thirdPartyLibsMap = {};
        this.thirdPartyLibsMap["IoT"] = ThirdPartyLibsListIoT;

        this.thirdPartyStylesMap = {};
        this.thirdPartyStylesMap["IoT"] = ThirdPartyStylesListIoT;
    }

    getDialogueView(domain) {
        
    }

    getThirdPartyLibs(domain) {
        return this.thirdPartyLibsMap[domain]();
    }

    getCSSLibs(domain) {
        return this.thirdPartyStylesMap[domain]();
    }
}

export const RuntimeEnvironmentDomainHolder = new _RuntimeEnvironmentDomainHolder();