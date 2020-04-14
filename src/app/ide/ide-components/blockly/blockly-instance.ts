
export class BlocklyConfig {
    public constructor(
        private _name: string,
        private _data: any) {
    }

    public get name() {
        return this._name;
    }

    public get data() {
        return this._data;
    }
}

export class BlocklyInstance {
    private wsp: any;

    constructor(
        private pitemId: string,
        private editorId: string,
        private config: BlocklyConfig,
        private selector: string,
        src: string
    ) {

    }
}
