/// <reference path="../../../../../../../node.d.ts"/>
import ConfigurationViewTmpl from "./configuration.tmpl";
import { ComponentViewMetadata } from "../../../component/component-view";
import { ComponentView } from "../../../component/component-view";
import { PropertyView } from "./property-views/property-view";
import { FontView } from "./property-views/font-view/font-view";
import { AggregateView } from "./property-views/aggregate-view/aggregate-view";

import * as _ from "lodash";
import { ViewRegistry } from "../../../component/registry";


@ComponentViewMetadata({
    name: "ConfigurationView",
    templateHTML: ConfigurationViewTmpl
})
export class ConfigurationView extends ComponentView {
    private propsView: AggregateView;
    private configCompData: {
        id: string,
        compName: string,
        style: Object
    };

    public initialize(): void {
        super.initialize();
        this.configCompData = {
            id: "configModalCenter",
            // selector: "modal-view-area",
            compName: "",
            style: this.parent["_configProperties"]
        };
        this.propsView = null;
    }

    public render(): void {
        this.initialize();
        this.configCompData.compName = this.renderData.compName;
        this.renderTmplEl(this.configCompData);
        this.generateProperties(this.renderData.compName, this.renderData.configData, this.renderData.currentValues);
        this.propsView.clearSelectorArea = false;
        this.propsView.render();
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
            },
            {
                eventType: "hidden.bs.modal",
                selector: "this",
                handler: () => this.destroy()
            }
        );
    }

    public setStyle(): void {
        this.$el.find("#configModalTitle").css(
            FontView.getStyle(this.configCompData.style["Config Title Elements"])
        );
    }

    private onSave(): void {
        this.parent["onSaveValues"](this.configCompData.compName, this.propsView.value);
        this.propsView.destroy();
    }

    private onReset(): void {
        this.close();
        this.open();
    }

    private onCancel(): void {
        this.close();
    }

    private generatePropertyView (propData: any, currentValues: any): any {
        return {
            config: propData,
            value: currentValues[propData.name],
            indepedent: true,
            renderName: true
        };
    }

    public setRenderDynamicData (compName: string, configData: any, currentValues: any) {
        this.renderData = {
            compName: compName,
            configData: configData,
            currentValues: currentValues
        };
    }

    public generateProperties(compName: string, configData: any, currentValues: any): void {
        this.propsView = <AggregateView>ViewRegistry.getEntry("AggregateView").create(
            this.parent,
            ".config-properties-body",
            {
                name: "Configuration " + compName,
                type: "aggregate",
                renderName: false,
                indepedent: true
            }
        );
        _.forEach(configData.properties, (prop) => {
            prop.style = this.configCompData.style["Config Elements"];
            this.propsView.addProperty (
                prop.name,
                prop.type,
                this.generatePropertyView (
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
        $("#" + this.configCompData.id + " .close").click();
    }

    public setConfigData (data: any): void {
        this.close();
        this.setRenderData("config", data);
        this.configCompData.style = data;
        _.forOwn(this.propsView.properties, (property: PropertyView, key: string) => {
            property.data.style = data;
        });
    }
}