import { collabInfo } from './utilities';

var Settings = {
    general: {
        "realTimeSyncing": "rts"
    },
    projectItems: {
        "allowMembersToCreateProjectItems": "amtcpri",
        "requestForTheCreationOfProjectItems": "rftcopi",
        "allowMembersToMakeVisualCodeSuggestions": "amtmvcs",
        "allowMembersToMakeNotes": "amtmn",
        "startAsTheOwnerOfAllSharedItems": "satooasi",
        "allowMembersToRequestForOwnership": "amtrfo"
    },
    personalItems: {
        "allowMembersToCreatePersonalItems": "amtcpei",
        "allowMembersToSeeOthersPersonalItems": "amtsopi",
        "allowMembersToShareTheirPersonalItems": "amtstpi",
        "allowMembersToMakeVisualCodeSuggestions": "amtmvcs2",
        "allowMembersToMakeNotes": "amtmn2"
    }

}

export function filterProjectItem(pItem){
    if(pItem.owner != collabInfo.myInfo.name){
        pItem.privileges.readOnly = true;
    }
    
    return pItem;
}

function fillPItemInfo(pItem){
    delete pItem.privileges;
    pItem.privileges = {};
    var tmpItem = {
        author: collabInfo.myInfo.name,
        owner: collabInfo.myInfo.name,
        shared: {
            type: "SHARED_PROJECT"
        },
        hidden: "false",
        readOnly: false
    }
    pItem.privileges = tmpItem;
    return pItem;
}