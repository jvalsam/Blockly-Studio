

import { Application } from "../../../shared/application";

export interface IAutomationsMap {
    [name: string]: any;
}

export class IoTApplication extends Application {
    
    constructor(
        private _automations: IAutomationsMap = {}
    ) {
        super("IoT");
    }

    get automations(): IAutomationsMap { return this.automations; }

}
