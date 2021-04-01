import { isArguments } from "lodash";

export {
    SharePopup,
    JoinPopup,
    PassFloorPopup,
    SharePersonalFilePopup,
    AuthorSuggestionPopup,
    ViewSuggestionPopup
}

class CollaborationPopup{
    constructor(container, title) {
        this._container = container;
        this._onnCloseCb = false;
        this._onClickX = () => { this.closePopup(); };

        let html = `\
        <div class = "popup-opacity"> </div>\
        <div class = "collaboration-popup">\
            <div class = "collaboration-popup-header-bar vcenter">\
                <div class = "collaboration-popup-header-text"> ${title} </div>\
                <div class = "collaboration-popup-header-x middle-right size18x18"></div>\
            </div>\
            <div class = "collaboration-popup-content-container center">\
            </div>\
        </div>\
        `;

        if (typeof this._container === 'string')
            $('#' + this._container).append(html);
        else
            this._container.append(html);

        // $(".popup-opacity").click(() => this.closePopup());
        $(".collaboration-popup-header-x").click(() => {this._onClickX()});

        this._contentContainer = $(".collaboration-popup-content-container");
    }

    setOnCloseCb(cb){
        this._onnCloseCb = cb;
    }

    setOnClickX(cb){
        this._onClickX = cb;
    }

    closePopup(ignoreCb = false){
        $(".collaboration-popup").remove();
        $(".popup-opacity").remove();
        if (!ignoreCb && this._onnCloseCb)
            this._onnCloseCb();
    }
}

class SharePersonalFilePopup extends CollaborationPopup {
    constructor(container){
        super(container, "Share a personal file");
        // let html = '\
        // <div class="vcenter center" style="width: 100%;">\
        //     <div class="collaboration-popup-row center">\
        //         <input type="search" placeholder="Search..." style="width:100%;">\
        //         <div class="vcenter center" style="overflow-y: scroll; width: 100%; max-height: 24vh; border: 1px solid #bebebe;\
        //         border-radius: 5px;">\
        //             <div style="width: 80%; margin:0px; padding: 5px;">\
        //                 <div class="vcenter" style="margin-bottom: 5px;">\
        //                     <div class="member-icon" style="float:left;"> </div>\
        //                     <div style="float:left;"> Manos </div>\
        //                     <input type="checkbox" style="float:left; margin-left:auto">\
        //                 </div>\
        //             </div>\
        //         </div>\
        //     </div>\
        //     <div class="collaboration-popup-row center" style="width: 150px;">\
        //         <input type="button" value="Share">\
        //     </div>\
        // </div>\
        // ';
        let html = '<div class="vcenter center" style="width: 100%;"></div>';

        let buttonRowStr = '<div class="collaboration-popup-row center" style="width: 150px;"> </div>';
        let shareButtonStr = '<input type="button" value="Share">';
        
        let memberRowStr = '<div class="collaboration-popup-row center"> </div>';
        let searchBarStr = '<input type="search" placeholder="Search..." style="width:100%;">';
        let membersContainerStr = '<div class="vcenter center" style="overflow-y: scroll; width: 100%; max-height: 24vh; border: 1px solid #bebebe; border-radius: 5px;"></div>';
        let membersStr = '<div style="width: 80%; margin:0px; padding: 5px;"></div>';
        
        this._members = $(membersStr);
        this._button = $(shareButtonStr);
        this._searchBar = $(searchBarStr);

        let membersContainer = $(membersContainerStr).append(this._members);
        
        let membersRow = $(memberRowStr).append(this._searchBar).append(membersContainer);
        let buttonRow = $(buttonRowStr).append(this._button);
        
        html = $(html).append(membersRow).append(buttonRow);
        this._contentContainer.append(html);
        
        this._searchBar.keyup(() => {
            this.search(this._searchBar.val());
        });

        this._button.click(() => {
            if (this._onShareCb){
                let members = this.getCheckedMembers();
                this._onShareCb(members);
            }
            this.closePopup();
        });
    }

    setOnShareCb(onShareCb){
        this._onShareCb = onShareCb; 
    }

