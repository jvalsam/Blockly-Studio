

 
class _VPLDomainElementsHolder {
    constructor() {
        this._definedBlocksToVPLDomainElemsMap = {};
        this._signalsToLoadMap = []; // each data = {
                                     //     domainElemid: string,
                                     //     domainElemType: string,
                                     //     ...rest data }
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

    receiveSignal_onCreate(signal, data) {
        this._signalsToLoadMap.push(JSON.parse(JSON.stringify(data)));
    }

    receiveSignal_onDelete(signal, data) {
        let index = this._signalsToLoadMap.findIndex(x => x.domainElementId === data.domainElementId
            && x.domainElementType === data.domainElementType);
        
        this._signalsToLoadMap.splice(index, 1);
    }

    receiveSignal_onEdit(signal, data) {
        this.receiveSignal_onDelete(signal, data);
        this.receiveSignal_onCreate(signal, data);
    }

    receiveSignal(signal, data) {
        this['receiveSignal_' + signal.actionName](signal.signalName, data);
    }
}

export let VPLDomainElementsHolder = new _VPLDomainElementsHolder();