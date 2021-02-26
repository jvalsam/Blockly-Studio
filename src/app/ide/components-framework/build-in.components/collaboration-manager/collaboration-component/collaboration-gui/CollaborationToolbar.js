export class CollaborationUI {
    
    


    constructor(container){

        this._membersA = {
            style :
            "                               \
                display: flex;              \
                align-items: center;        \
                flex-wrap: wrap;            \
                height : 33px;              \
                margin-bottom: 4px;         \
                margin-top: 4px;            \
            "
        };
        this._fileA = {
            'style' :   
            "                               \
                display: flex;              \
                align-items: center;        \
                flex-wrap: wrap;            \
                height : 19px;              \
                margin-bottom: 5px;         \
                font-size: 16px;            \
            "
        };
        this._memberRequests = {};
        this._onClickPersonalFile = (node) => {console.log(node)};
           
        /* Trees */
        this._members;
        this._personalFiles;
        this._sharedPersonalFilesFromMe;
        this._sharedPersonalFilesToMe;
        
        /* Html tree root ids */
    
        this._COLLABORATORS = 'members-collaborators';
        this._PERSONAL_FILES = 'personal-files';
        this._COLLABORATOR_ME = 'members-me'
        
        /* Prefixes for adding new nodes */
        
        this._MEMBER_PREFIX = 'collaborators-';
        this._MEMBER_ME_PREFIX = 'collaborators-me-';
        this._ANNOTATION_FILE_PREFIX = '-file-';
        this._PERSONAL_FILE_PREFIX = 'personal-file-';
        this._SHARED_FROM_ME_FILE_PREFIX = 'shared-from-me-';
        this._SHARED_TO_ME_FILE_PREFIX = 'shared-to-me-';

        this._injectHtml(container);
        this._initTrees();

        /* Trees */
        this._members = $.jstree.reference('#collaboration-members');
        this._personalFiles = $.jstree.reference('#selected-member-files');
        this._sharedPersonalFilesFromMe = $.jstree.reference('#collaboration-shared-from-me');
        this._sharedPersonalFilesToMe = $.jstree.reference('#collaboration-shared-to-me');
    }

    /* PRIVATE FUNCTIONS */

    _initTrees(){
        $('#collaboration-members').jstree({
            "plugins": [
                "wholerow",
                "colorv",
                "sort",
                "contextmenu",
                "unique",
                "types"
            ],
            'types': {
                'smart_object': {},
                'other': {}
            },
            'core': {
                'check_callback': true,
                'data': []
            }
        });
    
        let members = $.jstree.reference('#collaboration-members');

        $('#selected-member-files').jstree({
            "plugins": [
                "colorv",
                "sort",
                "wholerow",
                "contextmenu",
                "unique",
                "types",
                "conditionalselect"
            ],
            'types': {
                'smart_object': {},
                'other': {}
            },
            'core': {
                'check_callback': true,
                'data': [
                    {
                        'id': 'personal-files',
                        'parent': '#',
                        'type': 'other',
                        'text': 'Personal Files - Mary',
                        'icon': false,
                        'state' : {
                            'opened' : true,
                        },
                        'a_attr': this._membersA
                    },
                ]
            },
            "conditionalselect" : (node, event) => {
                let file = {
                    id: node.id,
                    name: node.text,
                    color: node.color,
                    icon: node.icon,
                };
                this._onClickPersonalFile(file);
                return true;
            }
        });
    
        $.jstree.defaults.core.animation = false;
    
        $('#dummy-js-tree-1').jstree({
            "plugins": [
                "wholerow",
                "contextmenu",
                "sort",
                "unique",
                "types"
            ],
            'types': {
                'smart_object': {},
                'other': {}
            },
            'core': {
                'check_callback': true,
            }
        });
    
        let dummyTree1 = $.jstree.reference('#dummy-js-tree-1');
        
        /* 
        programmaticaly create the root node and a dummy node (so that the root has the > symbol on its left)
        and overide the double click event
        */
       
        dummyTree1.create_node (
            '#',
            {
                'id': 'dummy-js-tree-1-root',
                'parent': '#',
                'type': 'other',
                'text': 'Shared Personal Files',
                'icon': false,
                'state' : { 'opened' : true },
                'a_attr': this._membersA
            },
            0,
            function cb(){
                dummyTree1.create_node (   
                    'dummy-js-tree-1-root', 
                    {
                        'parent': 'dummy-js-tree-1-root',
                        'id' : 'dummy-js-tree-1-node'
                    }, 
                    0, 
                    function cb(){
                        $('#dummy-js-tree-1-node').remove();
                        
                        $("#dummy-js-tree-1").off("dblclick").dblclick(function(){
                            dummyTree1.is_open('dummy-js-tree-1-root') ? dummyTree1.close_node('dummy-js-tree-1-root') : dummyTree1.open_node('dummy-js-tree-1-root');
                            $.when($('#dummy-js-tree-1-node').remove()).then( function(){
                                $('#collaboration-shared-files-ui').toggle(200);
                            });
                        });
                    },
                    true
                );
            },
            true
        );
    
        $('#collaboration-shared-from-me').jstree({
            "plugins": [
                "colorv",
                "sort",
                "wholerow",
                "contextmenu",
                "unique",
                "types"
            ],
            'types': {
                'smart_object': {},
                'other': {}
            },
            'core': {
                'check_callback': true,
                'data': []
            }
        });
    
        $('#collaboration-shared-to-me').jstree({
            "plugins": [
                "colorv",
                "sort",
                "wholerow",
                "contextmenu",
                "unique",
                "types"
            ],
            'types': {
                'smart_object': {},
                'other': {}
            },
            'core': {
                'check_callback': true,
                'data': []
            }
        });
    
        function TabSwitcher(tab1, tab2){
            let focused = tab1;
            this.focusTab = function(tab){
                if (tab != focused){
                    $('#' + tab1).toggle();
                    $('#' + tab2).toggle();
                    focused = tab;
                }
            };
        }
    
        let tabSwitcher = new TabSwitcher('collaboration-shared-from-me','collaboration-shared-to-me');
        $('#collaboration-shared-from-me-tab-ui').click(function(){
            tabSwitcher.focusTab('collaboration-shared-from-me');
            $('#collaboration-shared-to-me-tab-ui').removeClass('collaboration-shared-tab-active');
            $('#collaboration-shared-from-me-tab-ui').removeClass('collaboration-shared-tab-active').addClass('collaboration-shared-tab-active');
        });
        $('#collaboration-shared-to-me-tab-ui').click(function(){
            tabSwitcher.focusTab('collaboration-shared-to-me');
            $('#collaboration-shared-from-me-tab-ui').removeClass('collaboration-shared-tab-active');
            $('#collaboration-shared-to-me-tab-ui').removeClass('collaboration-shared-tab-active').addClass('collaboration-shared-tab-active');
        });
    
        $('#dummy-js-tree-2').jstree({
            "plugins": [
                "wholerow",
                "contextmenu",
                "sort",
                "unique",
                "types"
            ],
            'types': {
                'smart_object': {},
                'other': {}
            },
            'core': {
                'check_callback': true,
            }
        });
    
        let dummyTree2 = $.jstree.reference('#dummy-js-tree-2');
        
        /* 
        programmaticaly create the root node and a dummy node (so that the root has the > symbol on its left)
        and overide the double click event so that it toggles the "To me" and "From me" tabs that are out of the tree
        */
       
    
        dummyTree2.create_node (
            '#',
            {
                'id': 'dummy-js-tree-2-root',
                'parent': '#',
                'type': 'other',
                'text': 'Recent Actions',
                'icon': false,
                'state' : { 'opened' : true },
                'a_attr': this._membersA
            },
            0,
            function cb(){
                dummyTree2.create_node (   
                    'dummy-js-tree-2-root', 
                    {
                        'parent': 'dummy-js-tree-2-root',
                        'id' : 'dummy-js-tree-2-node'
                    }, 
                    0, 
                    function cb(){
                        $('#dummy-js-tree-2-node').remove();
                        
                        $("#dummy-js-tree-2").off("dblclick").dblclick(function(){
                            dummyTree2.is_open('dummy-js-tree-2-root') ? dummyTree2.close_node('dummy-js-tree-2-root') : dummyTree2.open_node('dummy-js-tree-2-root');
                            $.when($('#dummy-js-tree-2-node').remove()).then( function(){
                                $('#collaboration-recent-actions-ui').toggle(200);
                            });
                        });
                    },
                    true
                );
            },
            true
        );

        members.create_node('#',{
            'id': 'members',
            'parent': '#',
            'type': 'other',
            'text': 'Members',
            'icon': false,
            'state' : {
                'opened' : true,
            },
            'a_attr': this._membersA
        }, 
        'last',
        () => {
            members.create_node('members',{
                'id': 'members-me',
                'parent': 'members',
                'type': 'other',
                'text': 'Me',
                'icon': false,
                'state' : {
                    'opened' : true,
                },
                'a_attr': this._membersA
            },
            'last',
            () => {
                members.create_node('members', {
                    'id': 'members-collaborators',
                    'parent': 'members',
                    'type': 'other',
                    'text': 'Collaborators',
                    'icon': false,
                    'state' : {
                        'opened' : true,
                    },
                    'a_attr': this._membersA
                },
                'last',
                () => {
                    this._serveMemberRequests();
                }
                );
            }
            );
        }
        );
    }

    _injectHtml(container) {
        let html =
        '<div id = "collaboration-toolbar"> \
            <div class = "collaboration-toolbar-opacity"></div>\
            <div class = "collaboration-toolbar-menu">\
                <div class = "collaboraiton-toolbar-top">\
                    <div class = "toolbar-menu-member">\
                        <div class = "toolbar-menu-member-icon"></div>\
                        <div class = "toolbar-menu-member-name"> </div>\
                    </div>\
                    <div class = "toolbar-menu-minimize"></div>\
                </div>\
                <hr>\
                <div class="toolbar-menu-section">\
                    <div class="toolbar-menu-section-title"> Live Share </div>\
                    <div class="toolbar-menu-project-and-link">\
                        <div class="toolbar-menu-project-name"> </div>\
                        <div class="toolbar-menu-link">\
                            <input readonly type="text" class="toolbar-menu-link-text">\
                            <div class="toolbar-menu-copy-link"></div>\
                        </div>\
                    </div>\
                </div>\
                <div class="toolbar-menu-section">\
                    <div class="toolbar-menu-section-title"> Settings </div>\
                    <div class="toolbar-menu-settings">\
                    </div>\
                </div>\
            </div>\
            <div id = "collaboration-header-container" class = "vcenter"> \
                <div id = "collaboration-icon" class = "size30x30"> </div> \
                <div id = "collaboration-title"> Collaboration </div> \
                <div id = "collaboration-burger" class = "size22x22 middle-right"> </div> \
                <div class = "clear"></div> \
            </div> \
        \
            <div id = "collaboration-content"> \
                <div id = "collaboration-members"> </div> \
                <div id = "selected-member-files"> </div> \
            \
                <div> \
                    <!-- Header node for the collaboration-shared-files-ui --> \
                    <div id = "dummy-js-tree-1"></div> \
            \
                    <div id = "collaboration-shared-files-ui"> \
                        <div id = "collaboration-shared-from-me-tab-ui" class = "center collaboration-shared-tab-ui collaboration-shared-tab-active"> From me </div> \
                        <div id = "collaboration-shared-to-me-tab-ui"class = "center collaboration-shared-tab-ui"> To me </div> \
                        <div id = "collaboration-shared-files-content" class = "clear"> \
                            <div id = "collaboration-shared-from-me"></div> \
                            <div id = "collaboration-shared-to-me"></div> \
                        </div> \
                    </div> \
                </div> \
            \
                <div> \
                    <div id = "dummy-js-tree-2"> </div> \
                    <div id = "collaboration-recent-actions-ui"> \
                    </div> \
                </div> \
            </div> \
        </div> '
        ;
        if (typeof container === 'string')
            $("#" + container).append(html);
        else
            container.append(html);

        $('.toolbar-menu-copy-link').click(() => {
            $('.toolbar-menu-link-text').select();
            document.execCommand("copy");
        });
        $('#collaboration-burger').click(() => this._toggleToolbarMenu());
        $('.toolbar-menu-minimize').click(() => this._toggleToolbarMenu());
        this._toggleToolbarMenu();
    }

    _toggleToolbarMenu(){
        $('.collaboration-toolbar-opacity').toggle();
        $('.collaboration-toolbar-menu').toggle();
    }

    _createPersonalFileNodes(parentId, node, calculateId){
        let id = calculateId(parentId, node);

        node.id = this._personalFiles.create_node(
            parentId,
            {
                id: id,
                text: node.name,
                icon: node.icon,
                color: node.color,
                state : { opened : true },
                a_attr: this._fileA
            },
            0,
            () => {
                if (node.children)
                    for (let child of node.children)
                        this._createPersonalFileNodes(id, child, calculateId)
            },
        );
    }

    _addMemberFileAnotation(memberName, fileName, fileIcon, fileColor, fileBubbleColor, cb = undefined){
        var node = {
            'id': this._MEMBER_PREFIX + memberName + this._ANNOTATION_FILE_PREFIX + fileName,
            'text': fileName,
            'icon': fileIcon,
            'a_attr': this._fileA
        };

        if (!this._members.get_node(node.id)){
            node.bubble_color = fileBubbleColor;
            node.color = fileColor; 
            this._members.create_node(this._MEMBER_PREFIX + memberName, node, 'last', cb);
        }
    }

    /**
     * 
     * @param {Object} member Should contain name, icon
     * @param {Object} file Should contain name, icon
     * @param {String} type
     * @param {String} time
     * @param {function} add The function that will be used for adding e.g append
     */
    _addAction(member, file, actionColor, type, time, add){
        let html = `                                                                                                \
            <div class = "collaboration-recent-action" style = "background-color: ${actionColor};">                 \
                <div class = "recent-action-row vcenter font-size16px">                                             \
                    <div class = "member-icon float-left" style = "background-image: url(${member.icon});"></div>   \
                    <div> ${member.name} </div>                                                                     \
                    <div class = "middle-right vcenter">                                                            \
                        <div class = "file-icon float-left" style = "background-image: url(${file.icon});"></div>   \
                        ${file.name}                                                                                \
                    </div>                                                                                          \
                </div>                                                                                              \
                <div class = "recent-action-last-row vcenter">                                                      \
                    <div>Type: ${type}</div>                                                                        \
                    <div class = "middle-right">${time}</div>                                                       \
                </div>                                                                                              \
            </div> 
        `;
        add(html);
    }

    _addSharedPersonalFile(tree, prefix, file, members){
        let fileNode = {
            'id' : prefix + file.name,
            'text': file.name,
            'icon': file.icon ? file.icon : './Icons/clock.png',
            'color': file.color ? file.color : 'red',
            'a_attr': this._fileA
        };

        tree.create_node('#', fileNode, "last", () => {
            for (const member of members){
                let icon = member.isMaster ? './Icons/crown.png' :
                            member.hasFloor ? './Icons/pencil.png' : false;

                let memberNode = {
                    'id' : prefix + file.name + '-' + member.name,
                    'text': member.name,
                    'icon': icon,
                    'a_attr': this._fileA
                };

                tree.create_node(fileNode.id, memberNode, "last");
            }
        });
    }

    _serveMemberRequests(){
        for (let dest in this._memberRequests){
            for (let node of this._memberRequests[dest])
                this._members.create_node(dest, node, "last");
        }
        
        this._memberRequests = {};
    }

    _addMember(member, me, cb = undefined){
        var node = {
            'id': (me ? this._MEMBER_ME_PREFIX : this._MEMBER_PREFIX) + member.name,
            'text': member.name,
            'icon': member.icon,
            'a_attr': this._membersA
        };

        let dest = me ? this._COLLABORATOR_ME : this._COLLABORATORS; 

        if (!this._members.get_node(dest)){

            if (!this._memberRequests[dest])
                this._memberRequests[dest] = [];
            
            this._memberRequests[dest].push(node);
        }else
            this._members.create_node(dest, node, "last", cb);
    }

    /* API */

    setToolbarMenuMember(member){
        $(".toolbar-menu-member-icon").css("background-image", member.icon);
        $(".toolbar-menu-member-name").text(member.name);
    }

    setToolbarMenuProjectInfo(projectName, link){
        $('.toolbar-menu-project-name').text(projectName);
        $('.toolbar-menu-link-text').val(link);
    }

    /**
     * 
     * @param {Array} settings for example [{name: 'settingName', checked: 'true'}, {name: 'settingName2' checked: false}] 
     */
    setToolbarMenuSettings(settings){
        $('.toolbar-menu-settings').empty();
        for (let setting of settings){
            let settingJqry = $(`\
                <div class="collaboration-setting">\
                    <div class="collaboration-setting-title"> ${setting.name} </div>\
                    <label class="collaboration-setting-checkbox-container">\
                        <span class="slider"></span>\
                    </label>\
                </div>\
            `);
    
            let checkbox = $(`<input type="checkbox" ${setting.checked ? "checked" : ""}>`)
            checkbox.click(()=>{
                setting.checked = checkbox.is(':checked');
            });
            
            settingJqry.children("label").prepend(checkbox);
            $('.toolbar-menu-settings').append(settingJqry);
        }
    }

    /**
     * 
     * @param {Object} member Should contain name and icon
     * @param {Function} cb 
     */
    addMemberMe(member, cb = undefined ){
        this._addMember(member, true, cb);
        this._userName = member.name;
    }

    /**
     * 
     * @param {Object} member Should contain name and icon
     * @param {Function} cb 
     */
    addMember(member, cb = undefined ){
        this._addMember(member, false, cb);
    }

    removeMember(memberName){
        this._members.delete_node(this._MEMBER_PREFIX + memberName);
    }
    /**
     * 
     * @param {Object} file 
     * @param {Array} members 
     */
    addSharedPersonalFileToMe(file, members){
        this._addSharedPersonalFile(
            this._sharedPersonalFilesToMe,
            this._SHARED_TO_ME_FILE_PREFIX,
            file,
            members
        );
    }

    /**
     * 
     * @param {Object} file 
     * @param {Array} members 
     */
    addSharedPersonalFileFromMe(file, members){
        this._addSharedPersonalFile(
            this._sharedPersonalFilesFromMe,
            this._SHARED_FROM_ME_FILE_PREFIX,
            file,
            members
        );
    }

    /**
     * 
     * @param {Object} memberName the member should already exist in the members tab (i.e. addMember has been called)
     * @param {Object} file should contain name icon and color
     * @param {Function} cb 
     */
    addSuggestionAnnotation(memberName, file, cb = undefined){
        this._addMemberFileAnotation(memberName, file.name, file.icon, file.color, 'purple', cb);
    }

    addNoteAnnotation(memberName, file, cb = undefined){
        this._addMemberFileAnotation(memberName, file.name, file.icon, file.color, 'orange', cb);
    }

    removeMemberFileAnotation(memberName, fileName){
        this._members.delete_node(this._MEMBER_PREFIX + memberName + this._ANNOTATION_FILE_PREFIX + fileName);
    }

    clearAndAddPersonalFileSpecificIds(memberName, nodes){
        this._personalFiles.delete_node(this._PERSONAL_FILES);
        this._personalFiles.create_node('#',{
            id: 'personal-files',
            text: 'Personal Files - ' + memberName,
            icon: false,
            state : { opened : true, },
            a_attr: this._membersA
        },
        'last',
        () => {
            this._createPersonalFileNodes('personal-files', nodes, (parentId, node) => {
                return node.id;
            });
        });
    }

    clearAndAddPersonalFilesAutoIds(memberName, nodes){
        this._personalFiles.delete_node(this._PERSONAL_FILES);
        this._personalFiles.create_node(
            '#',
            {
                id: 'personal-files',
                text: 'Personal Files - ' + memberName,
                icon: false,
                state : { opened : true, },
                a_attr: this._membersA
            },
            'last',
            () => {
                this._createPersonalFileNodes('personal-files', nodes, (parentId, node) => {
                    return parentId + '/' + node.name
                });
            }
        );
    }

    addPersonalFile(parentId, id){
        if (!parentId)
            parentId = 'personal-files';

        this._personalFiles.create_node(
            parentId,
            {
                id: id,
                text: node.name,
                icon: node.icon,
                color: node.color,
                state : { opened : true },
                a_attr: this._fileA
            },
        );
    }

    setOnClickPersonalFileCb(cb){
        this._onClickPersonalFile = cb;
    }

    pushFrontAction(member, file, actionColor, actionType, actionTime){
        let recentActions = $("#collaboration-recent-actions-ui");
        let add = recentActions.prepend.bind(recentActions);
        this._addAction(member, file, actionColor, actionType, actionTime, add);
    }

    pushBackAction(member, file, actionColor, actionType, actionTime){
        let recentActions = $("#collaboration-recent-actions-ui");
        let add = recentActions.append.bind(recentActions);
        this._addAction(member, file, actionColor, actionType, actionTime, add);
    }
}

