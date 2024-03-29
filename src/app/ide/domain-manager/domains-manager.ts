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
import { InitializeVPDLs } from "../../application-domain-frameworks/domains-initialization";
import { VPLDomainElementsHolder } from "./administration/vpl-domain-elements-holder";

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
        VPLDomainElementsManager.initialize(this);
        VPLDomainElementsHolder.initialize(this);
        InitializeVPDLs();
    }

    @RequiredFunction("BlocklyVPL", "onMissionUpdate")
    @RequiredFunction("BlocklyVPL", "onDeleteVPLElements")
    private functionRequest(editorName, action, data) {
        ComponentsCommunication.functionRequest(
            this.name,
            editorName,
            action,
            [data]);
    }

    @RequiredFunction("ProjectManager", "saveComponentData")
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

    @ExportedFunction
    public receiveSignals(projectId: string, signalsData: any) {
        signalsData.forEach(elem => {
            this.receiveSignal(elem.signal, elem.data)
        });
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
            this.name,
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
    loadComponentDataOfProject(projectId: string, componentsData: any) {
        VPLDomainElementsHolder.loadProject(projectId, componentsData);
        // load data using the signals
        VPLDomainElementsHolder.setLoadingMode(true);
        this.receiveSignals(
            projectId,
            componentsData.signals
        );
        VPLDomainElementsHolder.updateToolboxesAndRemove();
        VPLDomainElementsHolder.setLoadingMode(false);
    }

    @ExportedFunction
    initComponentDataOfProject(projectId: string) {
        VPLDomainElementsHolder.initProject(projectId);
    }

    @ExportedFunction
    public getProjectItem(name): any {
        return VPLDomainElementsManager.getProjectItemInfo(name);
    }

    @ExportedFunction
    public getProjectItemEditorsConfig(name): any {
        return VPLDomainElementsManager.getProjectItemEditorsConfig(name);
    }

    @ExportedFunction
    public getEditorConfigs(editor: string) {
        return VPLDomainElementsManager.getEditorConfigs(editor);
    }

    @ExportedFunction
    public getBlockTypesToDomainElementsMap(projectId: string) {
        return VPLDomainElementsManager.getBlockTypesToDomainElementsMap(projectId);
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