    pushbackMember(member){
        let container = $('<div class="vcenter" style="margin-bottom: 5px;"> </div>');
        let icon = $(`<div class="member-icon" style="float:left; background-image = ${member.icon}; cursor: pointer;"> </div>`);
        let name = $(`<div style="float:left; cursor: pointer;"> ${member.name} </div>`);
        let checkbox = $(`<input type="checkbox" name="${member.name}" style="float:left; cursor: pointer; margin-left:auto">`);

        icon.click(() => checkbox.click());
        name.click(() => checkbox.click());

        container.append(icon).append(name).append(checkbox);
        this._members.append(container);
    }

    getCheckedMembers(){
        let names = [];
        this._members.find(":checkbox:checked").each(function(){
            names.push($(this).prop("name"));
        });
        return names;
    }

    /**
     * 
     * @param {Array} members is an array of objects, each of them
     * having keys for icon and name
     */
    setMembers(members){
        members.sort((member1, member2) => {
            let name1 = member1.name, name2 = member2.name;
            return name1 < name2 ? -1 : name1 > name2 ? 0 : 1;
        });
        this._members.empty();
        for (const member of members)
            this.pushbackMember(member);
        
        /*  resize to constant size so that when search results show 
            the popups size is still constant   */
        this._members.height(Math.min(this._members.height(), this._members.parent().height()));
    }
    
    search(query){
        query.toLowerCase();
        this._members.children().each(function(){
            let name = $(this).children("div:nth-child(2)").text().toLowerCase();
            name.includes(query) ? $(this).show() : $(this).hide();
        });
    }
}

class PassFloorPopup extends CollaborationPopup {
    constructor(container){
        super(container, "Pass the editing rights");
        
        // <div class="vcenter center" style="width: 100%;">
        //     <div class="collaboration-popup-row center">
        //         <input type="search" placeholder="Search..." style="width:100%;">
        //         <div class="vcenter center" style="overflow-y: scroll; width: 100%; max-height: 24vh; border: 1px solid #bebebe;
        //     border-radius: 5px;">
        //             <div style="width: 100%; margin:0px; padding: 5px;">
        //                 <div class="vcenter" style="margin-bottom: 5px; cursor:pointer;">
        //                     <div class="member-icon" style="float:left;"> </div>
        //                     <div style="float:left;"> Manos </div>
        //                     <div class="collaboration-popup-member-icon size18x18" style = "margin-left: auto;"></div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div class="collaboration-popup-row center" style="width: 150px;">
        //         <input type="button" value="Share">
        //     </div>
        // </div>

        let html = '<div class="vcenter center" style="width: 100%; padding: 2vw;"></div>';

        let buttonRowStr = '<div class="collaboration-popup-row center" style="width: 150px;"> </div>';
        let shareButtonStr = '<input type="button" value="Pass editing rights">';
        
        let memberRowStr = '<div class="collaboration-popup-row center"> </div>';
        let searchBarStr = '<input type="search" placeholder="Search..." style="width:100%;">';
        let membersContainerStr = '<div class="vcenter center" style="overflow-y: scroll; width: 100%; max-height: 24vh; border: 1px solid #bebebe; border-radius: 5px;"></div>';
        let membersStr = '<div style="width: 100%; margin:0px; padding: 5px;"></div>';
        
        this._members = $(membersStr);
        this._button = $(shareButtonStr);
        this._searchBar = $(searchBarStr);

        let membersContainer = $(membersContainerStr).append(this._members);
        
        let membersRow = $(memberRowStr).append(this._searchBar).append(membersContainer);
        let buttonRow = $(buttonRowStr).append(this._button);
        
        html = $(html).append(membersRow).append(buttonRow);
        this._contentContainer.append(html);
        
        this._searchBar.keyup(() => {
            this.search(this._searchBar.val());
        });

        this._button.click(() => {
            if (this._onPassFloorCb){
                let memberName = this.getCheckedMember();
                this._onPassFloorCb(memberName);
            }
            this.closePopup();
        });

        this._checkedMemberName = null;
        this._visibleTick = null;
    }

    setOnPassFloorCb(onPassFloorCb){
        this._onPassFloorCb = onPassFloorCb; 
    }

