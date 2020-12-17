import {
  ComponentViewMetadata,
  ComponentView,
} from "./../../../component/component-view";

import "jquery-ui-dist/jquery-ui";

/// <reference path="../../../../../../../node.d.ts"/>
import RuntimeManagerTmpl from "./run-time-manager.tmpl";
import RuntimeManagerSYCSS from "./run-time-manager.sycss";
import { ExportedFunction } from "../../../component/component-loader";

enum ConsoleDisplayState {
  OPENED,
  CLOSED,
  FOLDED,
}

@ComponentViewMetadata({
  name: "RuntimeManagerView",
  templateHTML: RuntimeManagerTmpl,
  toolsElems: [
    {
      name: "RuntimeManagerToolbarView",
      selector: ".tools-view-container",
    },
  ],
  mainElems: [
    {
      name: "RuntimeManagerInputView",
      selector: ".input-view-area",
    },
    {
      name: "RuntimeManagerOutputView",
      selector: ".output-view-area",
    },
  ],
  style: {
    system: RuntimeManagerSYCSS,
  },
})
export class RuntimeManagerView extends ComponentView {
  private displayState: ConsoleDisplayState;
  private stateBeforeClose: ConsoleDisplayState;
  private readonly optionsBtnSel = ".output-console-header-options";
  private readonly foldingBtnSel = ".output-console-header-fold";
  private readonly closeBtnSel = ".output-console-header-close";

  constructor(
    parent,
    name,
    templateHTML,
    style,
    selector,
    renderData,
    eventRegData,
    styleData
  ) {
    super(
      parent,
      name,
      templateHTML,
      style,
      selector,
      renderData,
      eventRegData,
      styleData
    );
    this.displayState = ConsoleDisplayState.FOLDED;
    this.stateBeforeClose = null;
    this.initiateRuntimeEnvironmentDialogue();
  }

  private initiateRuntimeEnvironmentDialogue() {}

  public foldLivePreview() {
    document.getElementById("fold-runtime-modal").click();
  }

  public openRuntimeEnvironmentDialogue() {
    // reset modal if it isn't visible
    if (!$("#runtime-modal.in").length) {
      $("#runtime-modal-dialog").css({
        top: 0,
        left: 0,
      });
    }

    document.getElementById("fold-runtime-modal").onclick = () => {
      let modalDialog = document.getElementById("runtime-modal-dialog");
      modalDialog.style.height = "0rem";
      modalDialog.style.width = "fit-content";
      modalDialog.style.top = "30px";
      modalDialog.style.left = "94rem";

      document.getElementById("fold-runtime-modal").style.display = "none";
      document.getElementById("expand-runtime-modal").style.display = "flex";
      document.getElementById("expand-runtime-modal").style.marginTop =
        "0.5rem";

      document.getElementById("runtime-modal-body").style.height = "0rem";
      let modalHeader = document.getElementById("runtime-modal-header");
      modalHeader.style.borderRadius = "10px";
      modalHeader.style.backgroundColor = "#419ff1";
      modalHeader.style.boxShadow = "0 15px 15px -5px rgb(0 0 0 / 20%)";
      $("#runtime-modal-dialog").draggable({ disabled: true });
    };

    document.getElementById("expand-runtime-modal").onclick = () => {
      let modalDialog = document.getElementById("runtime-modal-dialog");
      modalDialog.style.height = "90%";
      modalDialog.style.maxWidth = "108rem !important;";
      modalDialog.style.width = "100%";
      modalDialog.style.top = "0px";
      modalDialog.style.left = "0px";

      document.getElementById("fold-runtime-modal").style.display = "flex";
      document.getElementById("expand-runtime-modal").style.display = "none";

      document.getElementById("runtime-modal-body").style.height = "100%";
      let modalHeader = document.getElementById("runtime-modal-header");
      modalHeader.style.backgroundColor = "#4a81b1";
      modalHeader.style.removeProperty("border-radius");
      modalHeader.style.removeProperty("box-shadow");
      $("#runtime-modal-dialog").draggable({ disabled: false });
    };

    $("#runtime-modal")["modal"]({
      backdrop: false,
      show: true,
    });

    $("#runtime-modal-dialog").draggable({
      handle: "#runtime-modal-header",
    });
  }

  public closeRuntimeEnvironmentDialogue() {
    alert("not imlemented yet close dialogue rutime environment");
  }

  public registerEvents(): void {
    this.attachEvents(
      {
        eventType: "click",
        selector: this.optionsBtnSel,
        handler: (e) => this.onClickMenuOptions(),
      },
      {
        eventType: "click",
        selector: this.foldingBtnSel,
        handler: (e) => this.onFold(),
      },
      {
        eventType: "click",
        selector: this.closeBtnSel,
        handler: (e) => this.onClose(),
      }
    );
  }

  private onClose() {
    // implement not visible
    // section
    $(this._selector)
      .children()
      .first()
      .children()
      .first()
      .css({ display: "none" });
    this.stateBeforeClose = this.displayState;
    this.displayState = ConsoleDisplayState.CLOSED;
  }

  private onOpen() {
    if (this.displayState && this.displayState === ConsoleDisplayState.CLOSED) {
      // section
      $(this._selector)
        .children()
        .first()
        .children()
        .first()
        .css({ display: "flex" });
      this.displayState = this.stateBeforeClose;
      this.stateBeforeClose = null;
      // open in case it was on fold state
      if (this.displayState !== ConsoleDisplayState.FOLDED) {
        this.onFold();
      }
    }
  }

  private onFold() {
    if (this.displayState === ConsoleDisplayState.FOLDED) {
      this.displayState = ConsoleDisplayState.OPENED;
      $(this.foldingBtnSel).html('<i class="fas fa-chevron-up"></i>');

      //
      $(this._selector).css({ height: "2.8rem" });
      $(".output-console").css({ height: "auto" });

      $(".run-time-manager-container").css({ "box-shadow": "0 0 black" });

      $(".output-view-area").css({ display: "none" });
      $(".input-view-area").css({ display: "none" });
    } else {
      // OPENED
      this.displayState = ConsoleDisplayState.FOLDED;
      $(this.foldingBtnSel).html('<i class="fas fa-chevron-down"></i>');
      //
      $(".run-time-manager-container").css({
        "box-shadow": "grey -0.01em 0em 0.2em",
      });

      $(".output-view-area").css({ display: "block" });
      $(".input-view-area").css({ display: "block" });
      $(this._selector).css({ height: "auto" });
      $(".output-console").css({ height: "" });
    }
  }

  private onClickMenuOptions() {
    alert("options not implemented yet!");
  }
}
