import { DomainElementsHolder } from "./domains-holder";
import {
    IDEComponent
} from "../../ide/components-framework/component/ide-component";
import {
    ComponentMetadata,
    ExportedFunction,
    RequiredFunction
} from "../../ide/components-framework/component/component-loader";
import {
    ComponentsCommunication,
    ListensSignals
} from "../../ide/components-framework/component/components-communication";
import { Domain } from "./domain";
import {
    VPLDomainElementsManager
} from "./administration/vpl-domain-elements-manager";
import { InitializeVPDLs } from "../domains/domains";


export interface IDomainElementDB {
    id: string;
    name: string;
    editor: string;
    data: any;
    depedencies: Array<any>;
}

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

    constructor(name: string, description: string) {
        super(name, description);
        this.initialize();
    }

    @ExportedFunction
    public initialize(): void {
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
    public receiveSignal(signal, data) {
        VPLDomainElementsManager.receiveSignal(signal, data);
    }

    private listensSignals(signals): void {
        let signalsArray = [];
        for (let name of Object.keys(signals)) {
            signalsArray.push({
                signal: name,
                source: signals[name][0].provider,
                callback: (data) => this.receiveSignal(name, data)
            });
        }
        ListensSignals(
            "DomainManager",
            signalsArray
        );
    }

    @ExportedFunction
    public loadDomain (domain: String): void {
        VPLDomainElementsManager.load(
            domain,
            (signals) => this.listensSignals(signals)
        );
    }

    @ExportedFunction
    public loadProject(
        projectId: string,
        domainElements: Array<IDomainElementDB>
    ): void {
        let projectDomainElems = {};
        domainElements.forEach(domainElement =>
            projectDomainElems[domainElement.name] = domainElement);
        DomainElementsHolder.put(projectId, projectDomainElems);

        domainElements.forEach(domainElement => {
            // request editors to load the domain elements of the project
            ComponentsCommunication.functionRequest(
                this.name,
                domainElement.editor,
                "getDomainElementData",
                [projectId, domainElement.id]
            );
            // load depedencies for each of the project items

        });
    }

    @ExportedFunction
    public getProjectItem(name): any {
        return VPLDomainElementsManager.getProjectItemInfo(name);
    }

    @ExportedFunction
    public getEditorConfigs(editor: string) {
        return VPLDomainElementsManager.getEditorConfigs(editor);
    }

    @ExportedFunction
    public getEditors(): Array<string> {
        return VPLDomainElementsManager.getEditors();
    }

    @ExportedFunction
    public getToolbox(config: string): any {
        return VPLDomainElementsManager.getToolbox(config);
    }


    @RequiredFunction("ProjectManager", "openProject")
    @ExportedFunction
    public getProjectManagerDescription (domain: string): JSON {
        return JSON.parse("{}");
    }

    public destroy(): void {

    }
}
