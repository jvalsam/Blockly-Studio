import { LoadVPLDomainElements } from './vpl-domain-elements';
import { IDECore } from '../../components-framework/ide-core';

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

        signals[signal].forEach(action => action(data));
    }

    // if there are signals already, updates the signals
    listenSignals() {
        IDECore.listensSignals(
            Object.keys(this.signals),
            this.name
        );
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

    load(domain) {
        if (this._currVPLDomainElements) this._currVPLDomainElements.unload();

        this._currVPLDomainElements = LoadVPLDomainElements(
            domain, this._domains[domain]
        );

        this.listenSignals();
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
}

export const VPLDomainElementsManager = new _VPLDomainElementsManager();
