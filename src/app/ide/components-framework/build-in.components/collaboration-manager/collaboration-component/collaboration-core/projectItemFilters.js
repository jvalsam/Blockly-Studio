var Settings = {
    general: {
        "realTimeSyncing":rts
    },
    projectItems: {
        "allowMembersToCreateProjectItems":amtcpri,
        "requestForTheCreationOfProjectItems":rftcopi,
        "allowMembersToMakeVisualCodeSuggestions":amtmvcs,
        "allowMembersToMakeNotes":amtmn,
        "startAsTheOwnerOfAllSharedItems":satooasi,
        "allowMembersToRequestForOwnership":amtrfo
    },
    personalItems: {
        "allowMembersToCreatePersonalItems":amtcpei,
        "allowMembersToSeeOthersPersonalItems":amtsopi,
        "allowMembersToShareTheirPersonalItems":amtstpi,
        "allowMembersToMakeVisualCodeSuggestions":amtmvcs2,
        "allowMembersToMakeNotes":amtmn2
    }

}


export function filterProjectItem(pItem){
    if(pItem.owner != collabInfo.myInfo.name){
        pItem.privileges.readOnly = true;
    }
    
    
    
    return pItem;
}
