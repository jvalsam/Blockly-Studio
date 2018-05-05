/**
 * ApplicationsAdminSC - Applications Administration Service Communication (front-end && back-end)
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 *
 */

import { IoTApplication, Application } from "../../../ide-components/iot/application/iot-application";
import { Automation } from "../../../ide-components/iot/application/automation";
// import { Application } from "../../../shared/application";
import { ApplicationsHolder } from "../../holders";
import * as _ from "lodash";
import { URL } from "../../../shared/data";


export interface AppFilter {
    name: string;
    value: String | Array<String>;
}

export class ApplicationsAdministration {
    private static readonly prefix = "$application_";

    public static requestUserApplications(callback: (elements) => void): void {
        $.get(
            URL + "applications/user/outline",
            (applications) => callback(applications)
        );
    }

    public static requestApplications(filters: Array<AppFilter>, callback: (elements) => void): void {
        $.post(
            URL + "applications/filters",
            { filters: filters },
            (applications) => callback(applications)
        );
    }

    public static requestSharedApplications(callback: (elements) => void): void {
        // TODO: extend privileges for specific users
        //       or categories of users etc.
        this.requestApplications([ { name: "privileges", value: ["public"] } ], callback);
    }

    public static initialize(): void {
        ApplicationsHolder.initialize();
    }

    public static open(appId: string, callback: Function): void {
        $.get(
            URL + "applications/:id/"+appId,
            (application, textStatus) => {
                if (application) {
                    callback(application);
                }
            }
        );
    }

    public static delete(appId: string): boolean {
        return false;
    }

    public static share(appId: string, data: any): boolean {
        return false;
    }
}