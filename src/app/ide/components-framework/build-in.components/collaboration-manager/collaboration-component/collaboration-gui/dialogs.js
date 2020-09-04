import {
        CollaborationSharePopup,
        CollaborationJoinPopup
    }
    from './CollaborationPopups'

import {
        CollaborationUI
    }
    from './CollaborationToolbar'

export function openStartSessionDialogue(
    $popupContainer,   // jquery selector
    $toolbarContainer,
    onSuccess, // cb
    onFailure   // cb
    ) {
        let boundOnSuccess = function(name){
            onSuccess(name, {});
            // let collaborationUI = new CollaborationUI($toolbarContainer); // todo
        }

        let sharePopup = new CollaborationSharePopup($popupContainer);
        sharePopup.setOnCloseCb(onFailure);
        sharePopup.setOnShareCb(boundOnSuccess);
        
        // onSuccess({
        //     name: sharePopup.getName(),
        //     icon: "myIcon"
        // },
        // {
        //     //TODO: return array of shared pitem ids
        // });
}

export function openJoinSessionDialogue(
    $dialog,   // jquery selector
    onSuccess, // cb
    onFailure   // cb
    ) {
        onSuccess({
            name: "a",
            icon: "myIcon"
        },"test");
}