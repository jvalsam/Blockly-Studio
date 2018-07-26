/*
 *
 * Auto-generated: parse all def files that contains metadata for domain development 
 * area *.pmconf
 *
 **/

import { assert } from "../../../shared/ide-error/ide-error";
import * as _ from "lodash";

var menuSkeletonJson: any = require("./conf_menu.json");

var IoT: any = require("./../../../ide-components/iot/defs/project-manager-meta.json");

var IoTMenuJSON = require("./../../../ide-components/iot/defs/conf_menu.json");

var IoTConfJSON = require("./../../../ide-components/iot/defs/conf_props.json");

var ProjectManagerMetadataMap: {[key:string]: any} = {
    IoT: IoT
};

var ProjectManagerMenuMap: {[key:string]: any} = {
    IoT: IoTMenuJSON
};

var ProjectManagerConfigMap: {[key:string]: any} = {
    IoT: IoTMenuJSON
};


export function GetProjectManagerMetaData(key: string): any {
    assert(key in ProjectManagerMetadataMap, "Error: Not found " + key + " in existing domains of the Platform.");
    return ProjectManagerMetadataMap[key];
}

export function GetProjectManagerMenuJSON(): any {
    let path = "/Configure/ProjectManager/";
    _.forOwn(ProjectManagerMenuMap, (value) => {
        value["path"] = path;
        menuSkeletonJson.MenuElements.push(value);
        // fix next path
        path += value["data"].title + "|";
    });
    return menuSkeletonJson;
}

export function GetProjectManagerDomainNames(): Array<string> {
    return Object.keys(ProjectManagerMetadataMap);
}

export function GetDomainsConfigJSON(): any {
    return ProjectManagerConfigMap;
}