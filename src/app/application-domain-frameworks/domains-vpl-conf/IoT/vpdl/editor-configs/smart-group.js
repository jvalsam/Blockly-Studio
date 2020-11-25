export const SmartGroup =
{
    name: 'ec-smart-group',
    items: [
        // configurate toolbar if exist
    ],
    // at least one editor handles the mission
    // in case of more the end-user choose which
    // this action does not include undo (converter is required)
    handledDomainElems: [
        'SmartGroup'
    ],
    editors: [
        {
            name: 'SmartObjectVPLEditor',
            src: ``
        }
    ]
};
