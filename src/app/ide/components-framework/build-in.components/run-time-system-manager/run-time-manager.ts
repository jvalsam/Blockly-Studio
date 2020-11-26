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
    private static readonly modes: Array<string> = ["RELEASE", "DEBUG"];
    private static currentMode: number;
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
        RuntimeManager.currentMode = 0;
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

    private runDataGen(appData): any {
        // request from all responsible editors to code generate each item
        return appData;
    }

    private getDomainRunScript(domain: String, callback): void {
        let domainPath = "../../../domains/" + domain + "/execution/run-app.js";
        var domScript;
        // $.when(
        //     $.getScript(domainPath),
        //     $.Deferred(function (deferred) {
        //         $(deferred.resolve);
        //     })
        // ).done(function () {
        //     //place your code here, the scripts are all loaded
        //     alert("loaded...");
        // });
        // eval('require('+domainPath+');');
        // import("./test.js")
        //     .then(module => callback(module))
        //     .catch(err => {
        //         IDEError.raise(
        //             "NotFoundDomainRunScript",
        //             err.message
        //         );
        //     });
        return domScript;
    }

    private handleRuntimeEnvironmentMessages(event) {
        if (event.data === 'send-runtime-environment-data') {
            let data = {
                mydata: "test",
                name: "testing..."
            };
            event.source.window.postMessage(JSON.stringify(data), '*');
        }
    }


    private _startMsgHookId: String;

    @RequiredFunction("ProjectManager", "getRunApplicationData")
    private onStartRunApplicationBtn(): void {
        let toolbarView = this._viewElems.RuntimeManagerToolbarView[0].elem;
        toolbarView.disableButtons();
        toolbarView.activateStopBtn();

        // this.ClearMessages();
        this.AddDefaultMessage("prepare");

        let appData = ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "getRunApplicationData"
        ).value;

        var file_src = "/runtime-environment-app.html";
        $('<iframe>')
            .attr('src',file_src)
            .attr('height',500)
            .attr('width',500)
            .appendTo('.runtime-environment-area');

        // send data to run the application...

        window.onmessage = (event) => this.handleRuntimeEnvironmentMessages(event);

        let runData = this.runDataGen(appData);

        this.getDomainRunScript(
            appData.domain,
            (domainScript) => {
                let runPromise = domainScript.Run(runData);
                runPromise.then((completeMessage) => {
                    //stop button
                });
                runPromise.catch(function (error) {
                    if (error === "StopApplication") {

                    }
                });

                // this.ClearMessages();
                this.AddDefaultMessage("start");
            }
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
        try {
            this.prepareStartApplication();
            this.StartApplication();
        } catch (error) {
            if (error instanceof StopProjectAppError) {
                this.StopDebugApplication();
            }
            else {
                throw error;
            }
        }
    }

    @ExportedFunction
    public StartDebugApplication(appID: String): void {
        this.onStartDebugApplicationBtn();
    }

    private onStopApplicationBtn(): void {
        this._viewElems.RuntimeManagerToolbarView[0].elem
            .onClickStopApplicationBtn();
        throw new StopProjectAppError('user');
    }

    @ExportedFunction
    public StopApplication(): void {
        this.onStopApplicationBtn();
    }

    @ExportedFunction
    public StopDebugApplication(): void {
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

    // @ExportedStaticFunction
    public static getModes(): Array<string> {
        return RuntimeManager.modes;
    }

    // @ExportedStaticFunction
    public static getMode(): string {
        return RuntimeManager.modes[RuntimeManager.currentMode];
    }
}
