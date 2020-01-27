import { IDEError } from './../../../shared/ide-error/ide-error';
import { RunPlatformData } from "../../../shared/data";

export class DomainsAdministration {
    public static requestDomains(callback: (domains) => void): void {
        $.ajax({
            url: RunPlatformData.URL + "domains",
            type: "GET",
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }

    public static requestWSPDomains(callback: (wsps) => void): void {
        $.ajax({
            url: RunPlatformData.URL + "wsp_domains/all",
            type: "GET",
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }

    public static requestVisualSources(/*srcNames: Array<String>, no exist in older versions*/ callback: (sources) => void): void {
        $.ajax({
            url: RunPlatformData.URL + "veup-domain-sources/all",
            type: "GET",
            success: function (data) {
                let domains = 
                callback(data);
            },
            error: function (data) {
                IDEError.raise(data.statusText, data.responseText);
            }
        });
    }

    public static requestWSPDomainStyles(callback: (styles) => void): void {
        $.ajax({
            url: RunPlatformData.URL + "wsp_styles/all",
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