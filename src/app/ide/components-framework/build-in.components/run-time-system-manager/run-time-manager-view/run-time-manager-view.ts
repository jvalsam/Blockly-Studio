import {
    ComponentViewMetadata,
    ComponentView
} from './../../../component/component-view';

/// <reference path="../../../../../../../node.d.ts"/>
import RuntimeManagerTmpl from "./run-time-manager.tmpl";
import RuntimeManagerSYCSS from "./run-time-manager.sycss";

enum ConsoleDisplayState {
    OPENED,
    CLOSED,
    FOLDED
}

@ComponentViewMetadata({
    name: "RuntimeManagerView",
    templateHTML: RuntimeManagerTmpl,
    toolsElems: [
        {
            name: "RuntimeManagerToolbarView"
            , selector: ".tools-view-container"
        }
    ],
    mainElems: [
        {
            name: "RuntimeManagerInputView",
            selector: ".input-view-area"
        },
        {
            name: "RuntimeManagerOutputView",
            selector: ".output-view-area"
        }
    ],
    style: {
        system: RuntimeManagerSYCSS
    }
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
        styleData) {
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
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: this.optionsBtnSel,
                handler: (e) => this.onClickMenuOptions()
            },
            {
                eventType: "click",
                selector: this.foldingBtnSel,
                handler: (e) => this.onFold()
            },
            {
                eventType: "click",
                selector: this.closeBtnSel,
                handler: (e) => this.onClose()
            }
        );
    }

    private onClose() {
        // implement not visible
        $(this._selector).css({"display": "none"});
        this.stateBeforeClose = this.displayState;
        this.displayState = ConsoleDisplayState.CLOSED;
    }

    private onOpen() {
        if (this.displayState && this.displayState === ConsoleDisplayState.CLOSED) {
            $(this._selector).css({"display": "block"});
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
            $(this._selector).css({"height": "2.8rem"});
            
            $(".run-time-manager-container").css({"box-shadow": "0 0 black"});
            
            $(".output-view-area").css({"display": "none"});
            $(".input-view-area").css({"display": "none"});
        }
        else { // OPENED
            this.displayState = ConsoleDisplayState.FOLDED;
            $(this.foldingBtnSel).html('<i class="fas fa-chevron-down"></i>');
            //
            $(".run-time-manager-container").css({"box-shadow": "0em 0 0.4em grey"});
            
            $(".output-view-area").css({"display": "block"});
            $(".input-view-area").css({"display": "block"});
            $(this._selector).css({"height": "auto"});
        }
    }

    private onClickMenuOptions() {
        alert("options not implemented yet!");
    }
}
