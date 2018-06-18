import { ConfigurationView } from "./configuration-view/configuration-view";
import { ComponentRegistry } from "../../component/component-entry";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { UIComponentMetadata, ExportedFunction } from "../../component/component-loader";

var menuJson: any = require("./conf_menu.json");
var configJson: any = require("./conf_props.json");

@UIComponentMetadata({
    description: "Configuration of all components of the IDE",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "Octomber 2017"
        }
    ],
    componentView: "ConfigurationView",
    menuDef: menuJson,
    configDef: configJson,
    isUnique: true
})
export class Configuration extends IDEUIComponent {

    @ExportedFunction
    public initialize(): void { ; }

    @ExportedFunction
    public destroy(): void { ; }

    @ExportedFunction
    public onClose(): void { ; }

    @ExportedFunction
    public onOpen(): void { ; }

    @ExportedFunction
    public registerEvents(): void {
        this.view.registerEvents();
    }

    @ExportedFunction
    public update(): void { ; }

    @ExportedFunction
    public openComponentConfig(compName: string): void {
        let currentValues: any = ComponentRegistry.getEntry(compName).getCurrentConfigValues();
        let configData: any = ComponentRegistry.getEntry(compName).getConfigMetadata();
        (<ConfigurationView>this.view).setRenderDynamicData(compName, configData, currentValues);
        (<ConfigurationView>this.view).open();
    }

    public onSaveValues(compName: string, values: any): void {
        ComponentRegistry.getEntry(compName).updateConfigValues(values);
    }

    public onChangeConfig(values: any): void {
        this.view["setConfigData"](values);
    }
}
