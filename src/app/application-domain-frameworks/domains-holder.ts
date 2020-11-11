/**
 * -- Auto generated --
 * Domains Holder for the Application Domains Information and Project Manager of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2020-11-11 17:34:47.462000
 */


var ProjectManagerMetaData;
var ApplicationDomainFrameworks;

export function InitializeDomainsHolder() {
    ProjectManagerMetaData = [];
    ApplicationDomainFrameworks = [];

    ProjectManagerMetaData.push( require('./domains-vpl-conf/IoT/project/application-structure.json') );
    ApplicationDomainFrameworks.push( require('./domains-vpl-conf/IoT/project/domain-info.json') );
    ProjectManagerMetaData.push( require('./domains-vpl-conf/LoGo/project/application-structure.json') );
    ApplicationDomainFrameworks.push( require('./domains-vpl-conf/LoGo/project/domain-info.json') );
    ProjectManagerMetaData.push( require('./domains-vpl-conf/MobileApps/project/application-structure.json') );
    ApplicationDomainFrameworks.push( require('./domains-vpl-conf/MobileApps/project/domain-info.json') );
    ProjectManagerMetaData.push( require('./domains-vpl-conf/SimpleTasks/project/application-structure.json') );
    ApplicationDomainFrameworks.push( require('./domains-vpl-conf/SimpleTasks/project/domain-info.json') );
    ProjectManagerMetaData.push( require('./domains-vpl-conf/WebApps/project/application-structure.json') );
    ApplicationDomainFrameworks.push( require('./domains-vpl-conf/WebApps/project/domain-info.json') );
}


export function GetProjectManagerMetaData(domain) {
    return ProjectManagerMetaData[domain];
}

export function GetAllProjectManagerMetaData() {
    return ProjectManagerMetaData;
}

export function GetApplicationDomainFrameworks() {
    return ApplicationDomainFrameworks;
}

