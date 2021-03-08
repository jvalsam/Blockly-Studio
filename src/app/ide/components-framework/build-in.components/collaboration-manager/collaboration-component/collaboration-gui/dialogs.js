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
                setUpSuggestionOnClick(collaborationUI["ui"]);
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

function setUpSuggestionOnClick(ui){
    ui.setOnClickSuggestionCb((node, {suggestionId, pItemID}) => {
        new ViewSuggestionPopup(
            $suggestionContainer, 
            pItemID,
            [],
            '',
            (popup) => {
                collabPlugin.openPItemOnDialogue(
                    popup.getLeftContainerSelector(),
                    pItemID,
                    false,
                    false,
                    {
                        height: -8,
                        width: 0,
                        top: 182,
                        left: 290,
                        zIndex: 99999999999999999999
                    },
                    suggestionId
                );
                collabPlugin.openPItemOnDialogue(
                    popup.getRightContainerSelector(),
                    pItemID,
                    true,
                    false,
                    {
                        height: -10,
                        width: 0,
                        top: 184,
                        left: 290,
                        zIndex: 99999999999999999999
                    }
                );

                let closeDialog = () => {
                    popup.closePopup();
                }
                popup.setOnYesCb(() => {
                    collabPlugin.acceptSuggestion();
                    collabPlugin.closeSuggestion(
                        popup.getFileId(), 
                        popup.getLeftContainerSelector(),
                        popup.getRightContainerSelector(),
                        closeDialog
                    );
                });
                popup.setOnNoCb(() => {
                    collabPlugin.denySuggestion();
                    collabPlugin.closeSuggestion(
                        popup.getFileId(), 
                        popup.getLeftContainerSelector(),
                        popup.getRightContainerSelector(),
                        closeDialog
                    );
                });
                popup.setOnClickX( () => {
                    collabPlugin.closeSuggestion(
                        popup.getFileId(),
                        popup.getLeftContainerSelector(),
                        popup.getRightContainerSelector(),
                        closeDialog
                    );
                });
            }
        );
    });
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
            collabPlugin.openPItemOnDialogue(
                popup.getLeftContainerSelector(),
                pitemID,
                false,
                false,
                {
                    height: -8,
                    width: 0,
                    top: 182,
                    left: 290,
                    zIndex: 99999999999999999999
                });
            collabPlugin.openPItemOnDialogue(
                popup.getRightContainerSelector(),
                pitemID,
                true,
                true,
                {
                    height: -10,
                    width: 0,
                    top: 184,
                    left: 290,
                    zIndex: 99999999999999999999
                });

            let closeDialog = () => {
                popup.closePopup();
            }
            popup.setOnYesCb(() => {
                collabPlugin.saveSuggestion(
                    popup.getFileId(),
                    popup.getLeftContainerSelector(),
                    popup.getRightContainerSelector(),
                    closeDialog
                );
            });
            popup.setOnNoCb(() => {
                collabPlugin.closeSuggestion(
                    popup.getFileId(), 
                    popup.getLeftContainerSelector(),
                    popup.getRightContainerSelector(),
                    closeDialog
                );
            });
            popup.setOnClickX( () => {
                collabPlugin.closeSuggestion(
                    popup.getFileId(),
                    popup.getLeftContainerSelector(),
                    popup.getRightContainerSelector(),
                    closeDialog
                );
            });
        }
    );
}

export function createSuggestionOnToolbar(
    {ui}, 
    {
        pItemID, 
        suggestionID, 
        user, 
        renderInfo
    }
){
    ui.addSuggestionAnnotation(
        user.name, 
        {
            icon: renderInfo[0].value, 
            name: renderInfo[1].value.text
        },
        {
            suggestionID,
            pItemID
        }
    )
}

export function logCreatePItem({ui}, {user,renderInfo}) {
    // pushFrontAction(member, file, actionColor, actionType, actionTime){
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, {icon: renderInfo[0].value, name: renderInfo[1].value.text}, '#FFFDE7', 'Created', time);
}

export function logUserJoined({ui}, {user}) {
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, null, '#D4FFDE', 'Joined the project', time);
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

                    setUpSuggestionOnClick(collaborationUI["ui"]);
                });
                return collaborationUI;
            });
        };

        let popup = new JoinPopup($dialog);
        popup.setOnJoinCb(boundOnSuccess);
        popup.setOnCloseCb(onFailure);

        return collaborationUI;
}