    pushbackMember(member){
        // <div class="vcenter" style="margin-bottom: 5px; cursor:pointer;">
        //     <div class="member-icon" style="float:left;"> </div>
        //     <div style="float:left;"> Manos </div>
        //     <div class="collaboration-popup-tick-icon size18x18"></div>
        // </div>

        let container = $('<div class="vcenter" style="margin-bottom: 5px; cursor: pointer;"> </div>');
        let icon = $(`<div class="member-icon" style="float:left; background-image = ${member.icon};"> </div>`);
        let name = $(`<div style="float:left;">${member.name}</div>`);
        let tick = $(`<div class="collaboration-popup-tick-icon size18x18"></div>`);
        
        tick.hide();
        
        container.append(icon).append(name).append(tick);
        container.click(() => {
            let memberName = container.children("div:nth-child(2)").text();
            if (memberName != this._checkedMemberName){
                if(this._visibleTick)
                    this._visibleTick.hide();

                let clickedTick = container.children("div:nth-child(3)");
                clickedTick.show();

                this._checkedMemberName = memberName;
                this._visibleTick = clickedTick;
            }else{
                this._visibleTick.hide();

                this._checkedMemberName = null;
                this._visibleTick = null;
            }
        });

        this._members.append(container);
    }

    getCheckedMember(){
        return this._checkedMemberName;
    }

    /**
     * 
     * @param {Array} members is an array of objects, each of them
     * having keys for icon and name
     */
    setMembers(members){
        members.sort((member1, member2) => {
            let name1 = member1.name, name2 = member2.name;
            return name1 < name2 ? -1 : name1 > name2 ? 0 : 1;
        });
        this._members.empty();
        for (const member of members)
            this.pushbackMember(member);
        
        /*  resize to constant size so that when search results show 
            the popups size is still constant   */
        this._members.height(Math.min(this._members.height(), this._members.parent().height()));
    }
    
    search(query){
        query.toLowerCase();
        this._members.children().each(function(){
            let name = $(this).children("div:nth-child(2)").text().toLowerCase();
            name.includes(query) ? $(this).show() : $(this).hide();
        });
    }
}

class ChooseIconComponent {
    
    constructor(imgs){
        this.$view = $('\
        <div style = "padding: 2vw;">\
            <div class = "collaboration-edit-icon-container">\
                <div class = "edit-icon-icons">\
                    <div class = "edit-icon-my-icon"> </div>\
                    <div class = "edit-icon-line"> </div>\
                    <div class = "edit-icon-alternate-icons"> </div>\
                </div>\
                <div class = "edit-icon-buttons">\
                    <div class = "edit-icon-button edit-icon-cancel"> Cancel </div>\
                    <div class = "edit-icon-button edit-icon-confirm"> Confirm </div>\
                </div>\
            </div>\
        </div>\
        ');

        this.img2html = {};

        for (let img of imgs){
            let $img = $(`<div class = "edit-icon-alternate-icon"></div>`);
            $img.css('background-image', `url(${img})`);
            $img.click(() => this.selectImg(img));
            this.$view.find('.edit-icon-alternate-icons').append($img);

            this.img2html[img] = $img;
        }

        this.onCancel = () => {};
        this.onConfirm = (selected) => {};

        this.$view.find('.edit-icon-cancel').click( () => this.onCancel() );
        this.$view.find('.edit-icon-confirm').click( 
            () => this.onConfirm(this.$selected.css('background-image')) 
        );
    
        this.selectImg(imgs[0]);
    }

    selectImg(img){
        let $img = this.img2html[img];

        if (this.$selected)
            this.$selected.removeClass('edit-icon-selected');
        $img.addClass('edit-icon-selected');
        this.$selected = $img;
        this.$view.find('.edit-icon-my-icon').css('background-image', $img.css('background-image'));
    }

    setOnConfirmCb(cb){
        this.onConfirm = cb;
    }

    setOnCancelCb(cb){
        this.onCancel = cb;
    }

    getView(){
        return this.$view;
    }

    getSelected(){
        return this.$selected.css('background-image');
    }

}


/**
 * Sets up a choose icon component for specialized for share and join popups
 */
class SpecializedChooseIconComponent {
    constructor($other){
        let path = '/src/app/ide/components-framework/build-in.components/collaboration-manager/Icons/';
        let images = [];
        for (let gender of ['man', 'woman']){
            for (let i = 0; i < 5; i++){
                images.push(`${path}${gender}${i}.png`);   
            }
        }

        this.edit = new ChooseIconComponent(images);
        let $edit = this.edit.getView();
        
        $edit.hide();

        this.edit.setOnCancelCb(() => {
            $edit.hide();
            $other.show();
        });

        this.edit.setOnConfirmCb((selected) => {
            $edit.hide();
            $other.show();
            $('.collaboration-popup-user-icon').css('background-image', selected);
        });

        $('.collaboration-popup-edit').click(() => {
            $other.hide();
            $edit.show();
        });
    }

