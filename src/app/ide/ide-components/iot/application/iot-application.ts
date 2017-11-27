
import { IDEError } from "../../../shared/ide-error/ide-error";
import { Application } from "../../../shared/application";
import { Automation } from "./automation";

export interface IAutomationsMap {
    [name: string]: Array<Automation>;
}

export class IoTApplication extends Application {
    constructor(
        private _automations: IAutomationsMap = {}
    ) {
        super("IoT");
    }

    get automations(): IAutomationsMap { return this._automations; }

    public getAutomation(id: string, type: string): Automation {
        if (! (type in this._automations)) {
            IDEError.raise("IoTApplication", "Error: Group " + type + " not found");
        }
        for (let automation of this._automations[type]) {
            if (automation.id === id) {
                return automation;
            }
        }
        return null;
    }
}
