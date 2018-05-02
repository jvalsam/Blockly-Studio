
import { IDEError } from "../../../shared/ide-error/ide-error";
import { Automation } from "./automation";
import * as _ from "lodash";


export interface IAutomationsMap {
    [name: string]: Array<Automation>;
}



export class Application {

    constructor(
        private readonly _type: string
    ) { }

    get type(): string { return this._type; }

}

export class IoTApplication extends Application {
    constructor(
        private _automations: IAutomationsMap = {}
    ) {
        super("IoT");
    }

    get automations(): IAutomationsMap { return this._automations; }

    public getAutomation(id: string, type: string): Automation {
        if (!(type in this._automations)) {
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
