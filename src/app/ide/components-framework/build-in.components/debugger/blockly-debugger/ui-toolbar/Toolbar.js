import ToolbarViewTmpl from "./toolbar-view.tmpl";

export class Toolbar {
    constructor(container, callback) {

        this._DataObjectsA = {
            'style': "                               \
                            display: flex;              \
                            align-items: center;        \
                            flex-wrap: wrap;            \
                            height : 33px;              \
                            margin-bottom: 4px;         \
                            margin-top: 4px;            \
                        "
        };

        this._fileA = {
            'style': "                               \
                            display: flex;              \
                            align-items: center;        \
                            flex-wrap: wrap;            \
                            height : 19px;              \
                            margin-bottom: 5px;         \
                            font-size: 16px;            \
                        "
        };

        this._DataObjectRequests = {};
        this._injectHtml(container, callback);
        this._initTrees();

        /*
           Trees
       */
        this._DataObjects = $.jstree.reference('#debugger-DataObjects');
        this._personalFiles = $.jstree.reference('#personal-files');
        this._debugVariables = $.jstree.reference('#debugger-variables');
        //this._debugWatches = $.jstree.reference('#debugger-watches');
        /*
            HTML IDS
        */

        //tree root ids
        this._PERSONAL_FILES = 'personal-files';
        this._VARIABLES_ = 'debugger-variables';
        //prefixes for adding new nodes
        this._ANNOTATION_FILE_PREFIX = '-file-';
        this._PERSONAL_FILE_PREFIX = 'personal-file-';
        this._VARIABLE_PREFIX = 'variable-';
    }

    /*
        PRIVATE FUNCTIONS
    */
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
                        },
                        'a_attr': this._DataObjectsA
                    },
                ]
            }
        });

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
                'data': [
                    {
                        'id': 'debugger-variables',
                        'parent': '#',
                        'type': 'other',
                        'text': 'Smart Automations',
                        'icon': false,
                        'state': {
                            'opened': true,
                        },
                        'a_attr': this._DataObjectsA
                    },
                ]
            }
        });

        $.jstree.defaults.core.animation = false;


        function TabSwitcher(tab1, tab2, tab3) {
            let focused = tab1;
            this.focusTab = function (tab) {
                if (tab != focused) {
                    if(tab == tab1) {
                        $('#' + tab1).show();
                        $('#' + tab2).hide();
                        $('#' + tab3).hide();
                    } else if (tab == tab2){
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


    _addVariable(variable, parent = undefined, callback = undefined) {
        var node = {
            'id': this._VARIABLE_PREFIX + variable.name,
            'text': variable.name,
            'icon': variable.icon,
            'a_attr': this._DataObjectsA
        };

        //let dest = this._debugVariables.get_node($("debugger-variables"));
        if(parent !== undefined){
            dest = this._debugVariables.get_node(this._VARIABLE_PREFIX + parent.name);
        }
        this._debugVariables.create_node('#', node, "last", callback);
    }

    /* API */

    /**
     * Adds variable to variables tree
     * @param {Object} variable Should contain name and icon
     * @param {Object} parent If included should contain name
     * @param {Function} callback
     */
    addVariable(variable, parent=undefined, callback = undefined) {
        this._addVariable(variable, parent, callback);
    }

    /**
     * Removes variable from Variables tree
     * @param {Object} variable 
     */
    removeVariable(variable) {
        this._Variables.delete_node(this._VARIABLE_PREFIX + variable.name);
    }

    /**
     * @param {Object} file The file, should contain path, name, icon, color. 
     *                      Path: is of the form folder1/folder2 and DOES NOT end up with the file's name
     *                      Name: the name of the file
     *                      Icon: the path to the icon: e.g. 
     *                      Color: the color of the file
     */
    addPersonalFile(file, cb = undefined) {
        var path = file.path;

        var ids = path.split('/');
        var currId = '.', prev = this._PERSONAL_FILES;
        var node;

        // add folders if needed
        for (var i = 0; i < ids.length; i++) {
            currId += '/' + ids[i];
            if (!this._personalFiles.get_node(this._PERSONAL_FILE_PREFIX + currId)) {
                this._personalFiles.create_node(prev, {
                    'id': this._PERSONAL_FILE_PREFIX + currId,
                    'text': ids[i],
                    'icon': false,
                    'a_attr': this._fileA
                });
            }
            prev = this._PERSONAL_FILE_PREFIX + currId;
        }

        //add the file
        currId += '/' + file.name;
        if (!this._personalFiles.get_node(this._PERSONAL_FILE_PREFIX + currId)) {
            this._personalFiles.create_node(prev, {
                'id': this._PERSONAL_FILE_PREFIX + currId,
                'text': file.name,
                'icon': file.icon ? file.icon : '',
                'color': file.color ? file.color : 'red',
                'a_attr': this._fileA
            },
                'last',
                cb);
            console.log(file);

            let node = this._personalFiles.get_node(this._PERSONAL_FILE_PREFIX + currId);
            node['color'] = file.color ? file.color : 'red';
            this._personalFiles.redraw_node(this._PERSONAL_FILE_PREFIX + currId);
        }
    }

    /**
     * 
     * @param {String} DataObjectName The DataObject's name
     * @param {Array} files Each file, should contain path, name, icon, color.
     *                      Path: is of the form folder1/folder2 and DOES NOT end up with the file's name
     *                      Name: the name of the file
     *                      Icon: the path to the icon: e.g. 
     *                      Color: the color of the file
     * @param {function} cb Callback
     */
    clearAndAddDataObjectPersonalFiles(DataObjectName, files, cb = undefined) {
        this._personalFiles.delete_node(this._PERSONAL_FILES);
        this._personalFiles.create_node('#', {
            'id': 'personal-files',
            'type': 'other',
            'text': 'Personal Files - ' + DataObjectName,
            'icon': false,
            'state': {
                'opened': true,
            },
            'a_attr': this._DataObjectsA
        },
            'last',
            function () {
                if (!files.length) cb();
            });

        for (var i = 0; i < files.length - 1; i++)
            this.addPersonalFile(files[i]);

        if (files.length) this.addPersonalFile(files[files.length - 1], cb);
    }
}

/* Examples */

export function Toolbar_API_Examples(ui) {
    
    function makeDummyVars() {
        let var1 = {
            'name': 'Automations for Basic Tasks',
            'icon': false
        };
        let var2 = {
            'name': 'Automations for conditional Tasks',
            'icon': false
        }
        let var3 = {
            'name': 'Automations for scheduled Tasks',
            'icon': false
        }
        let var4 = {
            'name': 'smart device groups',
            'icon': false
        }
        let var5 = {
            'name': 'smart devices',
            'icon': false
        }
        ui.addVariable(var1);
        ui.addVariable(var2);
        ui.addVariable(var3);
        ui.addVariable(var4);
        ui.addVariable(var5);
    }

    makeDummyVars();
}


