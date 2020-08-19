/**
 * ApplicationsAdminSC - Applications Administration Service Communication (front-end && back-end)
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 *
 */

import { ApplicationsHolder } from "../../holders";
import * as _ from "lodash";
import { RunPlatformData } from "../../../shared/data";
import {IDEError} from '../../../shared/ide-error/ide-error';


export interface AppFilter {
    name: string;
    value: String | Array<String>;
}

export class ApplicationsAdministration {
    private static readonly prefix = "$application_";

    public static requestUserApplications(callback: (elements) => void): void {
        $.get(
            RunPlatformData.URL + "applications/user/outline",
            (applications) => callback(applications)
        );
    }

    public static requestApplications(filters: Array<AppFilter>, callback: (elements) => void): void {
        $.post(
            RunPlatformData.URL + "applications/filters",
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
            RunPlatformData.URL + "applications/"+appId,
            (application, textStatus) => {
                if (application) {
                    callback(application);
                }
            }
        );
    }

    public static requestUpdateApplication(application: any, callback: (wsps) => void): void {
        $.ajax({
            url: RunPlatformData.URL + "applications/"+application._id,
            type: "PUT",
            data: {
                data: application
            },
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                callback (false);
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }

    public static requestNewApplication(application: any, callback: (wsps) => void): void {
        $.ajax({
            url: RunPlatformData.URL + "applications/new",
            type: "POST",
            data: {
                data: application
            },
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }

    public static delete(appId: string, callback: Function): void {
        $.ajax({
            url: RunPlatformData.URL + "applications/" + appId,
            type: 'DELETE',
            success: function(result) {
                callback(result);
            },
            error: function (data) {
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }

    public static share(appId: string, data: any): boolean {
        return false;
    }
}