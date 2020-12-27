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
        //this._debugVariables = $.jstree.reference('#debugger-variables');
        //this._debugWatches = $.jstree.reference('#debugger-watches');
        /*
            HTML IDS
        */

        //tree root ids
        this._PERSONAL_FILES = 'personal-files';

        //prefixes for adding new nodes
        this._ANNOTATION_FILE_PREFIX = '-file-';
        this._PERSONAL_FILE_PREFIX = 'personal-file-';
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

        let DataObjects = $.jstree.reference('#debugger-DataObjects');

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

        $.jstree.defaults.core.animation = false;


        function TabSwitcher(tab1, tab2, tab3) {
            let focused = tab1;
            this.focusTab = function (tab) {
                if (tab != focused) {
                    $('#' + tab1).toggle();
                    $('#' + tab2).toggle();
                    $('#' + tab3).toggle();
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


    _addDataObject(DataObject, me, cb = undefined) {
        var node = {
            'id': (me ? this._DataObject_ME_PREFIX : this._DataObject_PREFIX) + DataObject.name,
            'text': DataObject.name,
            'icon': DataObject.icon,
            'a_attr': this._DataObjectsA
        };

        let dest = me ? this._COLLABORATOR_ME : this._COLLABORATORS;

        if (!this._DataObjects.get_node(dest)) {

            if (!this._DataObjectRequests[dest])
                this._DataObjectRequests[dest] = [];

            this._DataObjectRequests[dest].push(node);
        } else
            this._DataObjects.create_node(dest, node, "last", cb);
    }

    /* API */

    /**
     * 
     * @param {Object} DataObject Should contain name and icon
     * @param {Function} cb 
     */
    addDataObject(DataObject, cb = undefined) {
        this._addDataObject(DataObject, false, cb);
    }

    removeDataObject(DataObjectName) {
        this._DataObjects.delete_node(this._DataObject_PREFIX + DataObjectName);
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

    /*function makeDummyFiles() {
        var somefile1 = {
            'path': 'Whatever1/Whatever2',
            'name': 'example1',
            'color': 'red',
            'icon': './Icons/water.png'
        };
        var somefile2 = {
            'path': 'Folder1/Folder2/Folder3',
            'name': 'example2',
            'color': 'blue',
            'icon': './Icons/water.png'
        };
        var somefile3 = {
            'path': 'Folder1/Folder2/Folder3',
            'name': 'example3',
            'color': 'purple',
            'icon': './Icons/water.png'
        };
        var files = [somefile1, somefile2, somefile3];
        ui.clearAndAddDataObjectPersonalFiles('My', files);
    }

    makeDummyFiles();*/
}


