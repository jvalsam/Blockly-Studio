/**
 * -- Auto generated --
 * Domains Loader - Instantiation for the Application Domains of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2020-11-11 01:29:49.098000
 */

import {
    InitializeVPDL as InitializeIoTVPDL
} from "./domains-vpl-conf/IoT/vpdl/domain";
import {
    InitializeVPDL as InitializeSimpleTasksVPDL
} from "./domains-vpl-conf/SimpleTasks/vpdl/domain";

var ProjectManagerMetaData;

export function InitializeVPDLs() {
    ProjectManagerMetaData = { };
    InitializeIoTVPDL();
    ProjectManagerMetaData['IoT'] = require('./domains-vpl-conf/IoT/project-manager/application-structure.json')
    InitializeSimpleTasksVPDL();
    ProjectManagerMetaData['SimpleTasks'] = require('./domains-vpl-conf/SimpleTasks/project-manager/application-structure.json')
}


export function GetProjectManagerMetaData(domain) {
    return ProjectManagerMetaData[domain];
}

