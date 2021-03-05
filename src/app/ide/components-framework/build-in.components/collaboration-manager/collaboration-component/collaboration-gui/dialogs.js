import { collabInfo } from '../collaboration-core/utilities';
import {
        SharePopup,
        JoinPopup,
        ViewSuggestionPopup,
        AuthorSuggestionPopup
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
        let boundOnSuccess = function(member){
            collabPlugin.resizeToolbar($toolbarContainer, 350, function (){
                $(".project-manager-runtime-console-area").hide(); //fixme
                collaborationUI["ui"] = (new CollaborationUI($toolbarContainer));
                collaborationUI["ui"].setOnToolbarMenuOpen( () => {
                    return {
                        member: {
                            name: collabInfo.myInfo.name,   //todo Katsa Need function for this
                            icon: collabInfo.myInfo.icon,   //todo Katsa Need function for this
                        },
                        link: collabPlugin.getInvitationCode(),
                        projectName: collabPlugin.shProject.description
                    }
                });
            });
            onSuccess(member, {});
        }

        let sharePopup = new SharePopup($popupContainer);
        sharePopup.setOnCloseCb(onFailure);
        sharePopup.setOnShareCb(boundOnSuccess);
        // collabPlugin.getInvitationCode();
        // onSuccess({
        //     name: sharePopup.getName(),
        //     icon: "myIcon"
        // },
        // {
        //     //TODO: return array of shared pitem ids
        // });
        return collaborationUI;
}

let $suggestionContainer =  $(
                                `<div style = "
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                "></div>`
                            );

$(document).ready(() => {
    $('body').append($suggestionContainer);
});

export function openSuggestionDialogue(collabPlugin, pitemID) {
    $suggestionContainer.empty();
    let popup = new AuthorSuggestionPopup(
        $suggestionContainer, 
        pitemID,
        (popup) => {
            collabPlugin.openPItemOnDialogue(popup.getLeftContainerSelector(), pitemID, false, false);
            collabPlugin.openPItemOnDialogue(popup.getRightContainerSelector(), pitemID, true, true);
        }
    );
}

export function openJoinSessionDialogue(
    collabPlugin,
    $dialog,   // jquery selector
    $toolbarContainer,
    onSuccess, // cb
    onFailure   // cb
    ) {
        let collaborationUI = {};
        let boundOnSuccess = function(name, link){
            onSuccess(name, link, ()=>{
                collabPlugin.resizeToolbar($toolbarContainer, 350, function (){
                    $(".project-manager-runtime-console-area").hide(); // fix me
                    $toolbarContainer = $($toolbarContainer);
                    collaborationUI["ui"] = new CollaborationUI($toolbarContainer);
                    
                    collaborationUI["ui"].setOnClickSuggestionCb( (node) => {
                        $suggestionContainer.empty();
                        new ViewSuggestionPopup($suggestionContainer, {name: 'something', icon: false}, [], 'comment');
                    });

                    collaborationUI["ui"].setOnToolbarMenuOpen( () => {    
                        return {
                            member: {
                                name: collabInfo.myInfo.name,   //todo Katsa Need function for this
                                icon: collabInfo.myInfo.icon,   //todo Katsa Need function for this
                            },
                            link: collabPlugin.getInvitationCode(),
                            projectName: collabPlugin.shProject.description
                        }
                    });
                });
                return collaborationUI;
            });
        };

        let popup = new JoinPopup($dialog);
        popup.setOnJoinCb(boundOnSuccess);
        popup.setOnCloseCb(onFailure);

        return collaborationUI;
}