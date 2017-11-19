/**
 * ApplicationWSPManager
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */

import { IDEComponent } from "../../component/ide-component";
import { ComponentMetadata, ExportedFunction } from "../../component/component-loader";
import { ApplicationsAdministration } from "../applications-admin-sc/applications-administration";
import { Application } from "../../../shared/application";
import { ComponentsCommunication } from "../../component/components-communication";

@ComponentMetadata({
    description: "",
    isUnique: true
})
export class ApplicationWSPManager extends IDEComponent {
    private readonly postfixOpenAppComp = "WSPEditor";

    @ExportedFunction
    public openApplication (applicationId: string): void {
        const app: Application = ApplicationsAdministration.open(applicationId);
        ComponentsCommunication.functionRequest(
            this.name,
            app.type + this.postfixOpenAppComp,
            "open",
            [app]
        );
    }

    public onOpen(): void {}
    public destroy(): void {}
    public onClose(): void {}
    public registerEvents(): void {}
    public update(): void {}
    public load(): void {

    }
    public save(): void {

    }
}