    getView(){
        return this.edit.getView();
    }
}

class SharePopup extends CollaborationPopup{
    constructor(container){
        super(container, "Share Project");

        let $share = $('\
            <div style = "padding: 2vw;">\
                <div class = "collaboration-popup-row center">\
                    <div class = "vcenter" style = "display: inline-flex">\
                        <div class = "collaboration-popup-user-icon"> </div>\
                        <div class = "collaboration-popup-edit"> Edit </div>\
                    </div>\
                    \
                </div>\
                <div class = "collaboration-popup-row center">\
                    <input type="text" id="collaboration-share-name" placeholder="e.g. John Doe">\
                </div>\
                <div class = "collaboration-popup-row center">\
                    <input type="button" id="collaboration-share-button" value="SHARE">\
                </div>\
            </div>\
        ');

        this._contentContainer.append($share);

        $("#collaboration-share-button").click(() => {
            let name = this.getName();
            let icon = this.getIcon();

            this.closePopup(true);
            
            if (this._onShareCb)
                this._onShareCb({
                    name: name, 
                    icon: icon
                });
        });

        let edit = new SpecializedChooseIconComponent($share);
        this._contentContainer.append(edit.getView());
    }

    getName(){
        return $("#" + "collaboration-share-name").val();
    }

    getIcon(){
        let imageUrl = $(".collaboration-popup-user-icon").css("background-image");
        return imageUrl.slice(5 /* url(" */,imageUrl.length -  2);
    }

    setOnShareCb(cb) {
        this._onShareCb = cb;
    }
}

class JoinPopup extends CollaborationPopup{
    constructor(container){
        super(container, "Join to a shared project");
        let $join = $('\
            <div style = "padding: 2vw;">\
                <div class="collaboration-popup-row center">\
                    <div class="vcenter" style="display: inline-flex">\
                        <div class="collaboration-popup-user-icon"> </div>\
                        <div class="collaboration-popup-edit"> Edit </div>\
                    </div>\
                </div>\
                <div class="collaboration-popup-row center">\
                    <input type="text" id="collaboration-join-name" placeholder="e.g. John Doe">\
                </div>\
                <div class="collaboration-popup-row center">\
                    <input type="text" id="collaboration-join-link" placeholder="e.g. #dd76gocrFVt30PJg">\
                </div>\
                <div class="collaboration-popup-row center">\
                    <input type="button" id="collaboration-join-button" value="JOIN">\
                </div>\
            </div>\
        ');
        
        this._contentContainer.append($join);
        
        $('#collaboration-join-button').click(() => {
            let name = this.getName();
            let icon = this.getIcon();
            let link = this.getLink();
            
            this.closePopup(true);

            if (this._onJoinCb)
                this._onJoinCb({name, icon}, link);
        });

        let edit = new SpecializedChooseIconComponent($join);
        this._contentContainer.append(edit.getView());
    }

    getName(){
        return $("#" + "collaboration-join-name").val();
    }

    getIcon(){
        let imageUrl = $(".collaboration-popup-user-icon").css("background-image");
        return imageUrl.slice(5 /* url(" */,imageUrl.length -  2);
    }

    getLink(){
        return $("#collaboration-join-link").val();
    }

    setOnJoinCb(cb){
        this._onJoinCb = cb;
    }
}

class SuggestionPopup extends CollaborationPopup{

