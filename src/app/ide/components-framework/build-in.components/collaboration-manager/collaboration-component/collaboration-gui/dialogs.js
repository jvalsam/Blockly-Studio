import {
        CollaborationSharePopup,
        CollaborationJoinPopup
    }
    from './CollaborationPopups'

import {
        CollaborationUI,
        CollaborationUI_API_Examples
    }
    from './CollaborationToolbar'

export function openStartSessionDialogue(
    collabPlugin,
    $popupContainer,   // jquery selector
    $toolbarContainer,
    onSuccess, // cb
    onFailure   // cb
    ) {
        let boundOnSuccess = function(name){
            onSuccess(name, {});
            collabPlugin.resizeToolbar($toolbarContainer, 350, function (){
                $(".project-manager-runtime-console-area").hide(); //fixme
                let collaborationUI = new CollaborationUI($toolbarContainer);
            });
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