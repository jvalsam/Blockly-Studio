import { RuntimeManagerDataHolder } from './run-time-manager-data-holder';
import {
    assert,
    IDEError,
    StopProjectAppError
} from '../../../shared/ide-error/ide-error';
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from '../../component/ide-ui-component';

// initialize the metadata of the project manager component for registration in the platform
RuntimeManagerDataHolder.initialize();
var menuJson = RuntimeManagerDataHolder.getDomainsMenuJSON();
var configJson = RuntimeManagerDataHolder.getDomainsConfigJSON();

@UIComponentMetadata({
    description: "Runtime Manager of the IDE",
    authors: [
        {
            date: "January 2020",
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr"
        }
    ],
    componentView: "RuntimeManagerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class RuntimeManager extends IDEUIComponent {
    private isOpen: Boolean;

    constructor(
        name: string,
        description: string,
        componentView: string,
        hookSelector: string,
        private domainType: string
    ) {
        super(name, description, componentView, hookSelector);
        this.isOpen = false;
    }

    public registerEvents(): void { ; }

    public update(): void { ; }

    public onOpen(): void { ; }

    public onClose(): void { ; }

    public destroy(): void { ; }

    @ExportedFunction
    public onChangeConfig(values: Object): void {
        alert("on change config data not developed yet in Menu Component");
    }

    private onStartRunApplicationBtn(): void {
        try {
            throw new StopProjectAppError('user');
        }
        catch (error) {
            if (error instanceof StopProjectAppError) {
                this.StopApplication();
            }
            else {
                throw error;
            }
        }
        // 1st step: disable
        // 1st step request project-manager data
        // request from all responsible editors to code generate each item
        // based on the domainType -> 
    }

    @ExportedFunction
    public StartRunApplication(appID: String): void {
        this.onStartRunApplicationBtn();
    }

    private onStartDebugApplicationBtn(): void {

    }

    @ExportedFunction
    public StartDebugApplication(appID: String): void {
        this.onStartDebugApplicationBtn();
    }

    private onStopApplicationBtn(): void {
        this._viewElems.RuntimeToolbarView[0].onClickStopApplicationBtn();
        throw new StopProjectAppError('user');
    }

    @ExportedFunction
    public StopApplication(): void {
        this.onStopApplicationBtn();
    }

    // console input
    private onSendInput(callback) {
        let inputView = this._viewElems.RuntimeManagerInputView[0];
        inputView.onClickSendInput();
        let inputValue = inputView.getInputValue();
        
        callback(inputValue);
    }

    public onInputValueRequest(callback) {
        let inputView = this._viewElems.RuntimeManagerInputView[0];
        inputView.onEnableInput(callback);
    }
}
