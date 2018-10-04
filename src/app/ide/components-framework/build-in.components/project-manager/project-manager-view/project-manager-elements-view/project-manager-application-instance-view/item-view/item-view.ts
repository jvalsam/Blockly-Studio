import { IDEUIComponent } from "../../../../../../component/ide-ui-component";
import { View, ViewMetadata, IViewUserStyleData } from "../../../../../../component/view";

import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import ItemViewTmpl from "./item-view.tmpl";
import FoldingStyle from "./item-view-folding-style.json";
import { ViewRegistry } from "../../../../../../component/registry";
import { IProjectManagerElementData } from "../../../../project-manager";

import { PageFoldingView } from './../../../../../../common-views/page-folding-view/page-folding-view';
import { ActionsView } from './../../../../../../common-views/actions-view/actions-view';
import { DomainLibsHolder } from './../../../../../../../domain-manager/domain-libs-holder';
import { ProjectManagerElementView } from "../project-manager-element-view";

@ViewMetadata({
    name: "ProjectManagerItemView",
    templateHTML: ItemViewTmpl
})
export class ProjectManagerItemView extends ProjectManagerElementView {
    private systemID: string;
    private projectID: string;
    private renderInfo;
    private state;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector, data.meta, data.path + data.item.systemID + "/", data.parentTree);
        this.systemID = data.item.systemID;
        this.projectID = data.projectID;
        this.path = data.path + this.systemID + "/";
        this.renderInfo = {};
        this.renderInfo.type = data.item.type;// (({type, renderParts }) => ({ type, renderParts })) (data.meta);
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
                    $("#project-manager-item-"+this.id).css("background-color", "rgb(197, 197, 197)");
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
                    $("#project-manager-item-"+this.id).css("background-color", "rgb(218, 217, 217)");
                    $("#project-manager-item-"+this.id).css("cursor", "default");
                }
            }
        );
    }

    public setStyle(): void { ; }

    public removeElement(ids: Array<string>): boolean {
        // if (this.info.isLeaf) {
        //     let tree = $("#category-elements-" + this.id).jstree(true);
        //     tree.delete_node([
        //         tree.get_node("#" + ids[0])
        //     ]);
        // }
        // else {
        //     return this.elements.map(scat => scat.id).indexOf(ids.shift())["removeElement"](ids);
        // }
        return true;
    }

    public addElement(ids: Array<string>, elementData: IProjectManagerElementData): void {
        // if (this.info.isLeaf) {
        //     // case to add element in the root of the category => "first"
        //     // case to add element inside jstree => "inside"
        //     let position = ids[0] === this.id ? "first" : "inside";

        //     let parent = $("#category-elements-" + this.id).jstree(true).get_node("#"+ids[0]);
        //     let newNode = {
        //         state: "open",
        //         data: {
        //             id: elementData.id,
        //             type: elementData.type,
        //             text: elementData,
        //             parent: ids[0]
        //         }
        //     };
        //     $("#category-elements-" + this.id).jstree(
        //         "create_node",
        //         parent,
        //         newNode,
        //         position,
        //         false,
        //         false
        //     );
        // }
        // else {
        //     this.elements.map(scat => scat.id).indexOf(ids.shift())["addElement"](ids, elementData);
        // }
    }

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
}
