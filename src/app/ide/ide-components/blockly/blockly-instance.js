import * as Blockly from "blockly";

export class BlocklyConfig {
    constructor(_name, _data) {
        this._name = _name;
        this._data = _data;
    }

    get name() {
        return this._name;
    }

    get data() {
        return this._data;
    }
}

const InstStateEnum = Object.freeze({
    INIT: 0,
    OPEN: 1,
    CLOSE: 2
});

const Privillege = Object.freeze({
    READ_ONLY: "READ_ONLY",
    EDITING: "EDITING"
});

export class BlocklyInstance {
    constructor(
        pitem,
        id,
        selector,
        type,
        config,
        _toolbox,
        _syncWSP,
        text
    ) {
        this.pitem = pitem;
        this.selector = selector;
        this.id = id;
        this.type = type;
        this.config = config;
        this.text = text;
        this.wsp = null;
        this.state = InstStateEnum.INIT;
        this.toolbox = () => _toolbox(type);
        this._syncWSP = (event) => _syncWSP(event);
    }

    get privilleges() {
        return this.pitem.getPrivileges();
    }

    static update_src(data, pitem) {
        if (!this._syncNotFocusedEditorId
            || this._syncNotFocusedInst !== data.editorId) {
            this._syncNotFocusedInst = document
                .getElementsByClassName("blockly-sync-editors-area-diplay-none");
            
            this._notFocusedWSP = Blockly.inject(
                this._syncNotFocusedInst,
                {
                    media: "../../../../../node_modules/blockly/media/",
                    toolbox: toolboxXml
                });

            let editorData = pitem.editorsData.find(e => e.id === editorId);

            var xml = Blockly.Xml.textToDom(editorData.data.text);
            Blockly.Xml.domToWorkspace(xml, this._notFocusedWSP);
        }

        let event = Blockly.Events.fromJson(data.event, this._notFocusedWSP);
        event.run(true);
    }

    calcPItemBlocklyArea() {
        this._blocklyArea = document.getElementById(this.id);
    }

    open() {
        if (this.state === InstStateEnum.OPEN) {
            return;
        }

        if (this.state === InstStateEnum.INIT) {
            // create new div with absolute position in the IDE
            let blocklySel = "blockly_" + this.id;
            $(".blockly-editors-area")
                .append(
                    "<div id=\""
                    + blocklySel
                    + "\" style=\"position: absolute\"></div>");
            this.calcPItemBlocklyArea();
            this._blocklyDiv = document.getElementById(blocklySel);
            
            this["initWSP_" + this.privilleges]();
            
            // load text
            if (this.text) {
                var xml = Blockly.Xml.textToDom(this.text);
                Blockly.Xml.domToWorkspace(xml, this.wsp);
            }
            
            window.addEventListener(
                'resize',
                (e) => this.onResize(e),
                false
            );
            this.onResize();
        }
        else {
            this._blocklyDiv.style.visibility = 'visible';
            this.calcPItemBlocklyArea();
            this.onResize();
        }

        this.state = InstStateEnum.OPEN;
    }

    onResize(e) {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        let element = this._blocklyArea;
        let x = 0;
        let y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        this._blocklyDiv.style.left = x + 'px';
        this._blocklyDiv.style.top = y + 'px';
        this._blocklyDiv.style.width = this._blocklyArea.offsetWidth + 'px';
        this._blocklyDiv.style.height = this._blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(this.wsp);
    }

    initWSP_EDITING() {
        let toolbox = this.toolbox();
        var toolboxXml = Blockly.Xml.textToDom(toolbox.gen);

        this.wsp = Blockly.inject(
            this._blocklyDiv, {
                media: "../../../../../node_modules/blockly/media/",
                toolbox: toolboxXml
            });
        
        this.changeWSPCB = (e) => this.onChangeWSP(e);
        this.wsp.addChangeListener(this.changeWSPCB);
    }

    initWSP_READ_ONLY() {
        this.wsp = Blockly.inject(
            this._blocklyDiv, {
                // "media": "../../../../.././media/",
                // toolbox: toolboxXml,
                readOnly: true
            });
    }

    close() {
        this.state = InstStateEnum.CLOSE;
        this._blocklyDiv.style.visibility = 'hidden';

        this._blocklyDiv.style.left = '0px';
        this._blocklyDiv.style.top = '0px';
        this._blocklyDiv.style.width = '0px';
        this._blocklyDiv.style.height = '0px';
    }

    syncWSP(json) {
        let event = Blockly.Events.fromJson(json, this.wsp);
        event.run(true);
    }

    onChangeWSP(event) {
        let priv = this.privilleges;
        let resp = (event instanceof Blockly.Events.Ui);
        if (resp || priv === Privillege.READ_ONLY) {
            return; // Don't mirror UI events.
        }
        let blockType = this.wsp.getBlockById(event.blockId).type;
        
        this._syncWSP(event.toJson());
    }

    editPrivilege() {
        if (this.privilleges === Privillege.READ_ONLY) {
            this.wsp.dispose();
        }
        else {
            this.wsp.removeChangeListener(this.changeWSPCB);
        }
        this["initWSP_"+this.privilleges]();
    }

    getText() {
        var xml = Blockly.Xml.workspaceToDom(this.wsp);
        return Blockly.Xml.domToText(xml);
    }

    undo() {
        this.wsp.undo(false);
    }

    redo() {
        this.wsp.undo(true);
    }

    updateToolbox(toolboxXml) {
        this.wsp.updateToolbox(toolboxXml);
    }

    xmlTextToDom(toolbox) {
        return Blockly.Xml.textToDom(toolbox);
    }

    getBlockById(blockId) {
        return this.wsp.getBlockById(blockId);
    }
}
