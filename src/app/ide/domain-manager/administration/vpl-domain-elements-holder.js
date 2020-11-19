

 
class _VPLDomainElementsHolder {
    constructor() {
        this._definedBlocksToVPLDomainElemsMap = {};
        this._signalsToLoadMap = []; // each item = {
                                     //     domainElemid: string,
                                     //     domainElemType: string,
                                     //     value: signalData }
    }

    getBlocksToDomainElemsMap() {
        return this._definedBlocksToVPLDomainElemsMap;
    }

    addDefinedBlock(vplDomainElem, blockType) {
        this._definedBlocksToVPLDomainElemsMap[blockType] = vplDomainElem;
    }

    addDefinedBlocks(vplDomainElem, blockTypes) {
        blockTypes.forEach(blockType => this.addDefinedBlock(vplDomainElem, blockType));
    }

    deleteDefinedBlock(blockType) {
        delete this._definedBlocksToVPLDomainElemsMap[blockType];
    }

    deleteDefinedBlocks(blockTypes) {
        blockTypes.forEach(blockType => this.deleteDefinedBlock(blockType));
    }

    // have to keep the add, edit signals...
    addSaveSignalData() {

    }

    deleteSaveSignalData() {

    }
}

export let VPLDomainElementsHolder = new _VPLDomainElementsHolder();