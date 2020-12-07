import {
    PItemCorrectionSuggestions
} from "./pitem-correction-suggestions";


export function CorrectionSuggestionsManager(project, collabDebugInst) {
    this.onFocusPItem = null;
    this.collabDebugInst = collabDebugInst;
    // each pitem has correction suggestions handling
    this.projectItemsCSM = {};

    project.projectItems.forEach(pitem => {
        this.projectItemsCSM[pitem.systemID] =
            new PItemCorrectionSuggestions(
                pitem.systemID,
                pitem.editorsData,
                collabDebugInst);
    });

    this.loadCorrectionSuggestions = (correctionSuggestions) => {
        correctionSuggestions.forEach(correction => {
            
        });
    }

    if (project.componentsData
        && project.componentsData.CollaborativeDebugging
        && project.componentsData.CollaborativeDebugging.correctionSuggestions
    ) {
        this.loadCorrectionSuggestions(
            project.componentsData.CollaborativeDebugging.correctionSuggestions
        );
    }
    
    this.onPItemChangeLocal = (pitemId, data) => {
        this.projectItemsCSM[pitemId].onChangeEditorsDataLocal(data);
    };

    this.onPItemChangeRemote = (pitemId, data) => {
        //handling based on the onFocusPItem

        this.projectItemsCSM[pitemId].onChangeEditorsDataLocal(data);
    };

    this.onCreateCorrection = (pitemId, name, description, authorInfo) => {
        this.projectItemsCSM[pitemId].onCreateCorrection(
            name,
            description,
            authorInfo);
    };
}
