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
        this._debuggerVariablesTree = $.jstree.reference('#debugger-variables');

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
    _createTree(selector){
        $(selector).jstree({
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
    }

    _initTabSwitcher(tab1,tab2,tab3) {
        function TabSwitcher(tab1, tab2, tab3) {
            let focused = tab1;
            this.focusTab = function (tab) {
                if (tab != focused) {
                    if (tab == tab1) {
                        console.log(tab1 + " " + tab2 + " " + tab3);
                        $('#' + tab1).show();
                        $('#' + tab2).hide();
                        $('#' + tab3).hide();
                    } else if (tab == tab2) {
                        console.log(tab2 + " " + tab);
                        $('#' + tab1).hide();
                        $('#' + tab2).show();
                        $('#' + tab3).hide();
                    } else {
                        console.log(tab1 + " " + tab2 + " " + tab3 + " <->" + tab);
                        $('#' + tab1).hide();
                        $('#' + tab2).hide();
                        $('#' + tab3).show();
                    }
                    focused = tab;
                }
            };
        }
        return new TabSwitcher(tab1,tab2,tab3);
    }

    _initTabSwitcherEvents(tabSwitcher,focusContent,tab1,tab2,tab3,activeClass){
        $('#'+ tab1).click(function () {
            tabSwitcher.focusTab(focusContent);
            $('#'+ tab2).removeClass(activeClass);
            $('#'+ tab3).removeClass(activeClass);
            $('#'+ tab1).removeClass(activeClass).addClass(activeClass);
        });
    }

    _initTrees() {
        this._createTree("#debugger-variables");

        const tabSwitcher = this._initTabSwitcher('debugger-variables', 'debugger-watches', 'debugger-explanations');
        this._initTabSwitcherEvents(tabSwitcher,'debugger-variables','debugger-variables-tab-ui','debugger-explanations-tab-ui','debugger-watches-tab-ui','debugger-tab-active');
        this._initTabSwitcherEvents(tabSwitcher,'debugger-explanations','debugger-explanations-tab-ui','debugger-variables-tab-ui','debugger-watches-tab-ui','debugger-tab-active');
        this._initTabSwitcherEvents(tabSwitcher,'debugger-watches','debugger-watches-tab-ui','debugger-variables-tab-ui','debugger-explanations-tab-ui','debugger-tab-active');

        $(".collapsible").each(function(index){
            $(this).click(function (){
                this.classList.toggle("active"); 
                let content = this.nextElementSibling; 
                if (content.style.display   != "none") { 
                    content.style.display = "none";
                } else { 
                    content.style.display = "inline-block";
                }
            });
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
    _createNode(parent_node, new_node_id, new_node_text, new_node_icon,new_node_color, position) {
        let new_node = { 
            "text": new_node_text,
            "id": new_node_id,
            "icon": new_node_icon,
            "color":new_node_color 
        };
        if(parent_node === '#'){
           $('#debugger-variables').jstree().create_node('#' ,new_node ,position);
        } else {
           $('#debugger-variables').jstree().create_node($(parent_node) ,new_node ,position);
        }
    }
    
    _createVariable(parent,name,icon,color,callback = undefined) {
        if (parent === undefined) {
            console.log('parent is undefined in _createVariable');
        } else {
            let parent_id = parent.replace(/ /g,"_"); // replace spaces with _
            let variable_id = name.replace(/ /g,"_");
            if(!this._distinctParents[parent_id]) {
                //if name does not exist in the object then create a parent  
                this._distinctParents[parent_id] = true; //make name to true in the object 
                this._createNode('#', parent_id, parent, icon, color, 'last');
            }
            this._createNode(`#${parent_id}`, variable_id, name, icon, color, 'last');
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
        this._addBreakpoint(block_id,name,color,icon);
    }

    /**
     * Adds a breakpoint to the toolbar
     * @param {block_id}
     */
    removeBreakpoint(block_id) {
        this._removeBreakpoint(block_id);
    }

    /**
     * Adds a watch to the toolbar from an element
     * @param {element_name}
     * @param {data}
     * @param {color}
     * @param {icon}
     */
    addWatch(block_id,event_name,color,icon) {
        this._addWatch(block_id,event_name,color,icon);
    }

    /**
     * Updates watch of element_name
     * @param {element_name}
     * @param {data}
     */
    updateWatch(element_name,data) {
        this._updateWatch(element_name.data);
    }

    /**
     * Removes watch with element_name
     * @param {element_name}
     * @param {data}
     */
    removeWatch(element_name){
        this._removeWatch(element_name);
    }

    /**
     * returns true if an element is watched based on its name otherwise returns false
     * @param {element_name}
     * @param {data}
     */
    isWatched(element_name){
        this._isWatched(element_name);
    }

}

