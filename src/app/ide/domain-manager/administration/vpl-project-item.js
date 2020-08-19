

export class VPLProjectItem {
    constructor(name, editorsConfig, view) {
        this._name = name;
        this._editorsConfig = editorsConfig;
        this._view = view;
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

}