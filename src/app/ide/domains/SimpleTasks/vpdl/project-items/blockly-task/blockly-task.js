export const BlocklyTask = {
    name: 'pi-blockly-task',
    editorsConfig: [
        'ec-blockly-task'
    ],
    // Editor Layout handles to render and load the respective template
    // and inject the editor parts of the project item
    view: {
        template: "", // load template
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