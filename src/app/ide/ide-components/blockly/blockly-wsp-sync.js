import { GetBlocklyWspOptions, Privillege } from "../blockly/blockly-instance";

function _BlocklyWSPSync() {
  this.instances = {};

  this.isLoaded = (id) => {
    return id in this.instances;
  };

  this.loadWSP = (id, src) => {
    let blocklySel = "blockly_" + id;
    $(".blockly-editors-area").append(
      '<div id="' + blocklySel + '" style="position: absolute"></div>'
    );
    let blocklyDiv = document.getElementById(blocklySel);

    this.instances[id] = Blockly.inject(
      blocklyDiv,
      GetBlocklyWspOptions(
        Privillege.READ_ONLY,
        "../../../../../node_modules/blockly/media/"
      )
    );

    if (src) {
      var xml = Blockly.Xml.textToDom(src);
      Blockly.Xml.domToWorkspace(xml, this.wsp);
    }
  };

  this.updateWSP = (id, json) => {
    let event = Blockly.Events.fromJson(json, this.instances[id]);
    event.run(true);
  };

  this.getSrc = (id) => {
    var xml = Blockly.Xml.workspaceToDom(this.instances[id]);
    return Blockly.Xml.domToText(xml);
  };

  this.dispose = (id) => {
    this.instances[id].dispose();
    delete this.instances[id];
  };

  this.disposeAll = () => {
    for (const id in this.instances) {
      this.dispose(id);
    }
  };
}

export const BlocklyWSPSync = new _BlocklyWSPSync();
