import {
        SharePopup,
        JoinPopup
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
        let collaborationUI = {};
        let boundOnSuccess = function(name){
            collabPlugin.resizeToolbar($toolbarContainer, 350, function (){
                $(".project-manager-runtime-console-area").hide(); //fixme
                collaborationUI["ui"] = (new CollaborationUI($toolbarContainer));
            });
            onSuccess(name, {});
        }

        let sharePopup = new SharePopup($popupContainer);
        sharePopup.setOnCloseCb(onFailure);
        sharePopup.setOnShareCb(boundOnSuccess);
        
        // onSuccess({
        //     name: sharePopup.getName(),
        //     icon: "myIcon"
        // },
        // {
        //     //TODO: return array of shared pitem ids
        // });
        return collaborationUI;
}

export function openJoinSessionDialogue(
    $dialog,   // jquery selector
    onSuccess, // cb
    onFailure   // cb
    ) {
        let popup = new JoinPopup($dialog);
        popup.setOnJoinCb(onSuccess);
}