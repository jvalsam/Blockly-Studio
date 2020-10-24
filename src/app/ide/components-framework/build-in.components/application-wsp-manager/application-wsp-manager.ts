import { SessionHolder } from './../collaboration-manager/session-holder';
import { IDEComponent } from "../../component/ide-component";
import { ComponentMetadata, ExportedFunction, RequiredFunction } from "../../component/component-loader";
import { ApplicationsAdministration } from "../applications-admin-sc/applications-administration";
// import { Application } from "../../../shared/application";
import { Application } from "../../../ide-components/iot/application/iot-application";
import { ComponentsCommunication } from "../../component/components-communication";
import { CreateApplicationManager, NewApplication } from "./create-application-manager";

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
                [application],
                "",
                [".main-area-platform-container"]
            )
        );
    }

    private checkUnique(data, callback): void {
        let title = data.application_title.value;
        // TODO: check if there is other project with this name
        callback(true);
    }

    @RequiredFunction("ProjectManager", "openProject")
    @ExportedFunction
    public createApplication (domainType: string): void {
        CreateApplicationManager(
            domainType,
            (data, callback) => this.checkUnique(data, callback),
            (data) => {
                let title = data.json[0].application_title;
                let descr = data.json[0].application_description;
                let application = NewApplication(
                    title,
                    descr,
                    SessionHolder.User,
                    domainType
                );
                ApplicationsAdministration.requestNewApplication(
                    application,
                    (application) => ComponentsCommunication.functionRequest(
                        this.name,
                        "ProjectManager",
                        "openProject",
                        [JSON.parse(application)],
                        "",
                        [".main-area-platform-container"]
                    )
                );
            });
    }

    @RequiredFunction("CollaborationManager", "joinSession")
    @RequiredFunction("ProjectManager", "openProject")
    @ExportedFunction
    public joinApplication (): void {
        ComponentsCommunication.functionRequest(
            this.name,
            "CollaborationManager",
            "joinSession",
            [
                $(".modal-platform-container"),
                $(".collaboration-manager-container"),
                (sharedApp) => {
                    sharedApp.saveMode = "SHARED";
                    ComponentsCommunication.functionRequest(
                        this.name,
                        "ProjectManager",
                        "openProject",
                        [sharedApp],
                        "",
                        [".main-area-platform-container"]
                    );
                    sharedApp.saveMode = "SHARED";
                }
            ]
        );
    }

    @RequiredFunction("ProjectManager", "initializeSharedProject")
    @ExportedFunction
    public shareApplication (applicationId: string): void {
        ApplicationsAdministration.open(
            applicationId,
            (application) => ComponentsCommunication.functionRequest(
                this.name,
                "CollaborationManager",
                "startSession",
                [
                    $(".modal-platform-container"),
                    application,
                    $("jquery div obj"),
                    (sharedApp) => this.updateApplication(
                            sharedApp,
                            () => ComponentsCommunication.functionRequest(
                                this.name,
                                "ProjectManager",
                                "initializeSharedProject",
                                [sharedApp]
                            ))
                ]
            )
        );
    }

    @ExportedFunction
    public deleteApplication (applicationId: string, callback: Function): void {
        ApplicationsAdministration.delete(applicationId, callback);
    }

    @ExportedFunction
    public updateApplication(application: any, callback: (resp)=> void): void {
        ApplicationsAdministration.requestUpdateApplication(application, callback);
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
