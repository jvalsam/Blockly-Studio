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

// enum InstanceState {
//     close =0,
//     open =1,
//     focusOut =2
// }

export class BlocklyInstance {
    constructor(
        pitemId,
        selector,
        type,
        config,
        _toolbox,
        src
    ) {
        this.pitemId = pitemId;
        this.selector = selector;
        this.type = type;
        this.config = config;
        this.src = src;
        this.wsp = null;
        this.state = "init";
        this.toolbox = () => _toolbox(type);
    }

    open() {
        let toolbox = this.toolbox();
        var toolboxXml = Blockly.Xml.textToDom(toolbox.gen);

        this.wsp = Blockly.inject(
            this.selector,
            {
                // "media": "../../../../.././media/",
                toolbox: toolboxXml
            });
        // fix width
        $("#"+this.selector).children()[0].style.width = "100%";
        $("#" + this.selector).children()[0].style.height = "100%";
    }
}
