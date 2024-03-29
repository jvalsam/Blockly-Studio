import * as Blockly from "blockly";
import { parse } from "querystring";

// TODO: create infrastructure for the application-domain authoring and disconnect this depedence
import { HandleWorkspaceEvents } from "../../../application-domain-frameworks/domains-vpl-conf/IoT/vpdl/domain-static-elements/handle-workspace-events";

export function GetBlocklyWspOptions(mode, media, toolbox) {
  var options = {
    css: true,
    media: media,
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
  };
  if (mode === Privillege.READ_ONLY) options.readOnly = true;
  else{
    Object.assign(options, {
      toolbox: toolbox,
      collapse: true,
      comments: true,
      disable: true,
      maxBlocks: Infinity,
      trashcan: true,
      horizontalLayout: false,
      toolboxPosition: "start",
    });
  }
  return options;
}

export function GetBlockTypeByBlockId(blockId) {
  return blockId.split("$")[1];
}

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
    this.domainElemsMap[domainElementInstId] =
      this.domainElemsMap[domainElementInstId] || {};
    this.domainElemsMap[domainElementInstId].blocks =
      this.domainElemsMap[domainElementInstId].blocks || [];
  }

  createBlockId(blockId, blockType, confName, editorId, pelemId, pelemName) {
    let domainElementInstId = blockType.split("$")[0];

    this.fixMapInitiation(domainElementInstId);

    this.domainElemsMap[domainElementInstId].blocks.push({
      blockId: blockId,
      conf: confName,
      blockType: blockType,
      pelemId: pelemId,
      pelemName: pelemName,
      editorId: editorId,
    });

    ++this.counter;
  }

  deleteBlockId(blockId, domainElementInstId) {
    let index = this.domainElemsMap[domainElementInstId].blocks.findIndex(
      (x) => x.blockId === blockId
    );
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
    for (const domElemInst in this.domainElemsMap) {
      let elem = this.domainElemsMap[domElemInst].blocks.find(
        (x) => x.blockId === blockId
      );
      if (elem) {
        return elem;
      }
    }
    return null;
  }

  getBlocksOfEditor(confName, editorId) {}
}

const InstStateEnum = Object.freeze({
  INIT: 0,
  OPEN: 1,
  CLOSE: 2,
});

export const Privillege = Object.freeze({
  READ_ONLY: "READ_ONLY",
  EDITING: "EDITING",
});

export class BlocklyInstance {
  constructor(
    parent,
    pitem,
    id,
    selector,
    type,
    config,
    _toolbox,
    _syncWSP,
    text,
    _privilleges,
    zIndex,
    windowId,
    posize
  ) {
    this.parent = parent;
    this.pitem = pitem;
    this.selector = selector;
    this.id = id;
    this.type = type;
    this.config = config;
    this.text = text;
    this._privilleges = _privilleges;
    this.wsp = null;
    this.state = InstStateEnum.INIT;
    this.toolbox = () => _toolbox(type);
    this._syncWSP = (event) => _syncWSP(event);
    this._zIndex = zIndex;
    if (windowId === "BlocklyStudioIDE") this.windowApp = document;
    else
      this.windowApp = document.getElementById(windowId).contentWindow.document;
    this.posize = posize;
  }

  get privilleges() {
    return this._privilleges || this.pitem.getPrivileges();
  }

  update_privileges() {
    this.state = InstStateEnum.INIT;
    this.text = this.getText();
  }

  static update_src(data, pitem) {
    if (
      !this._syncNotFocusedEditorId ||
      this._syncNotFocusedInst !== data.editorId
    ) {
      this._syncNotFocusedInst = this.windowApp.getElementsByClassName(
        "blockly-sync-editors-area-diplay-none"
      );

      let toolbox = this.toolbox();
      var toolboxXml = Blockly.Xml.textToDom(toolbox.gen);

      this._notFocusedWSP = Blockly.inject(
        this._syncNotFocusedInst,
        GetBlocklyWspOptions(
          Privillege.EDITING,
          "../../../../../node_modules/blockly/media/",
          toolboxXml
        )
      );

      let editorData = pitem.editorsData.find((e) => e.id === editorId);

      var xml = Blockly.Xml.textToDom(editorData.data.text);
      Blockly.Xml.domToWorkspace(xml, this._notFocusedWSP);
    }

    let event = Blockly.Events.fromJson(data.event, this._notFocusedWSP);
    event.run(true);
  }

  destroy() {
    this.wsp.dispose();
    delete this.wsp;
    this._blocklyDiv.remove();
    delete this._blocklyDiv;
  }

  calcPItemBlocklyArea() {
    this._blocklyArea = this.windowApp.getElementById(this.id);
  }

  pinInfoInWSP() {
    this.wsp.editorId = this.id;
    this.wsp.pitem = this.pitem;
  }

  load() {
    let blocklySel = "blockly_" + this.id;
    $(".blockly-editors-area").append(
      '<div id="' + blocklySel + '" style="position: absolute"></div>'
    );
    this._blocklyDiv = this.windowApp.getElementById(blocklySel);

    this.wsp = Blockly.inject(
      this._blocklyDiv,
      GetBlocklyWspOptions(
        Privillege.READ_ONLY,
        "../../../../../node_modules/blockly/media/"
      )
    );
    this.pinInfoInWSP();

    if (this.text) {
      this.activeEvents = false;
      var xml = Blockly.Xml.textToDom(this.text);
      Blockly.Xml.domToWorkspace(xml, this.wsp);
    }
  }

