export const BlocklySimple = {
    name: 'pi-blockly-simple',
    editorsConfig: [
        'ec-blockly-simple'
    ],
    // Editor Layout handles to render and load the respective template
    // and inject the editor parts of the project item
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