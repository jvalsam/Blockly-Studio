

 
class _VPLDomainElementsHolder {

    constructor() {
        this._VPLElemsHandlingBlocksMap = {};
        this._signalsToLoadMap = {}; // each data = {
                                     //     domainElemid: string,
                                     //     domainElemType: string,
                                     //     ...rest data }
        this._loadingMode = false;
        this._missionsToUpdate = {};
    }

    initialize(parent) {
        this._parent = parent;
    }

    initProject(projectId) {
        this._VPLElemsHandlingBlocksMap[projectId] = {};
        this._signalsToLoadMap[projectId] = [];
    }

    getProjectComponentsData(projectId) {
        return {
            VPLElemsHandlingBlocksMap: this._VPLElemsHandlingBlocksMap[projectId],
            signals: this._signalsToLoadMap[projectId]
        };
    }

    isOnLoadingMode() {
        return this._loadingMode;
    }

    setLoadingMode(mode) {
        this._loadingMode = mode;
    }

    loadProject(projectId, data) {
        this.initProject(projectId);
        // load blocks
        this._VPLElemsHandlingBlocksMap[projectId] = data.VPLElemsHandlingBlocksMap;
        // signals
        this._signalsToLoadMap[projectId] = data.signals;
    }

    getBlocksToDomainElemsMap(projectId) {
        return this._VPLElemsHandlingBlocksMap[projectId];
    }

    getSignalsData(projectId) {
        return this._signalsToLoadMap[projectId];
    }

    addDefinedBlock(projectId, vplDomainElem, blockType) {
        this._VPLElemsHandlingBlocksMap[projectId][blockType] = vplDomainElem;
    }

    addDefinedBlocks(projectId, vplDomainElem, blockTypes) {
        blockTypes.forEach(blockType => this.addDefinedBlock(projectId, vplDomainElem, blockType));
    }

    deleteDefinedBlock(projectId, blockType) {
        if (this._VPLElemsHandlingBlocksMap[projectId][blockType]) {
            delete this._VPLElemsHandlingBlocksMap[projectId][blockType];
        }
    }

    deleteDefinedBlocks(projectId, blockTypes) {
        blockTypes.forEach(blockType => this.deleteDefinedBlock(projectId, blockType));
    }

    // handle save load system for the projects

    receiveSignal_onCreate(projectId, signal, data) {
        let dbData = {
            signal: signal,
            data: JSON.parse(JSON.stringify(data))
        };

        this._signalsToLoadMap[projectId].push(dbData);
    }

    receiveSignal_onDelete(projectId, signal, data) {
        let index = this._signalsToLoadMap[projectId]
            .findIndex(x => x.data.domainElementId === data.domainElementId
                            && x.data.domainElementType === data.domainElementType);
        
        this._signalsToLoadMap[projectId].splice(index, 1);
    }

    receiveSignal_onEdit(projectId, signal, data) {
        let index = this._signalsToLoadMap[projectId]
            .findIndex(x => x.data.domainElementId === data.domainElementId
                            && x.data.domainElementType === data.domainElementType);
        this._signalsToLoadMap[projectId][index].data = data;
    }

    receiveSignal(projectId, signal, data) {
        if (!this.isOnLoadingMode()) {
            this['receiveSignal_' + signal.actionName](projectId, signal.signalName, data);
            this._parent.saveProjectComponentData(
                projectId,
                this.getProjectComponentsData(projectId));
        }
    }

    bookMissionToUpdate(mission, callback) {
        this._missionsToUpdate[mission] = callback;
    }

    updateToolboxesAndRemove() {
        for (const elem in this._missionsToUpdate) {
            this._missionsToUpdate[elem] ();
            delete this._missionsToUpdate[elem];
        }
    }
}

export let VPLDomainElementsHolder = new _VPLDomainElementsHolder();