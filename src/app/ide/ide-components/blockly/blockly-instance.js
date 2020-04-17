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
        pitemId,
        selector,
        type,
        privillege,
        config,
        _toolbox,
        _syncWSP,
        src
    ) {
        this.pitemId = pitemId;
        this.selector = selector;
        this.type = type;
        this.privillege = privillege;
        this.config = config;
        this.src = src;
        this.wsp = null;
        this.state = InstStateEnum.INIT;
        this.toolbox = () => _toolbox(type);
        this._syncWSP = (data) => _syncWSP(data);
    }

    open() {
        if (this.state === InstStateEnum.OPEN) {
            return;
        }

        if (this.state === InstStateEnum.INIT) {
            // create new div with absolute position in the IDE
            let blocklySel = "blockly_" + this.selector;
            $(".blockly-editors-area")
                .append(
                    "<div id=\""
                    + blocklySel
                    + "\" style=\"position: absolute\"></div>");
            this._blocklyArea = document.getElementById(this.selector);
            this._blocklyDiv = document.getElementById(blocklySel);
            
            this["initWSP_" + this.privillege]();
            
            window.addEventListener(
                'resize',
                (e) => this.onResize(e),
                false
            );
            this.onResize();
        }
        else {
            // just activate display
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
                // "media": "../../../../.././media/",
                toolbox: toolboxXml
            });
        
        this.changeWSPCB = (e) => this.onChangeWSP(e);
        this.wsp.addChangeListener(this.changeWSPCB);
    }

    initWSP_READ_ONLY() {
        this.wsp = Blockly.inject(
            this._blocklyDiv, {
                // "media": "../../../../.././media/",
                toolbox: toolboxXml,
                readOnly: true
            });
    }

    close() {
        // just edit in display none
    }

    syncWSP(json) {
        let event = Blockly.Events.fromJson(json, this.wsp);
        event.run(true);
    }

    onChangeWSP(event) {
        if (event instanceof Blockly.Events.Ui) {
            return; // Don't mirror UI events.
        }

        this._syncWSP({
            id: this.selector,
            event: event.toJson(),
        });
    }

    editPrivilege() {
        if (this.privillege === Privillege.READ_ONLY) {
            this.wsp.dispose();
            this.privillege = Privillege.EDITING;
        }
        else {
            this.wsp.removeChangeListener(this.changeWSPCB);
            this.privillege = Privillege.READ_ONLY;
        }
        this["initWSP_"+this.privillege]();
    }
}
