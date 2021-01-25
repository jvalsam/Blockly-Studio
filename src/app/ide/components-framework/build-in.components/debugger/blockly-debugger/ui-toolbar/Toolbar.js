import { post } from "jquery";
import ToolbarViewTmpl from "./toolbar-view.tmpl";


export class Toolbar {
    constructor(container, callback) {

        this._variablessArray = [];
        this._distinctParents = [];
        this._watches = [];
        this._breakpoints = [];
        this._injectHtml(container, callback);
        this._initTrees();
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
    _initTrees() {
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

            //let tree_data = this._ExtractTreeData(data);

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
                    'data': []
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

            $(".collapsible").each(function(index){
                $(this).click(function (){
                    this.classList.toggle("active"); 
                    let content = this.nextElementSibling; 
                    if (content.style.display === "inline-block") { 
                        content.style.display = "none";
                    } else { 
                        content.style.display = "inline-block";
                    } 
                })
            });
    }

    _injectHtml(container, callback) {
        if (typeof container === 'string')
            $(container).append(ToolbarViewTmpl);
        else
            container.append(ToolbarViewTmpl);

        callback();
    }

    // Dynamically adds nodes to the debugger-variables. Position can be 'first' or 'last'.
    _createNode(parent_node, new_node_id, new_node_text, new_node_icon, position) {
        if(parent_node === '#'){
           $('#debugger-variables').jstree().create_node('#',{ "text": new_node_text, "id": new_node_id, "icon": new_node_icon },position);
        } else {
           $('#debugger-variables').jstree().create_node($(parent_node),{ "text": new_node_text, "id": new_node_id, "icon": new_node_icon },position);
        }
    }
    
    _createVariable(variable, callback = undefined) {
        if (variable.parent === undefined) {
            console.log('parent is undefined in _createVariable');
        } else {
            let parent_id = variable.parent.replace(/ /g,"_");
            let variable_id = variable.name.replace(/ /g,"_");
            if(!this._distinctParents[parent_id]) {
                //if name does not exist in the object then create a parent  
                this._distinctParents[parent_id] = true; //make name to true in the object 
                this._createNode('#', parent_id, variable.parent, variable.icon, 'last');
            }
            this._createNode(`#${parent_id}`, variable_id, variable.name, variable.icon, 'last');
        } 
    }


    /* API */

    /**
     * Creates a single variable to the variables tree
     * @param {String} parent Parent name of the variable
     * @param {String} name Name of the variable
     * @param {String} icon Icon of the variable
     * @param {String} color Color of the variable
     * @param {Function} callback
     */
    createVariable(parent,name,icon,color, callback = undefined) {
        $('#debugger-variables').bind('ready.jstree', () => {
            this._createVariable(parent,name,icon,color, callback);
        });
    }
    /**
     * Creates variables from an array to the variables tree
     * @param {Object} variables 
     * @param {Function} callback
     */
    createVariables(variables,callback = undefined){
        $('#debugger-variables').bind('ready.jstree', () => {
            variables.forEach(element => {
                this._createVariable(element.parent,element.name,element.icon,element.color, callback);
            });
        });
    }
    /**
     * Removes variable from Variables tree
     * @param {Object} variable 
     */
    removeVariable(variable) {
        this._debuggerVariablesTree.delete_node(this._VARIABLE_PREFIX + variable.name);
    }

    /**
     * Adds a breakpoint to the toolbar
     * @param {block_id}
     * @param {event_name}
     * @param {color}
     * @param {icon}
     */
    addBreakpoint(block_id,event_name,color,icon) {

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
