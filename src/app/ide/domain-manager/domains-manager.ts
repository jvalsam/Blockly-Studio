import {
    IDEComponent
} from "../../ide/components-framework/component/ide-component";
import {
    ComponentMetadata,
    ExportedFunction,
    RequiredFunction
} from "../../ide/components-framework/component/component-loader";
import {
    ComponentsCommunication
} from "../../ide/components-framework/component/components-communication";
import { Domain } from "./domain";
import {
    VPLDomainElementsManager
} from "./administration/vpl-domain-elements-manager";
import { InitializeVPDLs } from "../domains/domains";

@ComponentMetadata({
    description: "Domains Manager",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "March 2020"
        }
    ],
    isUnique: true
})
export class DomainsManager extends IDEComponent {
    private currentDomain: Domain;

    @ExportedFunction
    initialize(): void {
        VPLDomainElementsManager.initialize();
        InitializeVPDLs();
    }

    @ExportedFunction
    public getCurrentDomain (): Domain {
        return this.currentDomain;
    }

    @ExportedFunction
    public getCurrentDomainName(): String {
        return this.currentDomain.name;
    }

    @ExportedFunction
    public loadDomain (domain: String): void {
        VPLDomainElementsManager.load(domain);
    }

    @RequiredFunction("ProjectManager", "openProject")
    @ExportedFunction
    public getProjectManagerDescription (domain: string): JSON {
        return JSON.parse("{}");
    }

    public destroy(): void {
        
    }
}
