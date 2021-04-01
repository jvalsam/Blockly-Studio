import { Blockly_Debugger, Debuggee_Worker } from '../../../debugger/debugger.js';
import { Breakpoint_Icon } from './breakpoint.js';
import * as Blockly from 'blockly';
import {
    ComponentsCommunication
} from "../../../../../../../../../../../src/app/ide/components-framework/component/components-communication.ts";


export function AddBreakpoint(block, outer) {
    let new_br = {
        "block_id": block.id,
        "enable": true,
        "icon": new Breakpoint_Icon(block),
        "change": false
    }
    Blockly_Debugger.actions["Breakpoint"].breakpoints.push(new_br);
    block.setCollapsed(false);

    Blockly_Debugger.actions["Breakpoint"].handler();

    if (!outer) {
        Blockly_Debugger.actions["Breakpoint"].onAddBreakpoint(block);
    }
}

export function RemoveBreakpoint(block, outer) {
    let icon = Blockly_Debugger.actions["Breakpoint"].breakpoints
        .map((obj) => {
            if (obj.block_id === block.id) return obj.icon});
    icon[0].myDisable();
    let index = Blockly_Debugger.actions["Breakpoint"].breakpoints
        .map((obj) => {
            return obj.block_id;})
        .indexOf(block.id);
    if (index !== -1)
        Blockly_Debugger.actions["Breakpoint"].breakpoints
            .splice(index, 1);

    Blockly_Debugger.actions["Breakpoint"].handler();

    if (!outer) {
        Blockly_Debugger.actions["Breakpoint"].onRemoveBreakpoint(block);
    }
}

function BreakpointOption(block) {
    return {
        text: (!Blockly_Debugger.actions["Breakpoint"]
            .breakpoints.map((obj) => { return obj.block_id; })
            .includes(block.id)) ? "Add Breakpoint" : "Remove Breakpoint",
        enabled: true,
        callback: function () {
            Blockly_Debugger.actions["Breakpoint"]
                .breakpoints
                .map((obj) => obj.block_id)
                .includes(block.id)
            ? RemoveBreakpoint(block)
            : AddBreakpoint(block);
        }
    };
}

Blockly.BlockSvg.prototype.generateContextMenu = function () {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return null;
    }
    var block = this;

    var menuOptions = Blockly.ContextMenuRegistry.registry.getContextMenuOptions(
        Blockly.ContextMenuRegistry.ScopeType.BLOCK, {block: this});

    if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {

        // todo: create infrastructure for generic cases for each domain
        if (block.actionImplementationId) {
            menuOptions.push({
                text: "Go to Implementation",
                enabled: true,
                callback: function () {
                    ComponentsCommunication.functionRequest(
                        "ProjectManager",
                        "ProjectManager",
                        "clickProjectElement",
                        [
                            block.soData.systemID.split("SmartObjectVPLEditor_")[1]
                        ]
                    );
                    ComponentsCommunication.functionRequest(
                        "ProjectManager",
                        "SmartObjectVPLEditor",
                        "clickDebugConfigurationOfAction",
                        [
                            block.soData.editorId,
                            block.soData.details.actions
                                .find(a=> a.name === block.actionName),
                            "EDITING"
                        ]
                    );
                }
            });
        }
        menuOptions.push(BreakpointOption(block));
        menuOptions.push(Blockly_Debugger.actions["Breakpoint"].disableMenuOption(block));
        menuOptions.push(Blockly_Debugger.actions["RunToCursor"].menuOption(block));
        if (Debuggee_Worker.hasInstance()) {
            menuOptions.push(Blockly_Debugger.actions["Watch"].menuOption(block));
            menuOptions.push(Blockly_Debugger.actions["Eval"].menuOption(block));
        }
    }

    // Allow the block to add or modify menuOptions.
    if (this.customContextMenu) {
        this.customContextMenu(menuOptions);
    }

    return menuOptions;
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
