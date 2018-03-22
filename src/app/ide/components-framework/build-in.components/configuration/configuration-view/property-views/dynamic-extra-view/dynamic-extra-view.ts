import { IAggregateData } from "./../aggregate-view/aggregate-view";
import { IFontData } from "./../font-view/font-view";
import { ISelectData } from "./../select-view/select-view";
import { IPropertyData, PropertyView, PropertyType } from "./../property-view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata } from "../../../../../component/view";

/// <reference path="../../../../../../../../../node.d.ts"/>
import SelectViewTmpl from "./dynamic-extra-view.html";
import { ViewRegistry } from "../../../../../component/registry";
import { TypeToNameOfPropertyView } from "../property-view";
import { IInputData } from "../input-view/input-view";

export type SelectType = "select" | "aggregate";

export interface IDynamicExtraData extends IPropertyData {
    values: { [key: string]: { type: PropertyType, value: IPropertyData } | number };
    value: { main: any, extra: any };
    main: IInputData | ISelectData | IFontData | IAggregateData | IDynamicExtraData;
}

function IDynamicExtraDataConverter(data: any): IDynamicExtraData {
    if (!data.config) {
        return data;
    }
    let IDEData: IDynamicExtraData;
    IDEData["id"] = data.id;
    IDEData.name = data.config.name;
    IDEData.type = data.config.type;
    IDEData.indepedent = data.indepedent;
    IDEData.isExtra = typeof(data.isExtra)==="boolean"?data.isExtra:false;
    IDEData.value = data.config.value;
    IDEData.values = data.config.values;
    IDEData.main = data.value;
    return IDEData;
}

@ViewMetadata({
    name: "DynamicExtraView",
    templateHTML: SelectViewTmpl
})
export class DynamicExtraView extends PropertyView {
    private readonly mainViewSelector: string;
    private readonly extraElemsViewSelector: string;
    private mainView: PropertyView;
    private currExtraView: PropertyView;
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        data: any
    ) {
        super(parent, name, templateHTML, data);
        this.data = IDynamicExtraDataConverter(data);
        this.mainViewSelector = "#main_extra_view_"+this.id;
        this.extraElemsViewSelector = ".dynamic-extra-property-elements"+this.id;
        this.data.main.updateParent = () => this.onChange();
        this.mainView = <PropertyView>ViewRegistry.getEntry(
            TypeToNameOfPropertyView(this.data.main.type)
        ).create(this.parent, this.data.main);
        this.currExtraView = null;
    }

    private mainElemRender(): void {
        this.mainView.render();
        this.mainView.$el = this.mainView.$el.children();
    }

    private extraElemRender(): void {
        if (this.extraElem()) {
            $(this.extraElemsViewSelector).append(this.$currExtraElem());
        }
    }

    private destroyCurrentExtraView(): void {
        if (this.currExtraView !== null) {
            this.currExtraView.destroy();
            $("#extra_elem_"+this.currExtraView.id).remove();
            this.currExtraView = null;
        }
    }

    private $currExtraElem(): JQuery {
        this.currExtraView.render();
        let $extraEl = $("<div class='col' id='extra_elem_" + this.currExtraView.id + "'"+
            "style=\"padding-left: 0px;\"></div>");
        $extraEl.append(this.currExtraView.$el);
        return $extraEl;
    }

    private extraElem(): boolean {
        this.destroyCurrentExtraView();

        let extraElem = this.data.values[this.mainView.value];
        if (extraElem && typeof (extraElem) !== "number") {
            extraElem.value.isExtra = true;
            this.currExtraView = <PropertyView>ViewRegistry.getEntry(
                TypeToNameOfPropertyView(extraElem.type)
            ).create(this.parent, extraElem.value);
            this.currExtraView.render();
            return true;
        }

        return false;
    }

    public render(): void {
        this.renderTmplEl(this.data);
        this.mainElemRender();
        this.$el.find("#main_extra_view_" + this.id).append(this.mainView.$el);
        this.extraElemRender();
        if (this.extraElem()) {
            this.$el.find(this.extraElemsViewSelector).append(this.$currExtraElem());
        }
        this.registerEvents();
    }

    public registerEvents(): void { ; }

    public onChange(): void {
        this.mainElemRender();
        $(this.mainViewSelector).empty();
        $(this.mainViewSelector).append(this.mainView.$el);
        this.extraElemRender();

        if (typeof (this.data.updateParent) !== "undefined") {
            this.data.updateParent(this.value());
        }
    }

    public get value(): any {
        return {
            "main" : this.mainView.value,
            "extra": this.currExtraView ? this.currExtraView.value : null
        };
    }

    public destroy(): void {
        this.destroyCurrentExtraView();
        this.mainView.destroy();
        this.mainView = null;
        super.destroy();
    }
}
