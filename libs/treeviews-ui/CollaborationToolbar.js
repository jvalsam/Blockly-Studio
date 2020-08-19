var membersA = {
    'style' :   "                               \
                    display: flex;              \
                    align-items: center;        \
                    flex-wrap: wrap;            \
                    height : 33px;              \
                    margin-bottom: 4px;         \
                    margin-top: 4px;            \
                "
};

var fileA = {
    'style' :   "                               \
                    display: flex;              \
                    align-items: center;        \
                    flex-wrap: wrap;            \
                    height : 19px;              \
                    margin-bottom: 5px;         \
                    font-size: 16px;            \
                "
};


function CollaborationUI_API(){

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

   function _addMemberFileAnotation(member, file, icon, color, bubble_color, cb = undefined){
        var node = {
            'id': MEMBER_PREFIX + member + ANNOTATION_FILE_PREFIX + file,
            'text': file,
            'icon': icon,
            'a_attr': fileA
        };

        if (!members.get_node(node.id)){
            // members.create_node(MEMBER_PREFIX + member, node, 'last', cb);
            // members.get_node(node.id)['bubble_color'] = bubble_color;
            // members.get_node(node.id)['color'] = color;
            // members.redraw_node(node.id);
            node.bubble_color = bubble_color;
            node.color = color; 
            members.create_node(MEMBER_PREFIX + member, node, 'last', cb);
        }
    }

    /* API */

    this.addMember = function (name, icon = "./Icons/man0.png", cb = undefined ){
        var node = {
            'id': MEMBER_PREFIX + name,
            'text': name,
            'icon': icon,
            'a_attr': membersA
        };

        members.create_node(COLLABORATORS, node, "last", cb);
    }
    
    this.removeMember = function (name){
        members.delete_node(MEMBER_PREFIX + name);
    }

    this.addSuggestionAnnotation = function(member, file, color = 'red', icon = './Icons/clock.png', cb = undefined){
        _addMemberFileAnotation(member, file, icon, color, 'purple', cb);
    }

    this.addNoteAnnotation = function(member, file, color = 'red', icon = './Icons/clock.png', cb = undefined){
        _addMemberFileAnotation(member, file, icon, color, 'orange', cb);
    }

    this.removeMemberFileAnotation = function (name, fileName){
        members.delete_node(MEMBER_PREFIX + name + ANNOTATION_FILE_PREFIX + fileName);
    }


    /**
     * @param {Object} file The file, should contain path, name, icon, color. 
     *                      Path: is of the form folder1/folder2 and DOES NOT end up with the file's name
     *                      Name: the name of the file
     *                      Icon: the path to the icon: e.g. ./Icons/alarm.png
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
     *                      Icon: the path to the icon: e.g. ./Icons/alarm.png
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

    this.addPersonalFile = addPersonalFile;
    this.clearAndAddMemberPersonalFiles = clearAndAddMemberPersonalFiles;
}

var ui;
var examples;

$(function () {

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

    members = $.jstree.reference('#collaboration-members');

    $('#selected-member-files').jstree({
        "plugins": [
            "colorv",
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

    jstree = $.jstree.reference('#dummy-js-tree-1');
    
    /* 
    programmaticaly create the root node and a dummy node (so that the root has the > symbol on its left)
    and overide the double click event so that it toggles the "To me" and "From me" tabs that are out of the tree
    */
   

    jstree.create_node (
        '#',
        {
            'id': 'dummy-js-tree1-root',
            'parent': '#',
            'type': 'other',
            'text': 'Shared Files',
            'icon': false,
            'state' : { 'opened' : true },
            'a_attr': membersA
        },
        0,
        function cb(){
            jstree.create_node (   
                'dummy-js-tree1-root', 
                {
                    'parent': 'dummy-js-tree1-root',
                    'id' : 'dummy-js-tree-1-node'
                }, 
                0, 
                function cb(){
                    $('#dummy-js-tree1 jstree-children').remove();
                    $('#dummy-js-tree-1-node').remove();
                    
                    $("#dummy-js-tree-1").off("dblclick").dblclick(function(){
                        jstree.is_open('dummy-js-tree1-root') ? jstree.close_node('dummy-js-tree1-root') : jstree.open_node('dummy-js-tree1-root');
                        $.when($('#dummy-js-tree1 jstree-children').remove()).then( function(){
                            $.when($('#dummy-js-tree-1-node').remove()).then( function(){
                                $('#collaboration-shared-files-ui').toggle(200);
                            });
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

    function TabSwitcher(tab1, tab2, focused = tab1){
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

    ui = new CollaborationUI_API();
    examples = new CollaborationUI_API_Examples();

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
            ui.addMember('Mary', './Icons/woman0.png', function(){
                ui.addNoteAnnotation('Mary', 'Water Is Ready', 'blue', './Icons/water.png');
            });
            ui.addMember('James', './Icons/man0.png', function(){
                ui.addSuggestionAnnotation('James', 'Water Is Ready', 'blue', './Icons/water.png');
                ui.addNoteAnnotation('James','Alarm Clock Rings', 'red', './Icons/clock.png');
            });
        });
        
    });    
});

/* Examples */

function CollaborationUI_API_Examples(){
    var ui = new CollaborationUI_API();

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

}


