import "./events.js";

import * as Blockly from "blockly";
import {
  GetBlocklyWspOptions,
  Privillege,
} from "../../../../../ide/ide-components/blockly/blockly-instance.js";

export function InitializeBlocklyDebuggerWorkspace(wsps) {
  window.workspace = {};

  window.workspace["blockly1"] = Blockly.inject(
    "blocklyDiv",
    GetBlocklyWspOptions(
      Privillege.EDITING,
      "./media/",
      document.getElementById("toolbox")
    )
  );
  window.workspace["blockly1"].systemEditorId = "blockly1";

  window.workspace["blockly2"] = Blockly.inject(
    "blocklyDiv2",
    GetBlocklyWspOptions(
      Privillege.EDITING,
      "./media/",
      document.getElementById("toolbox")
    )
  );

  window.workspace["blockly2"].systemEditorId = "blockly2";

  addEventListener("loadStartingBlocks", function () {
    Blockly.Xml.domToText(document.getElementById("startBlocks"));
    Blockly.Xml.domToWorkspace(
      document.getElementById("startBlocks"),
      window.workspace["blockly1"]
    );

    Blockly.Xml.domToWorkspace(
      document.getElementById("startBlocks"),
      window.workspace["blockly2"]
    );
  });
}
