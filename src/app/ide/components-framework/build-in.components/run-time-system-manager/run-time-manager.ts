import { RuntimeManagerDataHolder } from './run-time-manager-data-holder';
import {
    assert,
    IDEError,
    StopProjectAppError
} from '../../../shared/ide-error/ide-error';
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction,
    ExportedStaticFunction
} from "../../component/component-loader";
import { IDEUIComponent } from '../../component/ide-ui-component';
import { IConsoleOutputMsg } from './run-time-manager-view/run-time-manager-output-view/run-time-manager-output-view';
import { ComponentsCommunication } from '../../component/components-communication';
import { RuntimeSystem } from "./runtime-system";
import { RuntimeManagerView } from './run-time-manager-view/run-time-manager-view';

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
    isUnique: true,
    componentView: "RuntimeManagerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class RuntimeManager extends IDEUIComponent {
    private static readonly modes: Array<string> = [
        "RELEASE",
        "DEBUG"
    ];
    private static currentMode: number;
    private isOpen: Boolean;
    private runtimeSystemInst: RuntimeSystem;
    private _environmentData: any;

    constructor(
        name: string,
        description: string,
        componentView: string,
        hookSelector: string,
        private domainType: string
    ) {
        super(name, description, componentView, hookSelector);
        this.isOpen = false;
        RuntimeManager.currentMode = 0;
        this.runtimeSystemInst = null;
        this._environmentData = null;
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

    @ExportedFunction
    public onOpenConsole(): void {
        this._view["onOpen"]();
    }

    private msgTime(): string {
        let date = new Date();
        let hours = date.getHours();
        let mins = date.getMinutes();
        return ((hours < 10) ? "0" + hours : "" + hours) + ":" +
            ((mins < 10) ? "0" + mins : "" + mins);
    }

    private msgsData = {
        init: {
            id: "",
            num: 0,
            msgs: [
                {
                    text: "Your application starts when you click run or debug " +
                            "button in the toolbar.",
                    color: "#d4fdd3",
                    hoverColor: "#FCFCD2"
                },
                {
                    text: "You clicked me :) Message bubbles are interactive with " +
                    " the Platform. You can browse in the Visual Programming Editors" +
                    " and the Visual Programming Elements write message to me ;)",
                    color: "#F7CFC1",
                    hoverColor: "#f7eac1"
                }
            ]
        },
        prepare: {
            id: "",
            num: 0,
            msgs: [
                {
                    text: "Your application is preparing to run...",
                    color: "#ffe6ff",
                    hoverColor: "#ffe6ff"
                },
                {
                    text: "You clicked me :) Message bubbles are interactive with " +
                        " the Platform. You can browse in the Visual Programming Editors" +
                        " and the Visual Programming Elements write message to me ;)",
                    color: "#f7eac1",
                    hoverColor: "#f7eac1"
                }
            ]
        },
        start: {
            id: "",
            num: 0,
            msgs: [
                {
                    text: "Your application runs... Stops in the end or in case you click stop button.",
                    color: "#ccffff",
                    hoverColor: "#e6ffff"
                },
                {
                    text: "You clicked me :) Message bubbles are interactive with " +
                        " the Platform. You can browse in the Visual Programming Editors" +
                        " and the Visual Programming Elements write message to me ;)",
                    color: "#f7eac1",
                    hoverColor: "#f7eac1"
                }
            ]
        },
        stop: {

        }
    };

    private defaultMsg(msgKey): IConsoleOutputMsg {
        let data = this.msgsData[msgKey];
        return {
            typeMsg: "app",
            time: this.msgTime(),
            msg: data.msgs[data.num],
            sender: "Console",

            onClickMsg: () => {
                data.num = data.num === 1 ? 0 : 1;
                data.msgs[data.num].time = this.msgTime();

                this.EditMessage(
                    data.id,
                    data.msgs[data.num]
                );
            },
            onClickIcon: () => {
                alert("Message Icons are interactive with the respective " +
                    "objects. When, the users click message, opens the " +
                    "respective info.");
            }
        };
    }

    @ExportedFunction
    public AddMessage(msg: IConsoleOutputMsg): string {
        return this._viewElems.RuntimeManagerOutputView[0]
            .elem
            .addMsg(msg);
    }

    @ExportedFunction
    public AddDefaultMessage(key: string): void {
        this.msgsData[key].id = this.AddMessage(this.defaultMsg(key));
    }

    @ExportedFunction
    public EditMessage(hookId: String, msg: any): void {
        this._viewElems.RuntimeManagerOutputView[0]
            .elem
            .editMsg(hookId, msg);
    }

    @ExportedFunction
    public RemoveMessage(hookId: String): void {
        this._viewElems.RuntimeManagerOutputView[0]
            .elem
            .removeMsg(hookId);
    }

    @ExportedFunction
    public ClearMessages(): void {
        this._viewElems.RuntimeManagerOutputView[0]
            .elem
            .clearMsgs();
    }

    @ExportedFunction
    public InitConsoleMsg(msgData: IConsoleOutputMsg = this.defaultMsg("init")): void {
        this.AddDefaultMessage("init");
    }

    private getDomainRunScript(domain: String, callback): void {
        let domainPath = "../../../domains/" + domain + "/execution/run-app.js";
        var domScript;
        
        return domScript;
    }

    private listenRuntimeEnvironmentMessages(event) {
        event.data
        if (event.data === 'send-runtime-environment-data') {
            let data = {
                mydata: "test",
                name: "testing..."
            };
            event.source.window.postMessage(JSON.stringify(data), '*');
        }
    }

    private setEnvironmentRunData(): void {
        let appData = ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "getRunApplicationData"
        ).value;

        this._environmentData = {
            execType: RuntimeManager.getMode(),
            domainType: appData.domain,
            execData: appData
        };
    }

    @ExportedFunction
    public getEnvironmentRunData() {
        return this._environmentData;
    }

    private _startMsgHookId: String;

    @RequiredFunction("ProjectManager", "getRunApplicationData")
    private onStartRunApplicationBtn(): void {
        RuntimeManager.currentMode = 0;

        let toolbarView = this._viewElems.RuntimeManagerToolbarView[0].elem;
        toolbarView.disableButtons();
        toolbarView.activateStopBtn();

        // this.ClearMessages();
        this.AddDefaultMessage("prepare");

<<<<<<< HEAD
<<<<<<< HEAD
        this.setEnvironmentRunData();

        RuntimeSystem.initialize(
            "BlocklyStudioIDE_MainRuntimeEnvironment",
            this._environmentData.domainType);
=======
=======
>>>>>>> 0d459f042060ca393061f33945f77ccc04a2bfb9
        (<RuntimeManagerView>this._view).openRuntimeEnvironmentDialogue();
        RuntimeSystem.initialize("BlocklyStudioIDE_MainRuntimeEnvironment");
>>>>>>> 0d459f042060ca393061f33945f77ccc04a2bfb9
        let cw = RuntimeSystem
            .getIframe("BlocklyStudioIDE_MainRuntimeEnvironment")
            ['contentWindow'];
        this.runtimeSystemInst = new RuntimeSystem(
            this,
            "RuntimeEnvironmentApp",
            cw.postMessage,
            (func) => window.onmessage = func
        );
    }

    @ExportedFunction
    public checkRuntimeState() {

    }

    @ExportedFunction
    public StartRunApplication(appID: String): void {
        this.onStartRunApplicationBtn();
    }

    private prepareStartApplication() {
        this._viewElems.RuntimeManagerToolbarView[0].elem
            .onClickDebugApplicationBtn();
        this.RemoveMessage(this.msgsData.init.id);
        this.AddDefaultMessage("prepare");
    }

    private async StartApplication() {
        this.RemoveMessage(this.msgsData.prepare.id);
        this.AddDefaultMessage("start");
    }

    private onStartDebugApplicationBtn(): void {
        RuntimeManager.currentMode = 1;

        let toolbarView = this._viewElems.RuntimeManagerToolbarView[0].elem;
        toolbarView.disableButtons();
        toolbarView.activateStopBtn();

        this.ClearMessages();
        this.AddDefaultMessage("prepare");

        RuntimeSystem.initialize("BlocklyStudioIDE_MainRuntimeEnvironment");
        let cw = RuntimeSystem
            .getIframe("BlocklyStudioIDE_MainRuntimeEnvironment")
            ['contentWindow'];
        this.runtimeSystemInst = new RuntimeSystem(
            this,
            "RuntimeEnvironmentApp",
            cw.postMessage,
            (func) => window.onmessage = func
        );
    }

    @ExportedFunction
    public StartDebugApplication(appID: String): void {
        this.onStartDebugApplicationBtn();
    }

    private onStopApplicationBtn(): void {
        this.runtimeSystemInst.functionRequest(
            this.name,
            "RuntimeEnvironmentApp",
            "stopApplication",
            [],
            {
                type: 'async',
                func: () => this.StopApplication()
            });
    }

    @ExportedFunction
    public StopApplication(): void {
        RuntimeSystem.close();
        //
        let toolbarView = this._viewElems.RuntimeManagerToolbarView[0].elem;
        toolbarView.disableButtons();
        toolbarView.activateRunDebugBtns();
    }

    @ExportedFunction
    public StopDebugApplication(): void {
        
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

    // @ExportedStaticFunction
    public static getModes(): Array<string> {
        return RuntimeManager.modes;
    }

    // @ExportedStaticFunction
    public static getMode(): string {
        return RuntimeManager.modes[RuntimeManager.currentMode];
    }

    @ExportedFunction
    public functionRequest(
        srcComp: string,
        destComp: string,
        funcName: string,
        args: Array<any>,
        callback: Function =null) {
            this.runtimeSystemInst.functionRequest(
                srcComp,
                destComp,
                funcName,
                args,
                callback);
    }

    private dispatchFunctionRequest(
        srcComp: string,
        destComp: string,
        funcName: string,
        data: Array<any>,
        callback: Function =null) {
            try {
                if (callback) {
                    ComponentsCommunication.functionRequest(
                        this.name,
                        destComp,
                        funcName,
                        [
                            ...data,
                            callback
                        ]
                    );
                }
                else {
                    return ComponentsCommunication.functionRequest(
                        this.name,
                        destComp,
                        funcName,
                        [...data]
                    ).value;
                }
            }
            catch(e) {
                throw new Error(
                    "Error in Runtime Environment: "
                    + srcComp
                    + "requested "
                    + funcName
                    + ".\n"
                    + e.message);
            }
    }
}
