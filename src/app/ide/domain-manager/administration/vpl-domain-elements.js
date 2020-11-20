import {
    VPLDomainElementHandler,
    VPLBlocklyElementHandler
} from './vpl-blockly-element';
import { VPLMission } from './vpl-mission';
import { VPLProjectItem } from './vpl-project-item';
import { VPLDomainElementsManager } from './vpl-domain-elements-manager';


export class VPLDomainElements {
    constructor(domain) {
        this.domain = domain;
        this.vplProjectItems = {};
        this.vplMissions = {};
        this.vplElems = {};
    }

    addElements(...vplElems) {
        vplElems.forEach(
            (vplElem) => {
                this.vplElems[vplElem.name] = ('blocklyElems' in vplElem)
                    ? new VPLDomainElementHandler(
                        vplElem.name,
                        vplElem.blocklyElems,
                        vplElem.signals
                      )
                    : new VPLBlocklyElementHandler(
                        {
                            blockDef: vplElem.init,
                            codeGen: vplElem.codeGen,
                            debGen: vplElem.debGen
                        },
                        vplElem.name
                      );
            }
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

    addEditorConfigs(...vplEditorConfigs) {
        vplEditorConfigs.forEach(
            (vplMission) => this.vplMissions[vplMission.name] =
                new VPLMission(
                    vplMission.name,
                    vplMission.items,
                    vplMission.handledDomainElems,
                    vplMission.editors,
                    this
                )
        );
    }

    addProjectItems(...vplProjectItems) {
        vplProjectItems.forEach(
            (vplPI) => this.vplProjectItems[vplPI.name] =
            new VPLProjectItem(
                vplPI.name,
                vplPI.editorsConfig,
                vplPI.view
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

    getProjectItemInfo(name) {
        if (name in this.vplProjectItems) {
            let info = {
                editorConfigs: {},
                view: this.vplProjectItems[name].view
            };

            this.vplProjectItems[name].editorsConfig.forEach(
                ec => info.editorConfigs[ec.config] = this.vplMissions[ec.config].editors
            );

            return info;
        }

        return null;
    }

    getProjectItemEditorsConfig(name) {
        if (name in this.vplProjectItems) {
            return this.vplProjectItems[name]._editorsConfig;
        }

        return null;
    }

    getEditors() {
        let editors = [];
        for (let mission of Object.keys(this.vplMissions)) {
            editors.push(...this.vplMissions[mission].getEditors());
        }
        return editors.filter((v, i, a) => a.indexOf(v) === i);
    }

    getEditorConfigs(editor) {
        let configs = {};
        for (let mission of Object.keys(this.vplMissions)) {
            let econfig = this.vplMissions[mission].getEditorConfig(editor);
            if (econfig) {
                configs[mission] = Object.assign({}, econfig);
            }
        }
        return configs;
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
    vplDomainElems.addElements(...vplDomainElemsData.domainElements);
    vplDomainElems.addEditorConfigs(...vplDomainElemsData.editorConfigs);
    vplDomainElems.addProjectItems(...vplDomainElemsData.projectItems);

    return vplDomainElems;
}
