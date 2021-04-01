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
                setUpSuggestionOnClick(collaborationUI["ui"], collabPlugin);
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

function setUpSuggestionOnClick(ui, collabPlugin){
    ui.setOnClickSuggestionCb((node, {suggestionID, pItemID}) => {
        openViewSuggestionDialogue(collabPlugin, {suggestionID, pItemID});
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

function openViewSuggestionDialogue(collabPlugin, {suggestionID, pItemID}){
    new ViewSuggestionPopup(
        $suggestionContainer, 
        pItemID,
        [],
        collabPlugin.getSuggestionTitle(pItemID, suggestionID),
        collabPlugin.getSuggestionComment(pItemID,suggestionID),
        collabPlugin.amIAuthor(pItemID),
        (popup) => {
            collabPlugin.openPItemOnDialogue(
                popup.getLeftContainerSelector(),
                pItemID,
                false,
                false,
                {
                    height: -10,
                    width: 0,
                    top: 163,
                    left: 290,
                    zIndex: 73
                },
            );
            collabPlugin.openPItemOnDialogue(
                popup.getRightContainerSelector(),
                pItemID,
                true,
                false,
                {
                    height: -10,
                    width: 0,
                    top: 163,
                    left: 290,
                    zIndex: 73
                },
                suggestionID
            );

            let closeDialog = () => {
                popup.closePopup();
            }
            popup.setOnYesCb(() => {
                collabPlugin.acceptSuggestion(pItemID, suggestionID);
                collabPlugin.closeSuggestion(
                    popup.getFileId(), 
                    popup.getLeftContainerSelector(),
                    popup.getRightContainerSelector(),
                    closeDialog
                );
            });
            popup.setOnNoCb(() => {
                collabPlugin.denySuggestion(pItemID, suggestionID);
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
                    height: -10,
                    width: 0,
                    top: 163,
                    left: 290,
                    zIndex: 73
                });
            collabPlugin.openPItemOnDialogue(
                popup.getRightContainerSelector(),
                pitemID,
                true,
                true,
                {
                    height: -10,
                    width: 0,
                    top: 163,
                    left: 290,
                    zIndex: 73
                });

            let closeDialog = () => {
                popup.closePopup();
            }
            popup.setOnYesCb(() => {
                collabPlugin.saveSuggestion(
                    popup.getFileId(),
                    popup.getTitle(),
                    popup.getComment(),
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
        renderInfo,
    }
){
    ui.addSuggestionAnnotation(
        user.name, 
        {
            icon: renderInfo[0].value.path,
            name: renderInfo[1].value.text,
            color: renderInfo[2].value.colour
        },
        {
            suggestionID,
            pItemID
        }
    )
}

export function removeSuggestionFromToolbar({ui}, suggestionID){
    ui.removeSuggestionAnnotation((suggestionData) => {
        return suggestionData.suggestionID == suggestionID;
    });
}

export function logCreatePItem({ui}, {user,renderInfo}) {
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, {icon: renderInfo[0].value, name: renderInfo[1].value.text}, '#53FF50', 'Created', time);
}

export function logUserJoined({ui}, {user}) {
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, null, '#51C0FF', 'Joined the project', time);
}

export function logSuggestion({ui}, {user,renderInfo}) {
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, {icon: renderInfo[0].value, name: renderInfo[1].value.text}, '#FBFF46', 'Suggested', time);
}

export function logAcceptSuggestion({ui}, {user,renderInfo}) {
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, {icon: renderInfo[0].value, name: renderInfo[1].value.text}, '#53FF50', 'Accepted suggestion', time);
}

export function logRejectSuggestion({ui}, {user,renderInfo}) {
    let d = new Date();
    let time = `${d.getHours()}:${d.getMinutes()}`;
    ui.pushFrontAction(user, {icon: renderInfo[0].value, name: renderInfo[1].value.text}, '#F54C27', 'Rejected suggestion', time);
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

                    setUpSuggestionOnClick(collaborationUI["ui"], collabPlugin);
                });
                return collaborationUI;
            });
        };

        let popup = new JoinPopup($dialog);
        popup.setOnJoinCb(boundOnSuccess);
        popup.setOnCloseCb(onFailure);

        return collaborationUI;
}