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
            name: 'Conditional',
            type: 'DomainStatic',
            colour: '75',
            elements: [
                'Conditional_When',
                'Conditional_When_Top_Bottom',
                'so_logical_operators',
                'so_relational_operators',
                'so_changes',
            ]
        },
        {
            type: 'Separator',
            gap: '200'
        },
        {
            name: 'Smart Objects',
            type: 'Category',
            colour: '210',
            elements: [
                {
                    name: 'Get Values',
                    type: 'Category',
                    colour: '60',
                    elements: [
                        {
                            name: {
                                domainElem: 'SmartObject',
                                item: 'getValueBlock'
                            },
                            type: 'Element'
                        }
                    ]
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