/* Examples */

function CollaborationUI_API_Examples(ui){

    function addMemberMe(){
        let member = {
            'name': 'Some Guy',
            'icon': './Icons/man0.png'
        }
        ui.addMemberMe(member);
    }

    function addMember(){
        let member = {
            'name': 'Some Guy',
            'icon': './Icons/man0.png'
        }
        ui.addMember(member);
    }

    function removeMember(){
        //call addMember fist: member has to exist
        ui.removeMember('Some Guy');
    }

    function addSuggestionAnnotation(){
        //call addmember first: member has to exist
        let file = {
            'name' : 'Alarm Clock Rings',
            'icon' : './Icons/clock.png',
            'color': 'blue'
        }
        ui.addSuggestionAnnotation('Some Guy', file);
    }

    function addNoteAnnotation(){
        //call addmember first: member has to exist
        let file = {
            'name' : 'Alarm Clock Stops',
            'icon' : './Icons/clock.png',
            'color': 'blue'
        }
        ui.addNoteAnnotation('Some Guy', file);
    }

    function removeMemberFileAnotation(){
        // call addNoteAnnotation first: annotation has to exist
        ui.removeMemberFileAnotation('Some Guy', 'Alarm Clock Rings');
    }

    function addPersonalFile(){
        var somefile1 = {
            'path' : 'Folder1/Folder2/Folder3',
            'name' : 'example',
            'color' : 'blue',
            'icon' : './Icons/water.png'
        };
        ui.addPersonalFile(somefile1);
    }

    function clearAndAddMemberPersonalFiles(){
        var somefile1 = {
            'path' : 'Whatever1/Whatever2',
            'name' : 'example1'
        };
        var somefile2 = {
            'path' : 'Folder1/Folder2/Folder3',
            'name' : 'example2',
            'color' : 'blue',
            'icon' : './Icons/water.png'
        };
        var somefile3 = {
            'path' : 'Folder1/Folder2/Folder3',
            'name' : 'example3',
            'color' : 'purple',
            'icon' : './Icons/water.png'
        };
        var files = [somefile1, somefile2, somefile3];
        ui.clearAndAddMemberPersonalFiles('Some Guy', files);
    }

    function pushBackAction(){
        let member = {
            'name' : 'Manos',
            'icon' : './Icons/man0.png'
        };
        let file = {
            'name' : 'Alarm Clock Rings',
            'icon' : './Icons/clock.png'
        }
        ui.pushBackAction(member, file, '#D4FFDE','Creation', '01:05');
    }

    function pushFrontAction(){
        let member = {
            'name' : 'Manos',
            'icon' : './Icons/man0.png'
        };
        let file = {
            'name' : 'Alarm Clock Rings',
            'icon' : './Icons/clock.png'
        }
        ui.pushBackAction(member, file, 'red','Creation', '01:05');
    }

    function addSharedPersonalFileToMe(){
        let file = {
            'name': 'Some file 1',
            'icon': './Icons/clock.png',
            'color': 'blue',
        };

        let members = [
            {
                'name' : 'John Doe',
                'isMaster': false,
                'hasFloor': true
            },
            {
                'name' : 'Johnathan Doevic',
                'isMaster': false,
                'hasFloor': true
            }
        ];

        ui.addSharedPersonalFileToMe(file, members);
    }

    function addSharedPersonalFileFromMe(){
        let file = {
            'name': 'Some file 1',
            'icon': './Icons/clock.png',
            'color': 'blue',
        };

        let members = [
            {
                'name' : 'John Doe 2',
                'isMaster': false,
                'hasFloor': true
            },
            {
                'name' : 'Johnathan Doevic 2',
                'isMaster': false,
                'hasFloor': true
            }
        ];

        ui.addSharedPersonalFileFromMe(file, members);
    }

    this.addMemberMe = addMemberMe;
    this.addMember = addMember;
    this.removeMember = removeMember;
    this.addSuggestionAnnotation = addSuggestionAnnotation;
    this.addNoteAnnotation = addNoteAnnotation;
    this.removeMemberFileAnotation = removeMemberFileAnotation; 
    this.addPersonalFile = addPersonalFile;
    this.clearAndAddMemberPersonalFiles = clearAndAddMemberPersonalFiles;
    this.pushFrontAction = pushFrontAction;
    this.pushBackAction = pushBackAction;
    this.addSharedPersonalFileFromMe = addSharedPersonalFileFromMe;
    this.addSharedPersonalFileToMe = addSharedPersonalFileToMe;
}


