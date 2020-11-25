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

export class DomainBlockTracker {
    // domainElemsMap: { confName: { editorId: { blockIds: [], ...more info?... } } }
    constructor(domainName, data) {
        this.domainName = domainName;
        this.domainElemsMap = data.domainElemsMap || {};
        this.counter = data.counter || 0;
    }

    fixMapInitiation(domainElementInstId) {
        this.domainElemsMap[domainElementInstId] = this.domainElemsMap[domainElementInstId] || {};
        this.domainElemsMap[domainElementInstId].blocks = this.domainElemsMap[domainElementInstId].blocks || [];
    }

    createBlockId (blockId, blockType, confName, editorId, pelemId, pelemName) {
        let domainElementInstId = blockType.split('$')[0];

        this.fixMapInitiation(domainElementInstId);
        
        this.domainElemsMap[domainElementInstId].blocks.push({
                blockId: blockId,
                conf: confName,
                blockType: blockType,
                pelemId: pelemId,
                pelemName: pelemName,
                editorId: editorId
            });

        ++this.counter;
    }

    deleteBlockId (blockId, domainElementInstId) {
        let index = this.domainElemsMap[domainElementInstId].blocks.findIndex(x => x.blockId === blockId);
        this.domainElemsMap[domainElementInstId].blocks.splice(index, 1);
        
        --this.counter;
    }

    deleteBlocksOfDomainElementInst(domainElementInstId) {
        let length = this.domainElemsMap[domainElementInstId].blocks.length;
        this.counter -= length;
        this.domainElemsMap[domainElementInstId].blocks.splice(0, length);
        delete this.domainElemsMap[domainElementInstId];
    }

    // requirements are not clear, we have all data...
    getBlockById(blockId) {
        for(const domElemInst in this.domainElemsMap) {
            let elem = this.domainElemsMap[domElemInst].blocks.find(x => x.blockId === blockId);
            if (elem) {
                return elem;
            }
        }
        return null;
    }

    getBlocksOfEditor(confName, editorId) {

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
            let blocklySel = "blockly_" + this.id;
            // create new div with absolute position in the IDE
            if (this.wsp) {
                this.wsp.dispose();
                this.wsp = null;
                $('#'+blocklySel).empty();
            }
            
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

    refresh() {
        this.state = InstStateEnum.INIT;
        this.open();
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

    deleteBlockById(blockId) {
        this.getBlockById(blockId).dispose();
    }
}
