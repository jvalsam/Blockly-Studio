import {
    VPLDomainElementHandler,
    VPLBlocklyElementHandler
} from './vpl-blockly-element';
import { VPLMission } from './vpl-mission';
import { VPLDomainElementsManager } from './vpl-domain-elements-manager';

export class VPLDomainElements {
    constructor(domain) {
        this.domain = domain;
        this.vplMissions = {};
        this.vplElems = {};
    }

    addElements(...vplElems) {
        vplElems.forEach(
            (vplElem) => this.vplElems[vplElem.name] =
                ('blocklyElems' in vplElem)
                    ? new VPLDomainElementHandler(
                        vplElem.name,
                        vplElem.blocklyElems,
                        vplElem.signals
                      )
                    : new VPLBlocklyElementHandler(
                                vplElem.name,
                                vplElem.init,
                                vplElem.codeGen,
                                vplElem.debGen
                      )
        );
    }

    get signals() {
        let listenSignals = {};

        for (let key in this.vplElems) {
            let vplElem = this.vplElems[key];
            
            if (vplElem.constructor === VPLDomainElementHandler) {
                for (let signal in vplElem.signals) {
                    if (!(signal in listenSignals)) listenSignals[signal] = [];

                    listenSignals[signal].push(
                        vplElem.signals[signal]
                    );
                }
            }
        }

        return listenSignals;
    }

    addMissions(...vplMissions) {
        vplMissions.forEach(
            (vplMission) => this.vplMissions[vplMission.name] =
                new VPLMission(
                    vplMission.name,
                    vplMission.items,
                    vplMission.editors,
                    this
                )
        );
    }

    getMission(mission) {
        return this.vplMissions[mission];
    }

    getVPLElement(element) {
        if (typeof element === 'object') {
            let domainElem = this.vplElems[element.domainElem];

            return element.item ?
                domainElem.getVPLElement(element.item) :
                domainElem;
        }

        // outer look of VPLElements
        if (element in this.vplElems) {
            return this.vplElems[element];
        }

        // inner lookup in VPLElements
        for (let key in this.VPLElems) {
            let vplElement = this.vplElems[key].getVPLElement(element);
            if (vplElement !== null) {
                return vplElement;
            }
        }

        // not found
        return null;
    }

    getDomainElementItems (name) {
        let domainElem = this.getVPLElement(name);

        return domainElem.vplBlocklyElems;
    }

    bookMission (mission, element) {
        this.getVPLElement(element).addMission(mission);
    }

    getToolbox(mission) {
        return this.vplMissions[mission].toolbox;
    }

    // TODO: call all elements and missions to unload
    unload() {

    }
}

/**
 * 
 * @param { Name of the domain } domain 
 * @param { Function without args that returns object of VPL 
 *          Domain Elements } elemsLoader
 */
export function DefineVPLDomainElements(domain, elemsLoader) {
    VPLDomainElementsManager.register(domain, elemsLoader);
}

/**
 * 
 * @param { Name of the domain } domain 
 * @param { Function without args that returns object of VPL 
 *          Domain Elements } elemsLoader
 */
export function LoadVPLDomainElements(domain, elemsLoader) {
    let vplDomainElemsData = elemsLoader();

    let vplDomainElems = new VPLDomainElements(domain);
    vplDomainElems.addElements(...vplDomainElemsData.elements);
    vplDomainElems.addMissions(...vplDomainElemsData.missions);

    return vplDomainElems;
}
