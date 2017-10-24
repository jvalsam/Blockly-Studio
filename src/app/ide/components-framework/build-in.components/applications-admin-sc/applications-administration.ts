/**
 * ApplicationsAdminSC - Applications Administration Service Communication (front-end && back-end)
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 *
 */

import { ApplicationModel } from "../../../shared/models/application.model";
import { IoTApplication } from "../../../ide-components/iot/application/iot-application";
import { Automation } from "../../../ide-components/iot/application/automation";
import { Application } from "../../../shared/application";
import { ApplicationsHolder } from "../../holders";
import * as _ from "lodash";

export class ApplicationsAdministration {
    private static readonly prefix = "$application_";
    private static numberOfApplications: number = 0;

    public static requestUserApplications(): Array<ApplicationModel> {
        const response: Array<ApplicationModel> = [
            new ApplicationModel("user_app00001", "Remote Hospitality", "Automations using smart objects for remote hospitality purpuses"),
            new ApplicationModel("user_app00002", "Morning Automations", "Automations using smart objects for the morning automations"),
            new ApplicationModel("user_app00003", "Self-Caring Home", "Automations using smart objects for home care")
        ];
        _.forEach(
            response,
            function (application: ApplicationModel): void {
                ++ApplicationsAdministration.numberOfApplications;
                ApplicationsHolder.put(application.id, application);
            }
        );
        return response;
    }

    public static requestSharedApplications(): Array<ApplicationModel> {
        const response: Array<ApplicationModel> = [
            new ApplicationModel("shared_app00001", "Remote Hospitality", "Automations using smart objects for remote hospitality purpuses"),
            new ApplicationModel("shared_app00002", "Morning Automations", "Automations using smart objects for the morning automations"),
            new ApplicationModel("shared_app00003", "Self-Caring Home", "Automations using smart objects for home care")
        ];
        _.forEach(
            response,
            function (application: ApplicationModel): void {
                ++ApplicationsAdministration.numberOfApplications;
                ApplicationsHolder.put(application.id, application);
            }
        );
        return response;
    }

    public static initialize(): void {
        ApplicationsHolder.initialize();
    }

    public static open(appId: string): Application {
        // server requests code data of the application
        // create Application Component
        // request Shell to open the component
        return new IoTApplication(
            {
                "Smart Objects Automations" : [
                    new Automation("auto-so-1", "First time alarm clock rings", "Smart Objects Automations"),
                    new Automation("auto-so-2", "Alarm clock stops", "Smart Objects Automations")
                ],
                "Calendar Automations" : [
                    new Automation("auto-ca-1", "Every Monday tasks", "Calendar Automations"),
                    new Automation("auto-ca-2", "Every week tasks", "Calendar Automations")
                ],
                "Time Events": []
            }
        );
    }

}