import {assert} from '../../../../../../../shared/ide-error/ide-error';
import {ViewRegistry} from '../../../../../../component/registry';
import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ItemViewTmpl from "./item-view.tmpl";
import { DomainLibsHolder } from "./../../../../../../../domain-manager/domain-libs-holder";
import { ProjectManagerElementView } from "../project-manager-element-view";
import { ContrastColor, HexToRGB, BrighterVersion } from './../../../../../../../shared/convertors';


export type ProjectItemViewState = "selected" | "onFocus" | "disable" | "used" | "notUsed";

@ViewMetadata({
    name: "ProjectManagerItemView",
    templateHTML: ItemViewTmpl
})
export class ProjectManagerItemView extends ProjectManagerElementView {
    protected _currRenderValues: { title: string, image: any, colour: string };
    protected readonly elemsSel: string;
    private static _numberOfElements: number = 0;
    private _state: ProjectItemViewState;
    private extraView: View;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        protected data: any
    ) {
        super (
            parent,
            name,
            templateHTML,
            View.MergeStyle(style, ProjectManagerElementView.getElementStyle(data.item.type, "items")),
            hookSelector,
            data.meta,
            data.path + data.item.systemID + "/",
            data.parentTree,
            data.project._id,
            data.isSelected
        );
        ++ProjectManagerItemView._numberOfElements;
        this._systemID = data.item.systemID;
        this.pinMetadataInItem();
        this.path = data.path + this.systemID + "/";
        this.elemsSel = "#item-children-" + this.id;
        this._state = "notUsed";

        this.renderInfo.type = data.item.type;
        this.renderInfo.styleSelected =
           `border: solid 2px black;
            border-top: solid 1px aliceblue;
            background-color: rgb(218, 217, 217);
            padding-top: 6px;
            padding-bottom:6px;`;
        this.renderInfo.styleNormal =
            `border: solid 2px aliceblue;
             border-top: solid 1px aliceblue;
             background-color: rgb(218, 217, 217);
             padding-top: 6px;
             padding-bottom:6px;`;
        this.renderInfo.renderParts = {};
        this.renderInfo.nesting = data.nesting;
        _.forEach(data.item.renderParts, (elem) => {
            this.renderInfo.renderParts[elem["type"]] = elem;
        });
        this.renderInfo.id = this.id;
        this.renderInfo.meta = this.getMeta();
        this.renderInfo.metaBGColour = this.renderInfo.meta.renderParts[this.renderInfo.meta.renderParts.map(x=>x.type).indexOf("colour")].value.default;
        
        if (this.renderInfo.renderParts.colour.value.colour !== this.renderInfo.metaBGColour) {
            this.renderInfo.colour = ContrastColor(HexToRGB(this.renderInfo.renderParts.colour.value.colour));
        }
        else {
            this.renderInfo.colour = "rgb(0, 0, 0)"//this.renderInfo.style.colour;
        }

        // temporarily setted here, TODO: connected with style of the domain...
        if (!this.data.style) { this.data.style = {}; }
        this.data.style.state = {
            sel: "#" + this.id,
            elements: {
                "selected": { "background-color": "yellow" },
                "onFocus": {
                    "background-color": this.renderInfo.renderParts.colour.value.colour,
                    "text-decoration": "underline"
                },
                "used": {
                    "background-color": "yellow",
                    "text-decoration": ""
                },
                "notUsed": {
                    "background-color": "yellow"
                },
            }
        };

        if (this.getMeta().validChildren && this.getMeta().validChildren.length>0) {
            this.renderInfo.hasChildren = true;
            this.initFolding(
                "#item-folding-"+this.id,
                "#item-children-"+this.id,
                { plus: "fa fa-caret-right", minus: "fa fa-caret-down" },
                [
                    {
                        "selector": ".page-folding-link-icon",
                        "styles": {
                            "css": {
                                "color": "rgb(0,0,0)"
                            },
                            "class": ["fa-lg"]
                        }
                    }
                ]
            );
            this.initChildren();
        }
        else {
            this.foldingView = null;
            this.renderInfo.hasChildren = false;
        }

        this.initActions(
            "#item-actions-view-"+this.id,
            [ {selector: ".actions-view-title-fa", styles: { css: { color: "black" } }} ]
        );

        this.initState(data);
    }

    private pinMetadataInItem() {
        _.forEach(this.getMeta().renderParts, (renderPart) => {
            let index = this.data.item.renderParts.map(x=>x.type).indexOf(renderPart.id);
            let itemRP = this.data.item.renderParts[index];
            itemRP.id = itemRP.type;
            itemRP.type = renderPart.type;
            itemRP.selectedBy = renderPart.selectedBy;
            itemRP.formElemItemRenderNO = renderPart.formElemItemRenderNO;
            if (!itemRP.value) {
                itemRP.value = {};
            }
            itemRP.value.property = renderPart.value.property;
            itemRP.value.default = renderPart.value.default;
        });
    }

    private initChildren (): void {
        this._children.items = new Array<ProjectManagerElementView>();
        // filter elements
        let itemElements = this.data.project.elements.filter(obj => { return obj.path === this.path });
        //
        for(let i=1; i<=itemElements.length; ++i) {
            let itemData = itemElements[ itemElements.map(x=>x.orderNO).indexOf(i) ];
            this.addElement(itemData);
        }

        this._currOrderNO = itemElements.length + 1;
    }

    public get state(): ProjectItemViewState {
        return this._state;
    }

    public set state(state: ProjectItemViewState) {
        this._state = state;
        $(this.data.style.state.sel).css(this.data.style.state.elements[state]);
    }

    public itemData() {
        return this.data.item;
    }

    public renderData() {
        let data = [];
        _.forEach(this.data.item.renderParts, (renderPart) => {
            data.push(Object.assign({}, renderPart));
        });
        return data;
    }

    public editorData () {
        return this.data.item.editorData;
    }

    private metadataElem(type): any {
        let index = this.getMeta().renderParts.map(x=>x.type).indexOf("title");
        return index > 0 ? this.getMeta().renderParts[index] : null;
    }

    public defaultTitle(): string {
        let metaTitle = this.metadataElem("title");
        return metaTitle ? metaTitle.value.default : "Project Element";
    }

    private initState(data) {
        let stateIndex = this.getMeta().renderParts.map(x=>x.type).indexOf("state");
        if(stateIndex>-1) {
            let retrieveState = this.getMeta().renderParts[stateIndex].value.retrieve;
            this.extraView = DomainLibsHolder.call(retrieveState.library, retrieveState.function, ["#"]);
        }
        else {
            this.extraView = null;
        }
    }

    public render(): void {
        this._currRenderValues = {
            title: this.renderInfo.renderParts.title.value.text,
            image: typeof (this.renderInfo.renderParts.img) !== undefined ? Object.assign({}, this.renderInfo.renderParts.img) : undefined,
            colour: this.renderInfo.renderParts.colour.value.colour
        };
        this.renderTmplEl(this.renderInfo);
        if (this.foldingView !== null) {
            this.foldingView.render();
        }
        if (this.actions !== null) {
            this.actions.render();
            this.actions.hide();
        }
        if (this.extraView !== null) {
            this.extraView.render();
        }
        if (this._children && this._children.items && this._children.items.length>0) {
            _.forEach(this._children.items, (item) => item.render());
        }
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".project-manager-item-header-area",
                handler: (evt) => {
                    if (evt.target.classList[0] !== "page-folding-link-icon") {
                        this.onClick();
                    }
                }
            },
            {
                eventType: "mouseover",
                selector: "#project-manager-item-"+this.id,
                handler: (evt) => {
                    if (this.actions) {
                        this.actions.show();
                    }
                    // TODO: check if has to change colour and which colour has to set as new
                    if (this.state !== "onFocus") {
                        this.setMouseOverStyle();
                    }
                    $("#project-manager-item-"+this.id).css("cursor", "pointer");
                }
            },
            {
                eventType: "mouseout",
                selector: "#project-manager-item-"+this.id,
                handler: (evt) => {
                    if (this.actions) {
                        this.actions.hide();
                    }
                    // TODO: check if has to change colour and which colour has to set as new
                    if (this.state !== "onFocus") {
                        this.setMouseOutStyle();
                    }
                    $("#project-manager-item-"+this.id).css("cursor", "default");
                }
            }
        );
    }

    protected getMeta(): any {
        return this.meta.items[this.data.item.metaIndex];
    }

    protected setOnFocusStyle(): void {
        $("#project-manager-item-" + this.id).css({
            "background-color": BrighterVersion(this.renderInfo.renderParts.colour.value.colour),
            "text-decoration": "underline"
        });
    }

    protected setMouseOverStyle(): void {
        if (this.state !== "onFocus") {
            $("#project-manager-item-" + this.id).css({
                "background-color": "white",//"rgb(197, 197, 197)",
                "text-decoration": ""
            });
        }
    }

    protected setMouseOutStyle(): void {
        $("#project-manager-item-" + this.id).css({
            "background-color": this.renderInfo.renderParts.colour.value.colour,
            "text-decoration": ""
        });
    }

    public rename(data: any): void {
        if (this._currRenderValues.title !== data.title) {
            $("#item-title-"+this.id).empty();
            $("#item-title-"+this.id).append(data.title);
            this._currRenderValues.title = data.title;
        }

        if (this._currRenderValues.colour !== data.colour) {
            let fontColour = ContrastColor(HexToRGB(data.colour));
            $("#item-title-"+this.id).css("color", fontColour);
            $("#project-manager-item-"+this.id).css("background-color", data.colour);
            this._currRenderValues.colour = data.colour;
        }

        if (typeof(data.image) !== 'undefined') {
            if (this._currRenderValues.image.value.path !== data.value.image.path || this._currRenderValues.image.value.fa !== data.image.value.fa) {
                $("#item-img-"+this.id).empty();
                let imgHtml = "";
                if (typeof(data.img.value.fa) !== 'undefined') {
                    imgHtml = "<i class='"+ data.image.value.fa +" project-category-header-img-" + this.renderInfo.type + "'></i>";
                }
                else {
                    imgHtml = "<img class='project-category-header-img-"+this.renderInfo.type+"' src='"+ data.image.value.path + "' />";
                }
                $("#item-img-"+this.id).append(imgHtml);
            }
        }
        else {
            $("#item-img-"+this.id).empty();
        }

    }

    public destroy(): void {
        if (this.extraView !== null) {
            this.extraView.destroy();
        }
        super.destroy();
    }

    public static GetTotalGeneratedElems(): number {
        return ProjectManagerItemView._numberOfElements;
    }

    protected addElement(itemData): void {
        itemData.metaIndex = this.data.meta.items.map(x => x.type).indexOf(itemData.type);
        let itemView = <ProjectManagerElementView>ViewRegistry.getEntry("ProjectManagerItemView").create(
            this.parent,
            this.elemsSel,
            {
                "parentTree": this,
                "meta": this.data.meta,
                "project": this.data.project,
                "item": itemData,
                "path": this.path,
                "nesting": this.renderInfo.nesting + 1
            }
        );
        itemView.clearSelectorArea = false;
        this._children.items.push(itemView);
    }

    public setState(state: ProjectItemViewState, systemID: string): boolean {
        if (this.systemID === systemID) {
            this.state = state;
            return true;
        }
        return super.setState(state, systemID);
    }

    public onClick(): void {
        let meta = this.getMeta();
        let event = meta.events[meta.events.map(x=>x.type).indexOf("click")];
        this.parent["onClickProjectElement"](this);
        this.parent["onOuterFunctionRequest"](event, this);
    }
}
