// export {
//     SharePopup,
//     JoinPopup,
//     PassFloorPopup,
//     SharePersonalFilePopup
// }

class CollaborationPopup{
    constructor(container, title) {
        this._container = container;
        this._onnCloseCb = false;

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
        $(".collaboration-popup-header-x").click(() => this.closePopup());

        this._contentContainer = $(".collaboration-popup-content-container");
    }

    setOnCloseCb(cb){
        this._onnCloseCb = cb;
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

        let html = '<div class="vcenter center" style="width: 100%;"></div>';

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
        let name = $(`<div style="float:left;"> ${member.name} </div>`);
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

class SharePopup extends CollaborationPopup{
    constructor(container){
        super(container, "Share Project");

        let html = '\
            <div>\
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
        ';

        this._contentContainer.append(html);

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
        let html = '\
            <div>\
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
        ';

        this._contentContainer.append(html);

        $('#collaboration-join-button').click(() => {
            let name = this.getName();
            let icon = this.getIcon();
            let link = this.getLink();
            
            this.closePopup(true);

            if (this._onJoinCb)
                this._onJoinCb({name, icon}, link);
        });
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
    
    _onAcceptCb = () => {};
    _onRejectCb = () => {};

    constructor(container, file, member){
        super(container, `Suggestion - ${file}`);

        let html = 
            `<div class = "suggestion-all-content">\
                <div class = "suggestion-files-container">\
                    <div class = "suggestion-file">\
                        <div class="suggestion-text-16"> ${file} </div>\
                    </div>\
                    <div class="suggestion-file">\
                        <div class = "suggestion-file-and-dot">\
                            <div class="suggestion-purple-dot"></div>\
                            <div class="suggestion-text-16"> ${file} - Suggested </div>\
                        </div>\
                        <div class = "suggestion-user">\
                            <div class = "suggestion-user-icon" style = "background-image: url(${member.icon})"></div>\
                            <div class="suggestion-text-16"> ${member.name} </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="suggestion-editors-area">\
                    <div class = "suggestion-editor-area">\
                        <div class="suggestion-annotations">\
                                <div class="suggestion-annotations suggestion-text-14">\
                                    <div class = "suggestion-annotation suggestion-annotation-warning"> \
                                        [Warning] This file was edited after this suggestion was made. \
                                    </div>\
                                </div>\
                        </div>\
                        <div class = "suggestion-vpl-editor">\
                        </div>\
                    </div>\
                    <div class = "suggestion-editor-area">\
                        <div class = "suggestion-annotations suggestion-text-14">\
                            <div class = "suggestion-annotation suggestion-annotation-comment"> \
                                <div class = "suggestion-comment-title">\
                                    <div class = "suggestion-arrow"> </div>\
                                    <div class = "suggestion-comment"> Comment </div>\
                                </div>\
                                <div class = "suggestion-comment-content">\
                                    This is the comment content that could be long\
                                    This is the comment content that could be long\
                                    This is the comment content that could be long\
                                    This is the comment content that could be long\
                                    This is the comment content that could be long\
                                    This is the comment content that could be long\
                                    This is the comment content that could be long\
                                </div> \
                            </div>\
                            <div class = "suggestion-annotation suggestion-annotation-confirmation"> \
                                <div> Accept this suggestion </div>\
                                <div class = "suggestion-confirmation-buttons">\
                                    <div class = "suggestion-tick"></div>\
                                    <div class = "suggestion-x"></div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class = "suggestion-vpl-editor">\
                        </div>\
                    </div>\
                </div>\
            </div>`;

        this._contentContainer.append(html);
        
        let arrow_rotation = 0;
        $(".suggestion-comment-title").click( () => {
            $(".suggestion-comment-content").toggle();
            arrow_rotation = arrow_rotation == 0 ? -90 : 0;
            $(".suggestion-arrow").css('transform', `rotate(${arrow_rotation}deg)`);
        });

        $(".suggestion-tick").click(() => {
            this._onAcceptCb();
        });

        $(".suggestion-x").click(() => {
            this._onRejectCb();
        });
    }

    setOnAcceptCb(cb){
        this._onAcceptCb = cb;
    }

    setOnRejectCb(cb){
        this._onRejectCb = cb;
    }
}