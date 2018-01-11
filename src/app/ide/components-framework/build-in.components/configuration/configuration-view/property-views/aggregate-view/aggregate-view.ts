import { IDEError } from "../../../../../../shared/ide-error/ide-error";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { ViewMetadata } from "../../../../../component/view";
import { PropertyView, IPropertyData } from "../property-view";
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
    ISData.indepedent = data.indepedent;
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
        data: any
    ) {
        super(parent, name, templateHTML, data);
        this.data = IAggregateDataConverter(data);
    }

    public render(): void {
        this.renderTmplEl(this.data);
        _.forOwn(this.data.props, (value, key) => {
            value.render();
            this.$el.find("#elems_"+this.id).append(value.$el);
        });
    }

    public addProperty (name: string, property: PropertyView): void {
        if (!this.data.props[name]) {
            this.data.props[name] = property;
        }
        else {
            IDEError.warn("Aggregate Add Property", "Property with name " + name + " already exists.");
        }
    }

    public removeProperty(name:string): boolean {
        if (this.data.props[name]) {
            this.data.props[name].destroy();
            delete this.data.props[name];
        }
        return false;
    }

    public registerEvents(): void { ; }

    public get value(): any {
        let aggValue: Object = {};
        _.forOwn(this.data.props, (property: PropertyView, key: string) => {
            aggValue[key] = property.value;
        });
        return aggValue;
    }
}
