
export class Domain {
    private blockly: any;
    private VPLEditors: Array<any>;
    private projectManager: any;

    constructor(
        private _name: String,
        private _description: String,
        private _imagePath: String
    ) {
        this.VPLEditors = [];
    }

    get name(): String {
        return this.name;
    }
}
