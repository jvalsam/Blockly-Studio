
export class Domain {
    private blockly: any;
    private VPLEditors: Array<any>;
    private projectManager: any;

    constructor(
        private name: String,
        private description: String,
        private imagePath: String
    ) {
        this.VPLEditors = [];
    }

    
}
