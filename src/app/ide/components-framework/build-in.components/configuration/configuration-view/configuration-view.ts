import { AggregateView } from "./property-views/aggregate-view/aggregate-view";
/// <reference path="../../../../../../../node.d.ts"/>
import ConfigurationViewTmpl from "./configuration.html";
import { ComponentViewMetadata } from "../../../component/component-view";
import { ComponentView } from "../../../component/component-view";
import { PropertyView, TypeToNameOfPropertyView } from "./property-views/property-view";
import { FontView } from "./property-views/font-view/font-view";

import * as _ from "lodash";
import { ViewRegistry } from "../../../component/registry";


@ComponentViewMetadata({
    name: "ConfigurationView",
    selector: "",
    templateHTML: ConfigurationViewTmpl,
    menuElems:[]
})
export class ConfigurationView extends ComponentView {
    private propsView: AggregateView;
    private configCompData: {
        id: string,
        readonly selector: string,
        compName: string
    };

    public initialize(): void {
        super.initialize();
        this.configCompData = { id: "configModalCenter", selector: "modal-area", compName: "" };
        this.propsView = null;
    }

    public render(): void {
        this.renderTmplEl(this.configCompData);
        this.propsView.render();
        this.$el.find(".config-properties-body").append(this.propsView.$el);
        $("div."+this.configCompData.selector).empty();
        $("div."+this.configCompData.selector).append(this.$el);
        this.registerEvents();
    }

    public registerEvents(): void {
        this.attachEvents(
            {
                eventType: "click",
                selector: ".ts-btn-config-cancel",
                handler: () => this.onCancel()
            },
            {
                eventType: "click",
                selector: ".ts-btn-config-reset",
                handler: () => this.onReset()
            },
            {
                eventType: "click",
                selector: ".ts-btn-config-save",
                handler: () => this.onSave()
            }
        );
    }

    private onSave(): void {
        this.parent["onSaveValues"](this.configCompData.compName, this.propsView.value);
        this.propsView.destroy();
        this.close();
    }

    private onReset(): void {
        this.render();
    }

    private onCancel(): void {
        this.close();
    }

    private generatePropertyView (type: string, propData: any, currentValues: any): PropertyView {
        return <PropertyView>ViewRegistry.getEntry(type).create(
            this.parent,
            {
                config: propData,
                value: currentValues[propData.name],
                indepedent: true,
                renderName: true
            }
        );
    }

    public generate(compName: string, configData: any, currentValues: any): void {
        this.initialize();
        this.configCompData.compName = compName;
        this.propsView = <AggregateView>ViewRegistry.getEntry("AggregateView").create(
            this.parent,
            {
                name: "Configuration " + compName,
                type: "aggregate",
                renderName: false,
                indepedent: true
            }
        );
        _.forEach(configData.properties, (prop) => {
            this.propsView.addProperty (
                prop.name,
                this.generatePropertyView (
                    TypeToNameOfPropertyView (prop.type),
                    prop,
                    currentValues
                )
            );
        });
    }

    public open(): void {
        this.render();
        $("#"+this.configCompData.id)["modal"]("show");
    }


    private close(): void {
        $("#" + this.configCompData.id)["modal"]("hide");
        $("div." + this.configCompData.selector).empty();
    }
}