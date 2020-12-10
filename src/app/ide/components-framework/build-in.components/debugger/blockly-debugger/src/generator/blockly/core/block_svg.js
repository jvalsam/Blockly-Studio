import { Blockly_Debugger, Debuggee_Worker } from '../../../debugger/debugger.js';
import { Breakpoint_Icon } from './breakpoint.js';
import * as Blockly from 'blockly';

Blockly.BlockSvg.prototype.generateContextMenu = function () {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return null;
    }
    var block = this;
    var menuOptions = [];

    if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {
        menuOptions.push(Blockly.ContextMenu.blockDuplicateOption(block));
        if (this.isEditable() && !this.collapsed_ &&
            this.workspace.options.comments) {
            menuOptions.push(Blockly.ContextMenu.blockCommentOption(block));
        }

        // Option to make block inline.
        if (!this.collapsed_) {
            for (var i = 1; i < this.inputList.length; i++) {
                if (this.inputList[i - 1].type != Blockly.NEXT_STATEMENT &&
                    this.inputList[i].type != Blockly.NEXT_STATEMENT) {
                    // Only display this option if there are two value or dummy inputs
                    // next to each other.
                    var inlineOption = { enabled: true };
                    var isInline = this.getInputsInline();
                    inlineOption.text = isInline ?
                        Blockly.Msg['EXTERNAL_INPUTS'] : Blockly.Msg['INLINE_INPUTS'];
                    inlineOption.callback = function () {
                        block.setInputsInline(!isInline);
                    };
                    menuOptions.push(inlineOption);
                    break;
                }
            }
        }

        if (this.workspace.options.collapse) {
            // Option to collapse/expand block.
            if (this.collapsed_) {
                var expandOption = { enabled: true };
                expandOption.text = Blockly.Msg['EXPAND_BLOCK'];
                expandOption.callback = function () {
                    block.setCollapsed(false);
                };
                menuOptions.push(expandOption);
            } else {
                var collapseOption = { enabled: true };
                collapseOption.text = Blockly.Msg['COLLAPSE_BLOCK'];
                collapseOption.callback = function () {
                    block.setCollapsed(true);
                };
                menuOptions.push(collapseOption);
            }
        }

        if (this.workspace.options.disable) {
            // Option to disable/enable block.
            var disableOption = {
                text: this.isEnabled() ?
                    Blockly.Msg['DISABLE_BLOCK'] : Blockly.Msg['ENABLE_BLOCK'],
                enabled: !this.getInheritedDisabled(),
                callback: function () {
                    block.setEnabled(!block.isEnabled());  // inverted. setDisabled is deprecated as of May 2019
                }
            };
            menuOptions.push(disableOption);
        }

        menuOptions.push(Blockly.ContextMenu.blockDeleteOption(block));

        let breakpointOption = {
            text: (!Blockly_Debugger.actions["Breakpoint"]
                .breakpoints.map((obj) => { return obj.block_id; })
                .includes(block.id)) ? "Add Breakpoint" : "Remove Breakpoint",
            enabled: true,
            callback: function () {
                if (!Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => { return obj.block_id; }).includes(block.id)) {
                    let new_br = {
                        "block_id": block.id,
                        "enable": true,
                        "icon": new Breakpoint_Icon(block),
                        "change": false
                    }
                    Blockly_Debugger.actions["Breakpoint"].breakpoints.push(new_br);
                    block.setCollapsed(false);                        // gia na anoigei otan exw breakpoint
                }
                else {
                    let icon = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => { if (obj.block_id === block.id) return obj.icon });
                    icon[0].myDisable();
                    let index = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => { return obj.block_id; }).indexOf(block.id);
                    if (index !== -1) Blockly_Debugger.actions["Breakpoint"].breakpoints.splice(index, 1);
                }
                Blockly_Debugger.actions["Breakpoint"].handler();
            }
        };
        menuOptions.push(breakpointOption);
        // menuOptions.push(Blockly_Debugger.actions["Breakpoint"].menuOption(block));
        menuOptions.push(Blockly_Debugger.actions["Breakpoint"].disableMenuOption(block));
        menuOptions.push(Blockly_Debugger.actions["RunToCursor"].menuOption(block));
        if (Debuggee_Worker.hasInstance()) {
            menuOptions.push(Blockly_Debugger.actions["Watch"].menuOption(block));
            menuOptions.push(Blockly_Debugger.actions["Eval"].menuOption(block));
        }

        var block___ = {
            text: "block___",
            enabled: true,
            callback: function () {
                console.log(block);
            }
        };
        menuOptions.push(block___);
        menuOptions.push(Blockly.ContextMenu.blockHelpOption(block));
        return menuOptions;
    }
};

Blockly.BlockSvg.prototype.showContextMenu_ = function (e) {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return;
    }
    var menuOptions = this.generateContextMenu();
    if (menuOptions && menuOptions.length) {
        Blockly.ContextMenu.show(e, menuOptions, this.RTL);
        Blockly.ContextMenu.currentBlock = this;
    }
};
