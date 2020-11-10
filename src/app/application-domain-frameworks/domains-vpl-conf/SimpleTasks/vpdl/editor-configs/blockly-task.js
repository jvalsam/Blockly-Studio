export const BlocklyTask =
{
    name: 'ec-blockly-task',
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
                        domainElem: 'de-blockly-task',
                        item: 'run_task'
                    },
                    type: 'Element'
                }
            ]
        }
    ],
    // at least one editor handles the mission
    // in case of more the end-user choose which
    // this action does not include undo (converter is required)
    editors: [
        {
            name: 'BlocklyVPL',
            src: ``,
            style: []
        }
    ]
};
