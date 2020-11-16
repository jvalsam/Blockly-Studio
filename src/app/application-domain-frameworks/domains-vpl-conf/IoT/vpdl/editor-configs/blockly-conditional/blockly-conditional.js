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
        }
        // ,
        // {
        //     name: 'Smart Objects',
        //     type: 'Category',
        //     colour: '210',
        //     elements: [
        //         {
        //             name: 'Smart Objects',
        //             type: 'Category',
        //             colour: '225',
        //             elements: [
        //                 {
        //                     name: {
        //                         domainElem: 'SmartObject'
        //                     },
        //                     type: 'Category',
        //                     elements: [
        //                         'smart-object-obs-condition',
        //                         'smart-object-obs-condition-and',
        //                         'smart-object-obs-condition-or',
        //                     ]
        //                 }
        //             ]
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
