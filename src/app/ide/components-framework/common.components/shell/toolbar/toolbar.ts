/**
 * Menu - IDE Main Menu
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

/// <reference path="../../../../../../../node.d.ts"/>
import ToolbarTmpl from "./toolbar.html";
import { View, IViewElement, ViewMetadata } from "../../../view/view";
import { ExportedFunction } from "../../../component/ide-component";


export interface IShellToolbarViewElement extends IViewElement {
    view: Toolbar;
}

@ViewMetadata({
    name: "Toolbar",
    templateHTML: ToolbarTmpl
})
export class Toolbar extends View {
    protected _tools: Array<string> = [];

    get tools(): Array<string> {
        return this._tools;
    }

    set tools(ntools: Array<string>) {
        this._tools = ntools;
    }

    public render(): void {

    }

    public registerEvents(): void {

    }

    addTool(tool: string): void {
        this._tools.push(tool);
    }

    public update(): void {
        ;
    }

    public onOpen(): void {
        ;
    }

    public onClose(): void {
        ;
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }
}