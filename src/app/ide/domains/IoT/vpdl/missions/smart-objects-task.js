export const SmartObjectsTask =
{
    name: 'smart-objects-task',
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
            name: 'Tasks',
            type: 'Category',
            colour: '236',
            elements: [
                {
                    name: {
                        domainElem: 'smart-objects-task',
                        item: 'run_task'
                    },
                    type: 'Element'
                }
            ]
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
                                domainElem: 'SmartObject'
                            },
                            type: 'Category',
                            elements: 'ALL' // Array of objects to select
                        }
                    ]
                }
                // ,
                // {
                //     name: 'Set Values',
                //     type: 'Category',
                //     colour: '120',
                //     elements: [
                //         {
                //             name: {
                //                 domainElem: 'SmartObject'
                //             },
                //             type: 'Category',
                //             elements: 'ALL' // Array of objects to select
                //         }
                //     ]
                // }
            ]
        }
    ],
    // at least one editor handles the mission
    // in case of more the end-user choose which
    // this action does not include undo (converter is required)
    editors: [
        {
            name: 'BlocklyVPL',
            src: ``
        }
    ]
};
