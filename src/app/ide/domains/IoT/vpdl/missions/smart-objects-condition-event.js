export const SmartObjectsConditionEvent = {
    name: 'smart-object-condition-event',
    items: [
        {
            name: 'Smart Objects',
            type: 'Category',
            colour: '210',
            elements: [
                {
                    name: 'Smart Objects',
                    type: 'Category',
                    colour: '225',
                    elements: [
                        {
                            name: {
                                domainElem: 'SmartObject'
                            },
                            type: 'Category',
                            elements: [
                                'smart-object-obs-condition',
                                'smart-object-obs-condition-and',
                                'smart-object-obs-condition-or',
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    editors: [
        {
            name: 'BlocklyEditor',
            src: ``
        }
    ]
};
