import { LoadVPLDomainElements } from './vpl-domain-elements';
import {
    ListensSignals
} from '../../components-framework/component/components-communication';

class _VPLDomainElementsManager {
    constructor() {
        this._domains = {};
        this._currVPLDomainElements = null;
        this._signalActions = {}
    }

    get name() {
        return 'VPLDomainElementsManager'
    }

    get data() {
        return this._currVPLDomainElements;
    }

    get signals() {
        return this._currVPLDomainElements.signals;
    }

    initialize() {
        
    }

    receiveSignal(signal, data) {
        let signals = this.signals;

        if (!(signal in signals)) {
            throw new Error(
                'Signal ' + signal +
                ' is not listened by the VPLDomainElementsManager.'
            );
        }

        signals[signal].forEach(elem => elem.action(data));
    }

    /**
     * VPLEditorsManager requests info for mission
     * @param {* string name of the mission } mission
     * @returns { name: '', editors: [], toolbox: '' }
     */
    getDataMission(name) {
        let mission = this._currVPLDomainElements.getMission(name);

        return {
            name: mission,
            editors: mission.editors,
            toolbox: mission.toolbox
        };
    }

    // TODO: populate the signals has to be received
    // notifies when vpl editor has new domain elements to add or remove

    register(domain, elems) {
        this._domains[domain] = elems;
    }

    load(domain, listensSignals) {
        if (this._currVPLDomainElements) this._currVPLDomainElements.unload();

        this._currVPLDomainElements = LoadVPLDomainElements(
            domain, this._domains[domain]
        );

        listensSignals(this.signals);
    }

    getToolbox(mission) {
        return this._currVPLDomainElements.getToolbox(mission);
    }

    updateToolbox(mission, toolbox, editors) {
        //function request of the editor handles the mission
        editors.forEach(editor => IDECore
            .functionRequest(
                editor.name,
                'onMissionUpdate',
                {
                    name: mission,
                    toolbox: toolbox
                },
                this.name
            ));
    }

    deleteVPLElements(elements, mission, editors) {
        editors.forEach(editor => IDECore
            .functionRequest(
                editor.name,
                'onDeleteVPLElements',
                {
                    mission: mission,
                    elements: elements
                },
                this.name
            ));
    }

    getProjectItemInfo(name) {
        return this._currVPLDomainElements.getProjectItemInfo(name);
    }

    getEditorConfigs(name) {
        return this._currVPLDomainElements.getEditorConfigs(name);
    }

    getEditors() {
        return this._currVPLDomainElements.getEditors();
    }
}

export const VPLDomainElementsManager = new _VPLDomainElementsManager();
