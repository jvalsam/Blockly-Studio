export const BlocklySimple = {
    name: 'pi-blockly-simple',
    editorsConfig: [
        {
            selector: 'ec-blockly-simple',
            config: 'ec-blockly-simple'
        }
    ],
    // Editor Layout handles to render and load the respective template
    // and inject the editor parts of the project item
    handledDomainElems: [
    ],
    actionsHandling: {
        // call after fill-in data
        createPrevious: (pelem, onsuccess) => {
            onsuccess();
        },
        createAfter: (pelem, onsuccess) => {
            onsuccess();
        },
        // call before fill-in the data
        deletePrevious: (pelem, onsuccess) => {
            onsuccess();
        },
        deleteAfter: (pelem, onsuccess) => {
            onsuccess();
        },
        // call after fill-in data
        renamePrevious: (pelem, onsuccess) => {
            onsuccess();
        },
        renameAfter: (pelem, onsuccess) => {
            onsuccess();
        }
    },
    view: {
        tmpl: "", // load template
        events: [
            // data of one event:
            // {
            //     eventType: "click",
            //     selector: ".template-area",
            //     handler: (e) => {} // action will be handled on Editor Manager
            // }
        ]
    }
};