import { IDEError } from './../../../shared/ide-error/ide-error';
import { URL } from "../../../shared/data";

export class DomainsAdministration {
    public static requestDomains(callback: (domains) => void): void {
        $.ajax({
            url: URL + "domains",
            type: "GET",
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }
}