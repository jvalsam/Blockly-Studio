import { IDEError } from "../../../../../../shared/ide-error/ide-error";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata, IViewUserStyleData } from "../../../../../component/view";
import { PropertyView, IPropertyData, TypeToNameOfPropertyView } from "../property-view";
import { ViewRegistry } from "../../../../../component/registry";
import * as _ from "lodash";

/// <reference path="../../../../../../../../../node.d.ts"/>
import AggregateViewTmpl from "./aggregate-view.html";

export interface IAggregateData extends IPropertyData {
    props?: {[name: string]: PropertyView};
}

function IAggregateDataConverter(data: any): IAggregateData {
    if (!data.config) {
        if (!data.props) {
            data.props = {};
        }
        return data;
    }
    let ISData: IAggregateData;
    ISData["id"] = data.id;
    ISData.name = data.config.name;
    ISData.type = data.config.type;
    ISData.style = data.config.style;
    ISData.indepedent = data.indepedent;
    ISData.isExtra = typeof (data.isExtra) === "boolean" ? data.isExtra : false;
    ISData.renderName = data.renderName;
    ISData.props = data.props ? data.props : {};
    return ISData;
}


@ViewMetadata({
    name: "AggregateView",
    templateHTML: AggregateViewTmpl
})
export class AggregateView extends PropertyView {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        data: any
    ) {
        super(parent, name, templateHTML, style, hookSelector, data);
        this.data = IAggregateDataConverter(data);
        this.data.propsView = {};
    }

    public get properties(): { [name: string]: PropertyView } {
        return this.data.propsView;
    }

    public render(): void {
        this.renderTmplEl(this.data);
        _.forOwn(this.data.props, (view, key) => {
            this.data.propsView[key] = <PropertyView>ViewRegistry.getEntry(view.name).create(this.parent, "#elems_"+this.id, view.data);
            this.data.propsView[key].clearSelectorArea = false;
            this.data.propsView[key].render();
        });
    }

    public addProperty (name: string, viewRegName: string, property: any): void {
        if (!this.data.props[name]) {
            this.data.props[name] = { name: TypeToNameOfPropertyView(viewRegName), data: property };
        }
        else {
            IDEError.warn("Aggregate Add Property", "Property with name " + name + " already exists.");
        }
    }

    public removeProperty(name:string): boolean {
        if (this.data.propsView[name]) {
            this.data.propsView[name].destroy();
            delete this.data.propsView[name];
        }
        return false;
    }

    public registerEvents(): void { ; }

    public setStyle(): void { ; }

    public focus() {
        //TODO: fix it better...
        let firstKey = null;
        _.forOwn(this.data.props, (view, key) => {
            if (firstKey === null) {
                firstKey = null;
            }
        });
        this.data.propsView[firstKey].focus();
    }

    public get value(): any {
        let aggValue: Object = {};
        _.forOwn(this.data.propsView, (property: PropertyView, key: string) => {
            aggValue[key] = property.value;
        });
        return aggValue;
    }
}
