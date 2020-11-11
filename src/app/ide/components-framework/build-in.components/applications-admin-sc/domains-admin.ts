import { IDEError } from './../../../shared/ide-error/ide-error';
import { RunPlatformData } from "../../../shared/data";
import {
    GetApplicationDomainFrameworks,
    GetAllProjectManagerMetaData
} from '../../../../application-domain-frameworks/domains-holder';

export class DomainsAdministration {
    public static requestDomains(callback: (domains) => void): void {
        // Plan to develop application domain frameworks via administration tools or an application domain framework
        // $.ajax({
        //     url: RunPlatformData.URL + "domains",
        //     type: "GET",
        //     success: function (data) {
        //         callback(data);
        //     },
        //     error: function (data) {
        //         IDEError.raise(data.statusText, data.responseText);
        //     }
        // });
        callback(GetApplicationDomainFrameworks());
    }

    public static requestWSPDomains(callback: (wsps) => void): void {
        // Plan to develop application domain frameworks via administration tools or an application domain framework
        // $.ajax({
        //     url: RunPlatformData.URL + "wsp_domains/all",
        //     type: "GET",
        //     success: function (data) {
        //         callback(data);
        //     },
        //     error: function (data) {
        //         IDEError.raise(data.statusText, data.responseText);
        //     }
        // });
        callback(GetAllProjectManagerMetaData());
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