import { post } from "jquery";
import ToolbarViewTmpl from "./toolbar-view.tmpl";

export class Toolbar {
    constructor(container, callback) {

        this._variablessArray = [];
        this._injectHtml(container, callback);

        /* Trees */
        this._DataObjects = $.jstree.reference('#debugger-DataObjects');
        this._personalFilesTree = $.jstree.reference('#personal-files');
        this._debuggerVariablesTree = $.jstree.reference('#debugger-variables');
        //this._debugWatches = $.jstree.reference('#debugger-watches');

        /* HTML IDs */
        //tree root ids
        this._PERSONAL_FILES = 'personal-files';
        this._VARIABLES_ = 'debugger-variables';
        //prefixes for adding new nodes
        this._ANNOTATION_FILE_PREFIX = '-file-';
        this._PERSONAL_FILE_PREFIX = 'personal-file-';
        this._VARIABLE_PREFIX = 'variable-';
    }

    /* private functions */
    _initTrees(data) {
            $('#debugger-DataObjects').jstree({
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

            //let DataObjects = $.jstree.reference('#debugger-DataObjects');

            $('#personal-files').jstree({
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
                            'text': 'Personal Files',
                            'icon': false,
                            'state': {
                                'opened': true,
                            }
                        },
                    ]
                }
            });

            let tree_data = this._ExtractTreeData(data);

            $('#debugger-variables').jstree({
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
                    'data': tree_data
                }
            });

            $.jstree.defaults.core.animation = false;


            function TabSwitcher(tab1, tab2, tab3) {
                let focused = tab1;
                this.focusTab = function (tab) {
                    if (tab != focused) {
                        if (tab == tab1) {
                            $('#' + tab1).show();
                            $('#' + tab2).hide();
                            $('#' + tab3).hide();
                        } else if (tab == tab2) {
                            $('#' + tab1).hide();
                            $('#' + tab2).show();
                            $('#' + tab3).hide();
                        } else {
                            $('#' + tab1).hide();
                            $('#' + tab2).hide();
                            $('#' + tab3).show();
                        }
                        focused = tab;
                    }
                };
            }

            let tabSwitcher = new TabSwitcher('debugger-variables', 'debugger-watches', 'debugger-explanations');
            $('#debugger-variables-tab-ui').click(function () {
                tabSwitcher.focusTab('debugger-variables');
                $('#debugger-watches-tab-ui').removeClass('debugger-tab-active');
                $('#debugger-explanations-tab-ui').removeClass('debugger-tab-active');
                $('#debugger-variables-tab-ui').removeClass('debugger-tab-active').addClass('debugger-tab-active');
            });
            $('#debugger-watches-tab-ui').click(function () {
                tabSwitcher.focusTab('debugger-watches');
                $('#debugger-variables-tab-ui').removeClass('debugger-tab-active');
                $('#debugger-explanations-tab-ui').removeClass('debugger-tab-active');
                $('#debugger-watches-tab-ui').removeClass('debugger-tab-active').addClass('debugger-tab-active');
            });
            $('#debugger-explanations-tab-ui').click(function () {
                tabSwitcher.focusTab('debugger-explanations');
                $('#debugger-variables-tab-ui').removeClass('debugger-tab-active');
                $('#debugger-watches-tab-ui').removeClass('debugger-tab-active');
                $('#debugger-explanations-tab-ui').removeClass('debugger-tab-active').addClass('debugger-tab-active');
            });
    }

    _injectHtml(container, callback) {
        if (typeof container === 'string')
            $(container).append(ToolbarViewTmpl);
        else
            container.append(ToolbarViewTmpl);

        callback();
    }

    _ExtractTreeData(input_data) {
        let treeData = [];
        let distinctParents = {};
        $.each(input_data, function (i, data) {
            let parent_id = data.parent.replace(/ /g,"_"); // replace spaces with underscores to use as id
            let child_id = data.name.replace(/ /g,"_");
            if (!distinctParents[data.parent]) {
                //if name does not exist in the object then create a parent  
                distinctParents[data.parent] = true; //make name to true in the object  
                //parent node  
                treeData.push({
                    id: parent_id,
                    parent: "#",
                    text: data.parent,
                    type: "folder"
                });
                //child node  
                treeData.push({
                    id: child_id,
                    parent: parent_id,
                    text: data.name,
                    type: "file"
                });
            } else {
                //child node  
                treeData.push({
                    id: child_id,
                    parent: parent_id,
                    text: data.name,
                    type: "file"
                });
            }
        });
        return treeData;
    }

    // Dynamically adds nodes to the debugger-variables. Position can be 'first' or 'last'.
    _createNode(parent_node, new_node_id, new_node_text, new_node_icon, position) {
        //let debuggerVariablesTree = $.jstree.reference('#debugger-variables');
        //let parent = $('#debugger-variables').jstree('get_selected');
        //$('#debugger-variables').jstree('create_node', $(parent_node), { "text": new_node_text, "id": new_node_id, "icon": new_node_icon }, position, false, false);
        let new_node = $('#debugger-variables').jstree().create_node($(parent_node),{ "text": new_node_text, "id": new_node_id, "icon": new_node_icon },position);
        console.log(new_node);
    }
    
    _addVariable(variable, callback = undefined) {
        if (variable.parent === undefined) {
            console.log(variable.parent);
            //this._createNode('#debugger-variables', this._VARIABLE_PREFIX + variable.name, variable.name, variable.icon, 'last');
        } else {
            let parent = variable.parent.replace(/ /g,"_");
            this._createNode(`#${parent}`, variable.name, variable.name, variable.icon, 'last');
            //tree.create_node(this._VARIABLE_PREFIX + variable.parent, node, "last", callback);
        }
        // parrent issue 1
        //let dest = this._debuggerVariablesTree.get_node($("debugger-variables"));
        /*if (parent !== undefined) {
            dest = this._debuggerVariablesTree.get_node(this._VARIABLE_PREFIX + parent.name);
        }*/
        //this._debuggerVariablesTree.create_node('#', node, "last", callback);
    }

    /* API */

    /**
     * Initiates the trees of the toolbar.
     * Callback function can use this object.
     * @param {Function} callback 
     */
    init(data){
        //callback.bind(this)();
        this._initTrees(data);
    }

    /**
     * Adds a single variable to variables tree
     * @param {Object} variable Should contain name, icon and parent
     * @param {Function} callback
     */
    addVariable(variable, callback = undefined) {
        $('#debugger-variables').bind('ready.jstree', () => {
            this._addVariable(variable, callback);
        });
    }

    /**
     * Removes variable from Variables tree
     * @param {Object} variable 
     */
    removeVariable(variable) {
        this._debuggerVariablesTree.delete_node(this._VARIABLE_PREFIX + variable.name);
    }

}

/* Examples */

export function Toolbar_API_Examples(ui) {

    function makeDummyVars() {
        data = [{
            'name': 'Conditional Task 1',
            'parent': 'Automations for Conditional Tasks',
            'icon': false
        },
        {
            'name': 'Automations for scheduled Tasks 4',
            'parent': 'Automations for scheduled Tasks',
            'icon': false
        }]



        makeDummyVars();
    }

}