  open() {
    if (this.state === InstStateEnum.OPEN) {
      return;
    }

    if (this.state === InstStateEnum.INIT || this.state === InstStateEnum.CLOSE) {
      let blocklySel = "blockly_" + this.id;
      // create new div with absolute position in the IDE
      if (this.wsp) {
        // this.text = this.getText();
        this.wsp.dispose();
        // this.wsp = null;
        $("#" + blocklySel).empty();
      } else {
        $(".blockly-editors-area").append(
          '<div id="' + blocklySel + '" style="position: absolute"></div>'
        );
        this.calcPItemBlocklyArea();

        this._blocklyDiv = document.getElementById(blocklySel);
      }

      if (this.__editorData) this._zIndex = this.__editorData.zIndex;
      this._blocklyDiv.style.setProperty("z-index", this._zIndex);

      this["initWSP_" + this.privilleges]();

      // load text if exists
      if (this.text) {
        this.activeEvents = false;
        var xml = Blockly.Xml.textToDom(this.text);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(xml,this.wsp);
      }

      window.addEventListener("resize", (e) => this.onResize(e), false);
      this._blocklyDiv.style.visibility = "visible";
      this.calcPItemBlocklyArea();
      this.onResize();
    }
    //TODO: TO FIX!
    // else {
    //   this._blocklyDiv.style.visibility = "visible";
    //   this.calcPItemBlocklyArea();
    //   this.onResize();
    // }

    this.state = InstStateEnum.OPEN;
  }

  updateWSPToText() {
    this.text = this.getText();
  }

  onResize(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element = this._blocklyArea;
    let x = 0;
    let y = 0;
    if (element.getAttribute("data-xOffset")) {
      x += parseInt(element.getAttribute("data-xOffset"));
      y += parseInt(element.getAttribute("data-yOffset"));
    }
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);

    let left = x + (this.posize ? this.posize.left : 0);
    let top = y + (this.posize ? this.posize.top : 0);
    let width = this._blocklyArea.offsetWidth
      + (this.posize ? this.posize.width : 0);
    let height = this._blocklyArea.offsetHeight
      + (this.posize ? this.posize.height : 0);

    // Position blocklyDiv over blocklyArea.
    this._blocklyDiv.style.left = left + "px";
    this._blocklyDiv.style.top = top + "px";
    this._blocklyDiv.style.width = width + "px";
    this._blocklyDiv.style.height = height + "px";
    Blockly.svgResize(this.wsp);
  }

  initWSP_EDITING() {
    let toolbox = this.toolbox();
    var toolboxXml = Blockly.Xml.textToDom(toolbox.gen);

    this.wsp = Blockly.inject(
      this._blocklyDiv,
      GetBlocklyWspOptions(
        Privillege.EDITING,
        "../../../../../node_modules/blockly/media/",
        toolboxXml
      )
    );
    this.pinInfoInWSP();

    this.changeWSPCB = (e) => this.onChangeWSP(e);
    this.wsp.addChangeListener(this.changeWSPCB);
  }

  initWSP_READ_ONLY() {
    this.wsp = Blockly.inject(
      this._blocklyDiv,
      GetBlocklyWspOptions(
        Privillege.READ_ONLY,
        "../../../../../node_modules/blockly/media/"
      )
    );
    this.pinInfoInWSP();
  }

  refresh() {
    this.state = InstStateEnum.INIT;
    this.updateWSPToText();
  }

  close() {
    this.updateWSPToText();

    this.state = InstStateEnum.CLOSE;
    this._blocklyDiv.style.visibility = "hidden";

    this._blocklyDiv.style.left = "0px";
    this._blocklyDiv.style.top = "0px";
    this._blocklyDiv.style.width = "0px";
    this._blocklyDiv.style.height = "0px";
  }

  syncWSP(json) {
    let event = Blockly.Events.fromJson(json, this.wsp);
    event.run(true);
  }

  onChangeWSP(event) {
    if (this.activeEvents) {
      let priv = this.privilleges;
      let resp = event instanceof Blockly.Events.Ui;
      if (resp || priv === Privillege.READ_ONLY) {
        return; // Don't mirror UI events.
      }
      // TODO: create infrastructure for the application-domain authoring and disconnect this depedence
      HandleWorkspaceEvents(event, this.wsp);
      this._syncWSP(event.toJson());
    }
    if (event.type === "finished_loading") {
      this.activeEvents = true;
    }
  }

  editPrivilege() {
    if (this.privilleges === Privillege.READ_ONLY) {
      this.wsp.dispose();
    } else {
      this.wsp.removeChangeListener(this.changeWSPCB);
    }
    this["initWSP_" + this.privilleges]();
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

  generateJavaScriptCode() {
    let code = Blockly.JavaScript.workspaceToCode(this.wsp);
    code.replace(/__DOLLAR__/g, "$");
    return code;
  }

  highlightBlock(blockId) {
    if (blockId !== "") {
      this.parent.openPItem(this.pitem);
    }

    this.wsp.highlightBlock(blockId);
  }

  setTraceOn_(value) {
    this.wsp.traceOn_ = value;
  }

  getTraceOn_() {
    return this.wsp.traceOn_;
  }
}

export function InitiateBlocklyGenerator() {
  Blockly.JavaScript.STATEMENT_PREFIX =
    "; runTimeData.checkRuntimeEnvironment();\n";
}

export function InitiateBlocklyGeneratorDebug() {
  Blockly.JavaScript.STATEMENT_PREFIX =
    '; runTimeData.checkRuntimeEnvironment();\n'
    + 'await $id(%1, 0);\n';
}
