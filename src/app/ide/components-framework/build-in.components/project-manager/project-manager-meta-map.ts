/*
 *
 * Auto-generated: parse all def files that contains metadata for domain development 
 * area *.pmconf
 *
 **/

import { assert } from "../../../shared/ide-error/ide-error";

var IoT: any = require("./../../../ide-components/iot/defs/project-manager-meta.json");


var ProjectManagerMetadataMap: {[key:string]: any} = {
    "iot": IoT
};

export function GetProjectManagerMetaData(key: string): any {
    assert(key in ProjectManagerMetadataMap);
    return ProjectManagerMetadataMap[key];
}
