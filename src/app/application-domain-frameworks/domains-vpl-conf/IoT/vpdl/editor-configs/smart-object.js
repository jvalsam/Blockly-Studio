export const SmartObject =
{
    name: 'ec-smart-object',
    items: [
        // configurate toolbar if exist
    ],
    // at least one editor handles the mission
    // in case of more the end-user choose which
    // this action does not include undo (converter is required)
    // defined which are the domain element types are able to be exported in this visual source
    handledDomainElems: [
        'SmartObject'
    ],
    editors: [
        {
            name: 'SmartObjectVPLEditor',
            src: ``
        }
    ]
};
