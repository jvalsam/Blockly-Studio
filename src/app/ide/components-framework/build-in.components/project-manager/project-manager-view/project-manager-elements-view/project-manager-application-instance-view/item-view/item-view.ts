import {ViewRegistry} from '../../../../../../component/registry';
import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { ViewMetadata, IViewUserStyleData } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ItemViewTmpl from "./item-view.tmpl";
import { DomainLibsHolder } from "./../../../../../../../domain-manager/domain-libs-holder";
import { ProjectManagerElementView } from "../project-manager-element-view";


@ViewMetadata({
    name: "ProjectManagerItemView",
    templateHTML: ItemViewTmpl
})
export class ProjectManagerItemView extends ProjectManagerElementView {
    protected readonly elemsSel: string;
    private static _numberOfElements: number = 0;
    private state;

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
            style,
            hookSelector,
            data.meta,
            data.path + data.item.systemID + "/",
            data.parentTree,
            data.projectID,
            data.isSelected
        );
        ++ProjectManagerItemView._numberOfElements;
        this._systemID = data.item.systemID;
        this.path = data.path + this.systemID + "/";
        this.elemsSel = "item-children-" + this.id;
        this.renderInfo.type = data.item.type;// (({type, renderParts }) => ({ type, renderParts })) (data.meta);
        this.renderInfo.styleSelected = "border: solid 2px black; border-top: solid 1px aliceblue; background-color: rgb(218, 217, 217); padding-top: 6px; padding-bottom:6px;";
        this.renderInfo.styleNormal = "border: solid 2px aliceblue; border-top: solid 1px aliceblue; background-color: rgb(218, 217, 217); padding-top: 6px; padding-bottom:6px;";
        this.renderInfo.renderParts = {};
        this.renderInfo.nesting = data.nesting;
        _.forEach(data.item.renderParts, (elem) => {
            this.renderInfo.renderParts[elem["type"]] = elem; 
        });
        this.renderInfo.id = this.id;
        this.renderInfo.meta = data.meta;

        if (data.meta.validChildren && data.meta.validChildren.length>0) {
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
                                "color": "black"
                            },
                            "class": ["fa-lg"]
                        }
                    }
                ]
            );
            
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

    private initState(data) {
        let stateIndex = data.meta.renderParts.map(x=>x.type).indexOf("state");
        if(stateIndex>-1) {
            let retrieveState = data.meta.renderParts[stateIndex].value.retrieve;
            this.state = DomainLibsHolder.call(retrieveState.library, retrieveState.function, ["#"]);
        }
        else {
            this.state = null;
        }
    }

    public render(): void {
        this.renderTmplEl(this.renderInfo);
        if (this.foldingView !== null) {
            this.foldingView.render();
        }
        if (this.actions !== null) {
            this.actions.render();
            this.actions.hide();
        }
        if (this.state !== null) {
            this.state.render();
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
                        this.parent["onClickProjectElement"] (this.projectID, this.systemID);
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
                    this.setSelectedStyle();
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
                    this.setNotSelectedStyle();
                    $("#project-manager-item-"+this.id).css("cursor", "default");
                }
            }
        );
    }

    protected setSelectedStyle(): void {
        $("#project-manager-item-" + this.id).css("background-color", "rgb(197, 197, 197)");
    }

    protected setNotSelectedStyle(): void {
        $("#project-manager-item-" + this.id).css("background-color", "rgb(218, 217, 217)");
    }

    public setStyle(): void { ; }

    public destroy() {
        if (this.foldingView !== null) {
            this.foldingView.destroy();
        }
        if (this.actions !== null) {
            this.actions.destroy();
        }
        if (this.state !== null) {
            this.state.destroy();
        }
    }

    public static GetTotalGeneratedElems(): number {
        return ProjectManagerItemView._numberOfElements;
    }

    public addNewElement(itemData, callback?: (newItem) => void): void {
        
    }

    public addElement(itemData, callback: (newItem) => void): void {
        let metaIndex = this.data.meta.items.map(x => x.type).indexOf(itemData.type);
        let itemView = <ProjectManagerElementView>ViewRegistry.getEntry("ProjectManagerItemView").create(
            this.parent,
            this.elemsSel,
            {
                "parentTree": this,
                "meta": this.data.meta.items[metaIndex],
                "projectID": this.data.project._id,
                "item": itemData,
                "path": this.path,
                "nesting": this.renderInfo.nesting + 1
            }
        );
        itemView.clearSelectorArea = false;
        this._children.items.push(itemView);
    }
}