    constructor(container, fileId, title, comment, buttonNames, cb){
        super(container, `Visual Code Suggestion`);

        this.fileId = fileId;
        this._onYesCb = () => {};
        this._onNoCb = () => {};

        let $html = $(`\
        <div class="suggestion-all-content">\
            <div class="suggestion-editors-area">\
                <div class="suggestion-editor-area">\
                    <div class="suggestion-annotation-with-x suggestion-annotation-warning">\
                        <div class="suggestion-text-14">\
                            [Warning] This file was edited after this suggestion was made.\
                        </div>\
                        <div class="suggestion-annotation-x"> </div>\
                    </div>\
                    <div id = "suggestion-left-editor" class="suggestion-vpl-editor suggestion-vpl-editor-left">\
                    </div>\
                </div>\
                <div class="suggestion-editor-area">\
                    <div id = "suggestion-right-editor" class="suggestion-vpl-editor suggestion-vpl-editor-right">\
                    </div>\
                </div>\
            </div>\
            <div class="suggestion-right-menu">\
                <div class="suggestion-right-menu-content">\
                    <div class="suggestion-right-menu-section">\
                        <div class="suggestion-text-16">\
                            Manage Suggestion\
                        </div>\
                        <div class = "suggestion-input-container">
                            <div class = "suggestion-input-title"> Title </div>
                            <input class = "suggestion-title"
                                ${title.readonly ? 'readonly' : ''} 
                                placeholder = "Suggestion title" 
                                value = "${ title.text === undefined ? '' : title.text}"
                            >
                        </div>
                        <div class = "suggestion-input-container">\
                            <div class = "suggestion-input-title"> Comment </div>\
                            <textarea\
                                class="suggestion-comment"\ 
                                ${comment.readonly ? 'readonly' : ''}\
                                placeholder="Suggestion description"
                            >${comment.text === undefined ? '' : comment.text}</textarea>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>`);

        if (buttonNames){
            $html.find('.suggestion-right-menu-section').append(
                `<div class="suggesiton-confirmation-buttons">
                    <div class="suggestion-confirmation-button suggestion-accept">
                        ${buttonNames.yes}
                    </div>
                    <div class="suggestion-confirmation-button suggestion-reject">
                        ${buttonNames.no}
                    </div>
                </div>`
            );
        }

        this._contentContainer.append($html).ready( () => {
            $(".suggestion-accept").click(() => {
                this._onYesCb();
            });

            $(".suggestion-reject").click(() => {
                this._onNoCb();
            });

            $(".suggestion-annotation-warning").hide();
            $(".suggestion-annotation-x").click(function(){
                $(this).parent().hide();
            });

            cb(this);
        });
        
    }

    setOnYesCb(cb){
        this._onYesCb = cb;
    }

    setOnNoCb(cb){
        this._onNoCb = cb;
    }

    showWarning(){
        $(".suggestion-annotation-warning").show();
    }

    getLeftContainerSelector(){
        return "#suggestion-left-editor";
    }

    getRightContainerSelector(){
        return "#suggestion-right-editor";
    }

    getFileId(){
        return this.fileId;
    }

    getComment(){
        return $('.suggestion-comment').val() || '';
    }

    getTitle() {
        return $('.suggestion-title').val() || '';
    }
}

class AuthorSuggestionPopup extends SuggestionPopup {
    constructor(container, fileName, cb){
        super(container, fileName, {readonly: false, text: ''}, {readonly: false, text: ''}, {yes: 'Send', no: 'Cancel'}, cb);
    }
}

class ViewSuggestionPopup extends SuggestionPopup {
    
    constructor(container, fileId, members, title, comment, hasButtons, cb){
        super(
            container, 
            fileId,
            {readonly: true, text: title || ''},
            {readonly: true, text: comment || ''}, 
            hasButtons ? {yes: 'Accept', no: 'Reject'} : undefined,
            cb
        );
        
        this._onMemberClick = (member) => {console.log(member)};
        
        let html = 
        `<div class="suggestion-right-menu-section">\
            <div class="suggestion-text-16"> </div>\
            <div class="suggestion-users-container"> </div>\
        </div>`;
        
        $(".suggestion-right-menu-content").append(html);

        if (members)
            this.addMembers(members);
    }

    setOnUserClickCb(cb){
        this._onMemberClick = cb;
    }

    addMember(member){
        let memberJqry = $(`\
            <div class="suggestion-user">\
                <div class="suggestion-user-icon" style="background-image: url(${member.icon})"> </div>\
                <div class="suggestion-text-14"> ${member.name} </div>\
            </div>\
        `);
        let onclick = () => this._onMemberClick(member);
        memberJqry.click(function(){
            $('.suggestion-user').removeClass('suggestion-user-active');
            $(this).addClass('suggestion-user-active');
            onclick();
        });
        $('.suggestion-users-container').append(memberJqry);
    }

    addMembers(members){
        for (let member of members)
            this.addMember(member);
    }

    clearMembers(){
        $('.suggestion-users-container').empty();
    }
}