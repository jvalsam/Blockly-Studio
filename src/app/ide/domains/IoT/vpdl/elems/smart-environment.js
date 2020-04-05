export const SmartEnvironment = {
    name: 'SmartEnvironment',
    blocklyElems: [
        //TODO: define vpl elements
    ],
    signals: [
        {
            action: 'onCreate',
            name: 'create-smart-environment',
            provider: 'ViSmaOE'
        },
        {
            action: 'onDelete',
            name: 'delete-smart-environment',
            provider: 'ViSmaOE'
        },
        {
            action: 'onEdit',
            name: 'rename-smart-environment',
            provider: 'ViSmaOE'
        }
    ]
};