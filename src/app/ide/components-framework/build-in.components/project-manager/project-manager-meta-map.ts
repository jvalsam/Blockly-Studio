/*
 *
 * Auto-generated: parse all def files that contains metadata for domain development 
 * area *.pmconf
 *
 **/

import { assert } from "../../../shared/ide-error/ide-error";
import * as _ from "lodash";
import { DomainsAdministration } from "../applications-admin-sc/domains-admin";

var menuSkeletonJson: any = require("./conf_menu.json");

var IoTMenuJSON = require("../../../ide-components/iot/defs/project-manager/conf_menu.json");

var IoTConfJSON = require("../../../ide-components/iot/defs/project-manager/conf_props.json");

// var ProjectManagerMetadataMap: {[key:string]: any} = {};

// var ProjectManagerMenuMap: {[key:string]: any} = {
//     IoT: IoTMenuJSON
// };

// var ProjectManagerConfigMap: {[key:string]: any} = {
//     IoT: IoTConfJSON
// };


// export function LoadProjectManagerMetaData(callback: Function): void {
//     DomainsAdministration.requestWSPDomains((wsps) => {
//         _.forEach(wsps, (wsp) => {
//             ProjectManagerMetadataMap[wsp.domain] = wsp;
//         });
//         callback();
//     });
// }

// export function GetProjectManagerMetaData(key: string): any {
//     assert(key in ProjectManagerMetadataMap, "Error: Not found " + key + " in existing domains of the Platform.");
//     return ProjectManagerMetadataMap[key];
// }

// export function GetProjectManagerMenuJSON(): any {
//     let path = "/Configure/ProjectManager/";
//     _.forOwn(ProjectManagerMenuMap, (value) => {
//         value["path"] = path;
//         menuSkeletonJson.MenuElements.push(value);
//         // fix next path
//         path += value["data"].title + "|";
//     });
//     return menuSkeletonJson;
// }

// export function GetProjectManagerDomainNames(): Array<string> {
//     return Object.keys(ProjectManagerMetadataMap);
// }

// export function GetDomainsConfigJSON(): any {
//     return ProjectManagerConfigMap;
// }

interface IElementInfo {
}

//TODO: move all functionality of meta-data in this holder
export class ProjectManagerMetaDataHolder {
    private static _domainsMetaDataMap: { [domain:string]: any };
    private static _domainStylesDataMap: { [style: string]: any };
    private static _configMap;
    private static _menuJSON;
    private static _domainsElementsInfoMap: { [domain: string]: { [element: string]: IElementInfo } };

    public static load(callback: Function): void {
        ProjectManagerMetaDataHolder._domainsMetaDataMap = {};
        ProjectManagerMetaDataHolder._domainStylesDataMap = {};
        DomainsAdministration.requestWSPDomains((wsps) => {
            _.forEach(wsps, (wsp) => {
                ProjectManagerMetaDataHolder._domainsMetaDataMap[wsp.domain] = wsp;
            });
            DomainsAdministration.requestVisualSources((sources)=> {

                DomainsAdministration.requestWSPDomainStyles((styles) => {
                    _.forEach(styles, (style) => {
                        ProjectManagerMetaDataHolder._domainStylesDataMap[style.name] = style;
                    });
                    callback();
                });
            });
        });
    }

    public static initialize(): void {
        ProjectManagerMetaDataHolder._configMap = {
            IoT: IoTConfJSON
        };
        ProjectManagerMetaDataHolder._menuJSON = {
            IoT: IoTMenuJSON
        };
    }

    public static getDomainNames(): Array<String> {
        return Object.keys(ProjectManagerMetaDataHolder._domainsMetaDataMap);
    }

    public static getDomainsMenuJSON(): Array<String> {
            let path = "/Configure/ProjectManager/";
        _.forOwn(ProjectManagerMetaDataHolder._menuJSON, (value) => {
            value["path"] = path;
            menuSkeletonJson.MenuElements.push(value);
            // fix next path
            path += value["data"].title + "|";
        });
        return menuSkeletonJson;
    }

    public static getDomainsConfigJSON(): any {
        return ProjectManagerMetaDataHolder._configMap;
    }

    public static getWSPDomainMetaData (domain: string): any {
        assert(domain in ProjectManagerMetaDataHolder._domainsMetaDataMap, "Error: Not found " + domain + " in existing domains of the Platform.");
        return ProjectManagerMetaDataHolder._domainsMetaDataMap[domain];
    }

    public static getWSPDomainStyle(style: string): any {
        assert(style in ProjectManagerMetaDataHolder._domainStylesDataMap, "Error: Not found " + style + " in existing domain styles of the Platform.");
        return ProjectManagerMetaDataHolder._domainStylesDataMap[style];
    }
}
