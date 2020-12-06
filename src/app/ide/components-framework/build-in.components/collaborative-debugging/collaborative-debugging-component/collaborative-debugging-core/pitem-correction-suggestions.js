
export function PItemCorrectionSuggestions(
    pitemId,
    editorsData,
    collabDebugInst
) {
    this.pitemId = pitemId;
    this.originalEditorsData = editorsData;
    this.temporaryEditorsData = null;
    this.correctionSuggestions = [

    ];

    // latest correction suggestion asked to render
    this.currentCOSUName = null;

    this.addCorrection = (
        name,
        description,
        memberInfo,
        date,
        editorsData
    ) => {
        this.correctionSuggestions.push({
            name: name,
            description: description,
            memberInfo: memberInfo,
            date: date,
            editorsData: editorsData});
    };

    this.removeCorrection = (name) => {
        this.correctionSuggestions.remove(cs => cs.name === name);
    };

    this.updateCorrectionSuggestion = (correctionSuggestion) => {
        const index = this.correctionSuggestions.findIndex(
            cosu => cosu.name === correctionSuggestion.name);
        
        this.correctionSuggestions[index] = correctionSuggestion;
    };

    this.openCorrectionSuggestion = (name) => {
        this.currentCOSUName = name;
        return this.getCurrentEditorsData();
    };

    this.getCurrentEditorsData = () => {
        if (this.currentCOSUName) {
            return this.correctionSuggestions.find(this.currentCOSUName);
        }
        else {
            return this.originalEditorsData;
        }
    };

    this.onChangeEditorDataLocal = (editorsData) => {
        switch(this.currentCOSUName) {
            case 'ORIGINAL':
                break;
            case 'TEMPORARY':
                // do nothing
                break;
            default: // correction suggestion
                this.editorsData = editorsData;
                collabDebugInst.correctionSuggestionUpdated(
                    this.pitemId,
                    "src",
                    this.editorsData
                );
                break;
        }
    }

    this.onChangeEditorsData

    this.onReceiveUpdate = (type, data) => {
        switch(type) {
            case "src":
                // TODO: update data and sync UI
                break;
            default:
                break;
        }
    }
    

    this.createCorrectionSuggestion = () => {

    };

    this.deleteCorrectionSuggestion = () => {

    };

    this.updateCorrectionSuggestion = () => {

    };
}
