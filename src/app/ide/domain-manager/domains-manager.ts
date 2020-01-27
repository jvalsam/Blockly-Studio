import { IDEComponent } from "../../ide/components-framework/component/ide-component";
import { ComponentMetadata, ExportedFunction, RequiredFunction } from "../../ide/components-framework/component/component-loader";
import { ComponentsCommunication } from "../../ide/components-framework/component/components-communication";
import { Domain } from "domain";

@ComponentMetadata({
    description: "Domains Manager",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "December 2019"
        }
    ],
    isUnique: true
})
export class DomainsManager extends IDEComponent {
    private currentDomain: Domain;

    @ExportedFunction
    public getCurrentDomain (): Domain {
        return this.currentDomain;
    }

    @ExportedFunction
    public loadDomain (domain: String): void {
        
    }
    
    @RequiredFunction("ProjectManager", "openProject")
    @ExportedFunction
    public getProjectManagerDescription (domain: string): JSON {
        return JSON.parse("{}");
    }

    public destroy(): void {
        
    }
}
