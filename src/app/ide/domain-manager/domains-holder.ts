import { MapHolder } from "./../shared/map-holder";


export interface IDomainElementsMap {
    [projectId: string]: { [domainElementID: string]: any };
}

/**
 * Map: key => Component Name, value => Array of ComponentSignals
 */

let _DomainElementsHolder =
    new MapHolder<IDomainElementsMap>("DomainElements");

_DomainElementsHolder["getElement"] =
function (projectId :string, domainElemId: string): any {
    let projectDomainElements = _DomainElementsHolder.get(projectId);
    return projectDomainElements[domainElemId];
};

export let DomainElementsHolder = _DomainElementsHolder;