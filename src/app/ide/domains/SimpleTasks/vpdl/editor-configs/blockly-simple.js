export const BlocklySimple = {
    name: 'ec-blockly-simple',
    items: [
        {
            type: 'Predefined',
            elements: 'ALL', // select: [{category:'catName',elems:[...]}, ...]
            category: {
                name: 'Built-in',
                expanded: true
            }
        }
    ],
    // at least one editor handles the mission
    // in case of more the end-user choose which
    // this action does not include undo (converter is required)
    editors: [{
        name: 'BlocklyVPL',
        src: ``,
        style: []
    }]
};
