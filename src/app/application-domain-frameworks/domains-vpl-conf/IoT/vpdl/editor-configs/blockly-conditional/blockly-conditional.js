export const BlocklyConditional = {
    name: 'ec-blockly-conditional-event',
    items: [
        {
            type: 'Predefined',
            elements: 'ALL', // select: [{category:'catName',elems:[...]}, ...]
            category: {
                name: 'Built-in',
                expanded: true
            }
        },
        {
            type: 'Separator',
            gap: '200'
        },
        {
            name: 'Smart Objects',
            type: 'Category',
            colour: '236',
            elements: [
                {
                    name: {
                        domainElem: 'SmartObject',
                        item: 'getValue'
                    },
                    type: 'Element'
                }
            ]
        }
    ],
    editors: [
        {
            name: 'BlocklyVPL',
            src: ``,
            style: []
        }
    ]
};
