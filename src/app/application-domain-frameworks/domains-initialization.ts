/**
 * -- Auto generated --
 * Domains Initialization for the Application Domains of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2020-11-11 17:34:47.461000
 */

import {
    InitializeVPDL as InitializeIoTVPDL
} from "./domains-vpl-conf/IoT/vpdl/domain";
import {
    InitializeVPDL as InitializeLoGoVPDL
} from "./domains-vpl-conf/LoGo/vpdl/domain";
import {
    InitializeVPDL as InitializeMobileAppsVPDL
} from "./domains-vpl-conf/MobileApps/vpdl/domain";
import {
    InitializeVPDL as InitializeSimpleTasksVPDL
} from "./domains-vpl-conf/SimpleTasks/vpdl/domain";
import {
    InitializeVPDL as InitializeWebAppsVPDL
} from "./domains-vpl-conf/WebApps/vpdl/domain";

export function InitializeVPDLs() {
    InitializeIoTVPDL();
    InitializeLoGoVPDL();
    InitializeMobileAppsVPDL();
    InitializeSimpleTasksVPDL();
    InitializeWebAppsVPDL();
}

