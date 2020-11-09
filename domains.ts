/**
 * -- Auto generated --
 * Domains Loader - Instantiation for the Application Domains of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2020-11-10 00:06:13.399000
 */

import {
    InitializeVPDL as InitializeIoTVPDL
} from "./src/app/ide/domains/IoT/vpdl/iot-domain";
import {
    InitializeVPDL as InitializeSimpleDomainVPDL
} from "./src/app/ide/domains/SimpleTasks/vpdl/simple-domain";

export function InitializeVPDLs() {
    InitializeIoTVPDL();
    InitializeSimpleDomainVPDL();
}

