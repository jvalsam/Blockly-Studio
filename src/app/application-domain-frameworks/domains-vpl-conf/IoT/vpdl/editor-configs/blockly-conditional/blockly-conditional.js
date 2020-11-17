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
            name: 'Conditional',
            type: 'Category',
            colour: '75',
            elements: [
                {
                    name: {
                        domainElem: 'SmartObject',
                        item: 'Conditional_When'
                    },
                    type: 'Element'
                },
                {
                    name: {
                        domainElem: 'SmartObject',
                        item: 'Conditional_When_Top_Bottom'
                    },
                    type: 'Element'
                },
                {
                    name: {
                        domainElem: 'SmartObject',
                        item: 'so_logical_operators'
                    },
                    type: 'Element'
                },
                {
                    name: {
                        domainElem: 'SmartObject',
                        item: 'so_relational_operators'
                    },
                    type: 'Element'
                },
                {
                    name: {
                        domainElem: 'SmartObject',
                        item: 'so_changes'
                    },
                    type: 'Element'
                }
            ]
        }
        // error in toolbox
        // ,
        // {
        //     name: 'Smart Objects',
        //     type: 'Category',
        //     colour: '236',
        //     elements: [
        //         {
        //             name: {
        //                 domainElem: 'SmartObject',
        //                 item: 'getValue'
        //             },
        //             type: 'Element'
        //         }
        //     ]
        // }
    ],
    editors: [
        {
            name: 'BlocklyVPL',
            src: ``,
            style: []
        }
    ]
};
