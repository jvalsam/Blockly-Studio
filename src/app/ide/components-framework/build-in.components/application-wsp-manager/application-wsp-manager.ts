import { IDEComponent } from "../../component/ide-component";
import { ComponentMetadata, ExportedFunction, RequiredFunction } from "../../component/component-loader";
import { ApplicationsAdministration } from "../applications-admin-sc/applications-administration";
// import { Application } from "../../../shared/application";
import { Application } from "../../../ide-components/iot/application/iot-application";
import { ComponentsCommunication } from "../../component/components-communication";

@ComponentMetadata({
    description: "Application WSP Manager",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "Octomber 2017"
        }
    ],
    isUnique: true
})
export class ApplicationWSPManager extends IDEComponent {
    private readonly postfixOpenAppComp = "WSPEditor";

    @RequiredFunction("ProjectManager", "openProject")
    @ExportedFunction
    public openApplication (applicationId: string): void {
        ApplicationsAdministration.open(
            applicationId,
            (application) => ComponentsCommunication.functionRequest(
                this.name,
                "ProjectManager",
                "openProject",
                [application]
            )
        );
    }

    @ExportedFunction
    public deleteApplication (applicationId: string): void {
        ApplicationsAdministration.delete(applicationId);
    }

    @ExportedFunction
    public shareApplication (applicationId: string, shareData: any): void {
        ApplicationsAdministration.share(applicationId, shareData);
    }

    @ExportedFunction
    public createApplication (domainType: string): Application {

        return null;
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
