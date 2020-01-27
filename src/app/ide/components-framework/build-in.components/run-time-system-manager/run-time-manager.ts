import { assert, IDEError } from '../../../shared/ide-error/ide-error';
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from '../../component/ide-ui-component';

// initialize the metadata of the project manager component for registration in the platform
ProjectManagerMetaDataHolder.initialize();
var menuJson = ProjectManagerMetaDataHolder.getDomainsMenuJSON();
var configJson = ProjectManagerMetaDataHolder.getDomainsConfigJSON();


@UIComponentMetadata({
    description: "Project Manager of the IDE",
    authors: [
        { date: "March 2018", name: "Yannis Valsamakis", email: "jvalsam@ics.forth.gr" }
    ],
    componentView: "ProjectManagerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class RuntimeManager extends IDEUIComponent {
    public registerEvents(): void {
        throw new Error("Method not implemented.");
    }    public update(): void {
        throw new Error("Method not implemented.");
    }
    public onOpen(): void {
        throw new Error("Method not implemented.");
    }
    public onClose(): void {
        throw new Error("Method not implemented.");
    }
    public destroy(): void {
        throw new Error("Method not implemented.");
    }
}
