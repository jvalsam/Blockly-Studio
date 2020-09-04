export function CollaborationUI(container){
    
    let membersA = {
        'style' :   "                               \
                        display: flex;              \
                        align-items: center;        \
                        flex-wrap: wrap;            \
                        height : 33px;              \
                        margin-bottom: 4px;         \
                        margin-top: 4px;            \
                    "
    };
    
    let fileA = {
        'style' :   "                               \
                        display: flex;              \
                        align-items: center;        \
                        flex-wrap: wrap;            \
                        height : 19px;              \
                        margin-bottom: 5px;         \
                        font-size: 16px;            \
                    "
    };

    _injectHtml(container);
    _initTrees();

    /*
        Trees
    */
    var members = $.jstree.reference('#collaboration-members');
    var personalFiles = $.jstree.reference('#selected-member-files');

    /*
        HTML IDS
    */
    var COLLABORATORS = 'members-collaborators';
    var PERSONAL_FILES = 'personal-files'


    var MEMBER_PREFIX = 'collaborators-';
    var ANNOTATION_FILE_PREFIX = '-file-';
    var PERSONAL_FILE_PREFIX = 'personal-file-'

    /*
        PRIVATE FUNCTIONS
    */

    function _initTrees(){
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
    
        var members = $.jstree.reference('#collaboration-members');
    
        $('#selected-member-files').jstree({
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
                        'a_attr': membersA
                    },
                    {
                        'id': 'personal-files-Smart Objects',
                        'parent': 'personal-files',
                        'type': 'other',
                        'text': 'Smart Objects',
                        'icon': false,
                        'a_attr': fileA
                    },
                    {
                        'id': 'personal-files-Events',
                        'parent': 'personal-files',
                        'type': 'other',
                        'text': 'Events',
                        'icon': false,
                        'a_attr': fileA
                    },
                    {
                        'id': 'personal-files-Tasks',
                        'parent': 'personal-files',
                        'type': 'other',
                        'text': 'Tasks',
                        'icon': false,
                        'a_attr': fileA
                    },
                    {
                        'id': 'personal-files-Condition',
                        'parent': 'personal-files-Events',
                        'type': 'other',
                        'text': 'Condition',
                        'icon': false,
                        'a_attr': fileA
                    },
                    {
                        'id': 'personal-file-Alarm Clock Rings',
                        'parent': 'personal-files-Condition',
                        'type': 'smart_object',
                        'text': 'Alarm Clock Rings',
                        'icon': './Icons/clock.png',
                        'a_attr': fileA,
                        'color': 'red'
                    },
                    {
                        'id': 'file-Water Is Ready',
                        'parent': 'personal-files-Condition',
                        'type': 'smart_object',
                        'text': 'Water Is Ready',
                        'icon': './Icons/water.png',
                        'a_attr': fileA,
                        'color': 'blue'
                    },
                    {
                        'id': 'personal-files-Calendar',
                        'parent': 'personal-files-Events',
                        'type': 'other',
                        'text': 'Calendar',
                        'icon': false,
                        'a_attr': fileA
                    },
                ]
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
    
        var dummyTree1 = $.jstree.reference('#dummy-js-tree-1');
        
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
                'text': 'Shared Files',
                'icon': false,
                'state' : { 'opened' : true },
                'a_attr': membersA
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
                'data': [
                    {
                        'color': 'red',
                        'id': 'shared-from-me-Alarm Clock Rings',
                        'parent': '#',
                        'type': 'smart_object',
                        'text': 'Alarm Clock Rings',
                        'icon': './Icons/clock.png',
                        'a_attr': fileA,
                    },
                    {
                        'color': 'blue',
                        'id': 'shared-from-me-Water Is Ready',
                        'parent': '#',
                        'type': 'smart_object',
                        'text': 'Water Is Ready',
                        'icon': './Icons/water.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-from-me-Water Is Ready-Manos',
                        'parent': 'shared-from-me-Water Is Ready',
                        'type': 'smart_object',
                        'text': 'Manos',
                        'icon': './Icons/crown.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-from-me-Water Is Ready-Mary',
                        'parent': 'shared-from-me-Water Is Ready',
                        'type': 'smart_object',
                        'text': 'Mary',
                        'icon': './Icons/transparent.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-from-me-Water Is Ready-Mark',
                        'parent': 'shared-from-me-Water Is Ready',
                        'type': 'smart_object',
                        'text': 'Mark',
                        'icon': './Icons/pencil.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-from-me-Alarm Clock Rings-Manos',
                        'parent': 'shared-from-me-Alarm Clock Rings',
                        'type': 'smart_object',
                        'text': 'Manos',
                        'icon': './Icons/crown.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-from-me-Alarm Clock Rings-Mary',
                        'parent': 'shared-from-me-Alarm Clock Rings',
                        'type': 'smart_object',
                        'text': 'Mary',
                        'icon': './Icons/pencil.png',
                        'a_attr': fileA,
                    },
                ]
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
                'data': [
                    {
                        'color': 'red',
                        'id': 'shared-to-me-Mary-Alarm Clock Rings',
                        'parent': '#',
                        'type': 'smart_object',
                        'text': 'Alarm Clock Rings',
                        'icon': './Icons/clock.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-to-me-Mary-Alarm Clock Rings-Manos',
                        'parent': 'shared-to-me-Mary-Alarm Clock Rings',
                        'type': 'smart_object',
                        'text': 'Manos',
                        'icon': './Icons/pencil.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-to-me-Mary-Alarm Clock Rings-Mary',
                        'parent': 'shared-to-me-Mary-Alarm Clock Rings',
                        'type': 'smart_object',
                        'text': 'Mary',
                        'icon': './Icons/crown.png',
                        'a_attr': fileA,
                    },
                    {
                        'id': 'shared-to-me-Mary-Alarm Clock Rings-Mark',
                        'parent': 'shared-to-me-Mary-Alarm Clock Rings',
                        'type': 'smart_object',
                        'text': 'Mary',
                        'icon': 'transparent',
                        'a_attr': fileA,
                    },
                ]
            }
        });
    
        function TabSwitcher(tab1, tab2){
            var focused = tab1;
            this.focusTab = function(tab){
                if (tab != focused){
                    $('#' + tab1).toggle();
                    $('#' + tab2).toggle();
                    focused = tab;
                }
            };
        }
    
        var tabSwitcher = new TabSwitcher('collaboration-shared-from-me','collaboration-shared-to-me');
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
    
        var dummyTree2 = $.jstree.reference('#dummy-js-tree-2');
        
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
                'a_attr': membersA
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
            'a_attr': membersA
        }, 
        'last',
        function(){
            members.create_node('members',{
                'id': 'members-me',
                'parent': 'members',
                'type': 'other',
                'text': 'Me',
                'icon': false,
                'state' : {
                    'opened' : true,
                },
                'a_attr': membersA
            },
            'last', 
            function(){
                members.create_node('members-me',{
                    'id': 'me-Manos',
                    'parent': 'members-me',
                    'type': 'other',
                    'text': 'Manos',
                    'icon': './Icons/man0.png',
                    'a_attr': membersA
                });
            });
    
            members.create_node('members', {
                'id': 'members-collaborators',
                'parent': 'members',
                'type': 'other',
                'text': 'Collaborators',
                'icon': false,
                'state' : {
                    'opened' : true,
                },
                'a_attr': membersA
            },
            'last',
            function(){
                addMember('Mary', './Icons/woman0.png', function(){
                    addNoteAnnotation('Mary', 'Water Is Ready', 'blue', './Icons/water.png');
                });
                addMember('James', './Icons/man0.png', function(){
                    addSuggestionAnnotation('James', 'Water Is Ready', 'blue', './Icons/water.png');
                    addNoteAnnotation('James','Alarm Clock Rings', 'red', './Icons/clock.png');
                });
            });
        });
    }

    function _injectHtml() {
        let html =
        '<div id = "collaboration-toolbar"> \
            <div id = "collaboration-header-container" class = "vcenter"> \
                <div id = "collaboration-icon" class = "size30x30"> </div> \
                <div id = "collaboration-title"> Collaboration </div> \
                <div id = "collaboration-burger" class = "size22x22 middle-right"> </div> \
                <div class = "clear"></div> \
            </div> \
        \
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
                    <div class = "collaboration-recent-action"> \
                        <div class = "recent-action-row vcenter font-size16px"> \
                            <div class = "member-icon float-left"> </div> \
                            <div> Name </div> \
                            <div class = "middle-right vcenter"> \
                                <div class = "file-icon float-left"></div> \
                                Alarm Clock Rings \
                            </div> \
                        </div> \
                        <div class = "recent-action-last-row vcenter"> \
                            <div>Type: Creation</div> \
                            <div class = "middle-right">Time</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> '
        ;
        if (typeof container === 'string')
            $("#" + container).append(html);
        else
            container.append(html);
    }

    function _addMemberFileAnotation(member, file, icon, color, bubble_color, cb = undefined){
        var node = {
            'id': MEMBER_PREFIX + member + ANNOTATION_FILE_PREFIX + file,
            'text': file,
            'icon': icon,
            'a_attr': fileA
        };

        if (!members.get_node(node.id)){
            node.bubble_color = bubble_color;
            node.color = color; 
            members.create_node(MEMBER_PREFIX + member, node, 'last', cb);
        }
    }

    /**
     * 
     * @param {Object} member Should contain name, icon
     * @param {Object} file Should contain name, icon
     * @param {String} type
     * @param {String} time
     * @param {function} add The function that will be used for adding
     */
    function _addAction(member, file, type, time, add){
        let html = `                                                                                                \
            <div class = "collaboration-recent-action">                                                             \
                <div class = "recent-action-row vcenter font-size16px">                                             \
                    <div class = "member-icon float-left" style = "background-image: url(${member.icon});"></div>   \
                    <div> ${member.name} </div>                                                                     \
                    <div class = "middle-right vcenter">                                                            \
                        <div class = "file-icon float-left" style = "background-image: url(${file.icon});"></div>   \                                                  \
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

    /* API */

    function addMember(name, icon = "./Icons/man0.png", cb = undefined ){
        var node = {
            'id': MEMBER_PREFIX + name,
            'text': name,
            'icon': icon,
            'a_attr': membersA
        };

        members.create_node(COLLABORATORS, node, "last", cb);
    }

    function removeMember(name){
        members.delete_node(MEMBER_PREFIX + name);
    }

    function addSuggestionAnnotation(member, file, color = 'red', icon = './Icons/clock.png', cb = undefined){
        _addMemberFileAnotation(member, file, icon, color, 'purple', cb);
    }

    function addNoteAnnotation(member, file, color = 'red', icon = './Icons/clock.png', cb = undefined){
        _addMemberFileAnotation(member, file, icon, color, 'orange', cb);
    }

    function removeMemberFileAnotation(name, fileName){
        members.delete_node(MEMBER_PREFIX + name + ANNOTATION_FILE_PREFIX + fileName);
    }

    /**
     * @param {Object} file The file, should contain path, name, icon, color. 
     *                      Path: is of the form folder1/folder2 and DOES NOT end up with the file's name
     *                      Name: the name of the file
     *                      Icon: the path to the icon: e.g. ./Icons/clock.png
     *                      Color: the color of the file
     */
    function addPersonalFile(file, cb = undefined){
        var path = file.path;

        var ids = path.split('/');
        var currId = '.', prev = PERSONAL_FILES;
        var node;

        // add folders if needed
        for (var i = 0; i < ids.length; i++){
            currId += '/' + ids[i];
            if (!personalFiles.get_node(PERSONAL_FILE_PREFIX + currId)){
                personalFiles.create_node(prev, {
                    'id' : PERSONAL_FILE_PREFIX + currId,
                    'text': ids[i],
                    'icon': false,
                    'a_attr': fileA
                });
            }
            prev = PERSONAL_FILE_PREFIX + currId; 
        }

        //add the file
        currId += '/' + file.name;
        if (!personalFiles.get_node(PERSONAL_FILE_PREFIX + currId)){
            personalFiles.create_node(prev, {
                'id' : PERSONAL_FILE_PREFIX + currId,
                'text': file.name,
                'icon': file.icon ? file.icon : './Icons/clock.png',
                'color': file.color ? file.color : 'red',
                'a_attr': fileA
            }, 
            'last', 
            cb);

            personalFiles.get_node(PERSONAL_FILE_PREFIX + currId)['color'] = file.color ? file.color : 'red';
            personalFiles.redraw_node(PERSONAL_FILE_PREFIX + currId);
        }
    }

    /**
     * 
     * @param {String} member The member's name
     * @param {Array} files Each file, should contain path, name, icon, color.
     *                      Path: is of the form folder1/folder2 and DOES NOT end up with the file's name
     *                      Name: the name of the file
     *                      Icon: the path to the icon: e.g. ./Icons/clock.png
     *                      Color: the color of the file
     * @param {function} cb Callback
     */
    function clearAndAddMemberPersonalFiles(member, files, cb = undefined){
        personalFiles.delete_node(PERSONAL_FILES);
        personalFiles.create_node('#',{
            'id': 'personal-files',
            'type': 'other',
            'text': 'Personal Files - ' + member,
            'icon': false,
            'state' : {
                'opened' : true,
            },
            'a_attr': membersA
        },
        'last',
        function(){
            if (!files.length) cb();
        });
        
        for (var i = 0; i < files.length - 1; i++)
            addPersonalFile(files[i]);
        
        if (files.length) addPersonalFile(files[files.length - 1], cb);
    }

    this.pushFrontAction = function pushFrontAction(member, file, type, time){
        let recentActions = $("#collaboration-recent-actions-ui");
        let add = recentActions.prepend.bind(recentActions);
        _addAction(member, file, type, time, add);
    }

    this.pushBackAction = function pushBackAction(member, file, type, time){
        let recentActions = $("#collaboration-recent-actions-ui");
        let add = recentActions.append.bind(recentActions);
        _addAction(member, file, type, time, add);
    }

    this.addMember = addMember;
    this.removeMember = removeMember;
    this.addSuggestionAnnotation = addSuggestionAnnotation;
    this.addNoteAnnotation = addNoteAnnotation;
    this.removeMemberFileAnotation = removeMemberFileAnotation; 
    this.addPersonalFile = addPersonalFile;
    this.clearAndAddMemberPersonalFiles = clearAndAddMemberPersonalFiles;
}

// $(function () {

//     ui = new CollaborationUI("container");
//     examples = new CollaborationUI_API_Examples();

// });

/* Examples */

function CollaborationUI_API_Examples(){

    this.clearAndAddMemberPersonalFiles = function(){
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
        ui.clearAndAddMemberPersonalFiles('Manos', files);
    }

    this.addPersonalFile = function(){
        var somefile1 = {
            'path' : 'Folder1/Folder2/Folder3',
            'name' : 'example',
            'color' : 'blue',
            'icon' : './Icons/water.png'
        };
        ui.addPersonalFile(somefile1);
    }

    this.pushBackAction = function(){
        let member = {
            'name' : 'Manos',
            'icon' : './Icons/man0.png'
        };
        let file = {
            'name' : 'Alarm Clock Rings',
            'icon' : './Icons/clock.png'
        }
        ui.pushBackAction(member, file, 'Creation', '01:05');
    }

    this.pushFrontAction = function(){
        let member = {
            'name' : 'Manos',
            'icon' : './Icons/man0.png'
        };
        let file = {
            'name' : 'Alarm Clock Rings',
            'icon' : './Icons/clock.png'
        }
        ui.pushFrontAction(member, file, 'Creation', '01:05');
    }

}


