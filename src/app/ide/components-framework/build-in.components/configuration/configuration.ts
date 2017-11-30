import { ComponentRegistry } from "../../component/component-entry";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { UIComponentMetadata } from "../../component/component-loader";

var confMenuJson: any = require("./conf_menu.json");

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
    menuDef: confMenuJson,
    isUnique: true
})
export class Configuration extends IDEUIComponent {

    public initialize(): void {
        let data: { [compName: string]: any } = {};
        for (let compName of Object.keys(ComponentRegistry.getEntries())) {
            let jsonConfigMetadata = ComponentRegistry.getEntry(compName).getConfigMetadata();
            if (jsonConfigMetadata) {
                data[compName] = jsonConfigMetadata;
            }
        }
        this.view.setRenderData(data);
    }

    public destroy(): void {}

    public onClose(): void {}

    public onOpen(): void {}

    public registerEvents(): void {
        this.view.registerEvents();
    }

    public update(): void {}
}
