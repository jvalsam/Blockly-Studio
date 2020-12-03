
export class ProjectItemICS {
    constructor(pitemId, editorsData) {
        this.pitemId = pitemId;
        this.originalEditorsData = editorsData;
        this.correctionSuggestions = [];

        // latest correction suggestion asked to render
        this.currentCOSUName = null;
    }

    addCorrection(name, description, memberInfo, date, editorsData) {
        this.correctionSuggestions.push({
            name: name,
            description: description,
            memberInfo: memberInfo,
            date: date,
            editorsData: editorsData
        });
    }

    removeCorrection(name) {
        this.correctionSuggestions.remove(cs => cs.name === name);
    }

    updateCorrectionSuggestion(correctionSuggestion) {
        const index = this.correctionSuggestions.findIndex(
            cosu => cosu.name === correctionSuggestion.name);
        
        this.correctionSuggestions[index] = correctionSuggestion;
    }

    openCorrectionSuggestion(name) {
        this.currentCOSUName = name;
        return this.getCurrentEditorsData();
    }

    getCurrentEditorsData() {
        if (this.currentCOSUName) {
            return this.correctionSuggestions.find(this.currentCOSUName);
        }
        else {
            return this.originalEditorsData;
        }
    }
}
