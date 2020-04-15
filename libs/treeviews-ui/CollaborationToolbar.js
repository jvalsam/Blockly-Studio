$(function () {
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

    $('#collaboration-members').jstree({
        "plugins": [
            "wholerow",
            "colorv",
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
                {
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
                {
                    'id': 'me-Manos',
                    'parent': 'members-me',
                    'type': 'other',
                    'text': 'Manos',
                    'icon': './Icons/man0.png',
                    'a_attr': membersA
                },
                {
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
                {
                    'id': 'collaborators-Mary',
                    'parent': 'members-collaborators',
                    'type': 'smart_object',
                    'text': 'Mary',
                    'icon': './Icons/woman0.png',
                    'a_attr': membersA
                },
                {
                    'id': 'collaborators-James',
                    'parent': 'members-collaborators',
                    'type': 'smart_object',
                    'text': 'James',
                    'icon': './Icons/man1.png',
                    'a_attr': membersA
                },
                {
                    'id': 'file-Alarm Clock Rings',
                    'parent': 'collaborators-James',
                    'type': 'smart_object',
                    'text': 'Alarm Clock Rings',
                    'icon': './Icons/clock.png',
                    'a_attr': fileA
                },
                {
                    'id': 'file-Water Is Ready',
                    'parent': 'collaborators-James',
                    'type': 'smart_object',
                    'text': 'Water Is Ready',
                    'icon': './Icons/water.png',
                    'a_attr': fileA
                },
                {
                    'id': 'collaborators-Mark',
                    'parent': 'members-collaborators',
                    'type': 'smart_object',
                    'text': 'Mark',
                    'icon': './Icons/man0.png',
                    'a_attr': membersA
                }
            ]
        }
    });

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
});