

export class VPLProjectItem {
    constructor(
        name,
        editorsConfig,
        view,
        actionsHandling,
        handledDomainElems) {
        this._name = name;
        this._editorsConfig = editorsConfig;
        this._view = view;
        this._actionsHandling = actionsHandling;
        this._handledDomainElems = handledDomainElems;
    }

    get name() {
        return this._name;
    }

    get editorsConfig() {
        return this._editorsConfig;
    }

    get view() {
        return this._view;
    }

    get actionsHandling() {
        return this._actionsHandling;
    }

    get handledDomainElems() {
        return this._handledDomainElems;
    }
}