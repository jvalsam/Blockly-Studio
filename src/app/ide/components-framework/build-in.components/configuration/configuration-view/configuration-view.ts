/// <reference path="../../../../../../../node.d.ts"/>
import ConfigurationViewTmpl from "./configuration.html";
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
    //menuElems:[]
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
        this.renderTmplEl(this.configCompData);
        this.setStyle();
        this.propsView.render();
        // this.$el.find(".config-properties-body").append(this.propsView.$el);
        // $("div."+this.configCompData.selector).empty();
        // $("div."+this.configCompData.selector).append(this.$el);
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

    public setStyle(): void {
        this.$el.find("configModalTitle").css(FontView.getStyle(this.configCompData.style["Config Title Elements"]));
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
    // σαμε να στείλετε το αποδεικτικό της κατάθεσής σας στο info@bestdeals.gr

    public generate(compName: string, configData: any, currentValues: any): void {
        this.initialize();
        this.configCompData.compName = compName;
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
        this.propsView
        _.forEach(configData.properties, (prop) => {
            prop.style = this.configCompData.style;
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