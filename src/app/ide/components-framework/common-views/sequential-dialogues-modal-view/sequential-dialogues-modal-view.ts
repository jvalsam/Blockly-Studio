import * as _ from "lodash";
import { ModalView, IViewUserStyleData, View, IViewEventRegistration, ViewMetadata } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { PropertyView, TypeToNameOfPropertyView } from "../../build-in.components/configuration/configuration-view/property-views/property-view";
import { ViewRegistry } from "../../component/registry";
import SequentialDialoguesModalViewTmpl from "./sequential-dialogues-modal-view.tmpl";
import { assert } from "../../../shared/ide-error/ide-error";
import { upload_files } from "../../../shared/upload-files";
import { InputView } from "../../build-in.components/configuration/configuration-view/property-views/input-view/input-view";


@ViewMetadata({
    name: "SequentialDialoguesModalView",
    templateHTML: SequentialDialoguesModalViewTmpl
})
export class SequentialDialoguesModalView extends ModalView {
    private _currentDialogueIndex: number;
    private _firstProperty: PropertyView;
    private _dialoguesFormData: Array<{ [name: string]: PropertyView }>;
    private _currentActions;
    private _state: number;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        styles: Array<IViewUserStyleData>,
        protected data
    ) {
        super(parent, name, _templateHTML, styles);
        this._dialoguesFormData = [];
        this._firstProperty = null;
        this._state = 0;
        this._currentDialogueIndex = -1;
    }

    private renderSimpleDialogue(data) {
        // before render has to regulate actions of the events will be attached
        this._currentActions = data.actions;
        data.id = this.id;
        //TODO: connected with ducss
        data.defaultTextStyle = "color: black; vertical-align: text-bottom;";

        this.renderTmplEl(data, true);
        let formElems = {};
        let firstProperty: PropertyView = null;
        this._firstProperty = null;
        if (data.body.formElems) {
            let orderNOs = data.body.formElems.map(x=>x.renderNO);
            for (let i=1; i<=data.body.formElems.length; i++) {
                let elem = data.body.formElems[orderNOs.indexOf(i)];
                let key = elem.descriptionID;
                formElems[key] = <PropertyView>ViewRegistry
                    .getEntry(TypeToNameOfPropertyView(elem.type))
                    .create(
                    this.parent,
                    ".project-manager-action-form-elements",
                    elem
                );
                formElems[key].clearSelectorArea = false;
                formElems[key].render();
                if (!firstProperty) {
                    firstProperty = formElems[key];
                    this._firstProperty = firstProperty;
                }
            }
        }

        if (data.body.options && data.body.options.length > 0) {
            $(".project-manager-action-form-elements")
            .append(`<hr size="30"
                         style="width: 107%;
                         border-color: #eeeeee;
                         margin-left: -21px;
                         margin-bottom: 25px;"
                         noshade="">`);

            data.body.options.forEach(option => {
                let key = option.id;
                //option.descriptionID = option.id;
                formElems[key] = <PropertyView>ViewRegistry
                    .getEntry(TypeToNameOfPropertyView(option.type))
                    .create(
                        this.parent,
                        ".project-manager-action-form-elements",
                        JSON.parse(JSON.stringify(option)));
                formElems[key].clearSelectorArea = false;
                formElems[key].render();
            });
        }

        this._dialoguesFormData.push(formElems);

        _.forEach(data.actions, (action) => {
            let sel: string = "ts-btn-action-" + _.toLower(action.choice);
            $(".modal-footer").append(
                "<input type=\"" + action.type + "\" class=\"btn btn-secondary " + sel + "\" " +
                    (action.choice === "Cancel" ? "data-dismiss=\"modal\"" : "") +
                "value=\"" + action.choice + "\"" +
                " />"
            );
            this.attachEvent({
                eventType: action.type === "submit" ? "submit" : "click",
                selector: action.type === "submit" ? "this" : ("." + sel),
                handler: this.createEvtHandler(action)
            }, true);
        });
        this.attachEvent({
            eventType: "click",
            selector: ".ts-btn-close-modal-platform-container",
            handler: () => this.onClose()
        });
    }

    protected justRender() {
        this._currentDialogueIndex = -1;
        let current = this.data[this._state];
        if (this._firstRender) {
            this.injectModalTmpl();
            this._firstRender = false;
        }

        switch(current.type) {
            case "simple":
                this.renderSimpleDialogue(current.data);
                break;
            case "depends_on":
                let index = current.depedency.dialogueNO;
                let descrID = current.depedency.propertyID;
                assert(index < this._dialoguesFormData.length && descrID in this._dialoguesFormData[index]);
                let value = (<PropertyView>this._dialoguesFormData[index][descrID]).value;
                this._currentDialogueIndex = current.dialogues.map(x=>x.dependsValue).indexOf(value);
                assert(index > -1);
                let currentDialogue = current.dialogues[this._currentDialogueIndex];
                this.renderSimpleDialogue(currentDialogue.data);
                break;
        }
    }

    private renderWarningMessages(messages) {
        $("#warning_msgs_"+this.id).empty();
        let msgNO = 1;
        _.forEach(messages, (msg) => {
            let msgHtml = "<div id='warning_msg_"+this.id+"_"+msgNO+"' style='color:red;'>"+msg+"</div>";
            $("#warning_msgs_"+this.id).append(msgHtml);
        });
    }

    //TODO: fix event keeped in projectmanager in order to be used on completion of the modal View, care to close modal before final call of submit data

    private handleValidation(validationFunc, then) {
        if (validationFunc) {
            validationFunc(this._dialoguesFormData[this._state], (response) => {
                if (response !== true) {
                    this.renderWarningMessages(response);
                }
                else {
                    then();
                }
            });
        }
        else {
            then();
        }
    }
    private createEvtHandler (action) {
        if (action.callback) {
            return () => this.handleValidation(action.validation, () => {
                let formElemsData = this.getFormData();
                let jsonForm = this.getDataFormElements();
                this.onClose();
                action.callback(
                    {
                        form: formElemsData,
                        json: jsonForm.data,
                        imgData: jsonForm.imgData 
                    },
                    this._currentDialogueIndex);
            });
        }

        switch (action.choice) {
            case 'No':
            case 'Cancel':
                return () => this.onClose();
            case 'Next':
                return () => this.handleValidation(action.validation, () => {
                        ++this._state;
                        this.justRender();
                        this.fixFocus();
                    });
            case 'Back':
                return () => {
                    this.destroyCurrentDialogue();
                    --this._state;
                    this.justRender();
                    this.fixFocus();
                };
            default:
                return () => {
                    this.handleValidation(action.validation, () => {
                        let formElemsData = this.getDataFormElements();
                        this.parent["onModalChoiceAction"](action.choice, formElemsData, ()=>this.onClose());
                    });
                };
        }
    }

    public registerEvents() {
        let events: Array<IViewEventRegistration> = [];

        _.forEach(this._currentActions, (action) => {
            events.push({
                eventType: "click",
                selector: ".ts-btn-action-"+_.toLower(action.choice),
                handler: this.createEvtHandler(action)
            });
        });

        this.attachEvents(...events);
    }

    private getFormData() {
        let formData = new FormData();
        _.forEach(this._dialoguesFormData, (dialogue) => {
            let elems = {};
            _.forOwn(dialogue, (view, name) => {
                let value = dialogue[name].value;
                if (Array.isArray(value)) {
                    name = (<InputView>dialogue[name]).attribute("name");
                    value.forEach((element) => formData.append(name, element));
                }
                else {
                    formData.append(name, value);
                }
            });
        });
        return formData;
    }

    private getDataFormElements() {
        let data = [];
        let imgData: any = {};
        let index = 0;
        _.forEach(this._dialoguesFormData, (dialogue) => {
            let elems = {};
            _.forOwn(dialogue, (view, name) => {
                elems[name] = dialogue[name].value;
                if (dialogue[name].type === "file" || dialogue[name].type === "image") {
                    imgData[name] = index++;
                }
            });
            data.push(elems);
        });
        return { data: data, imgData: imgData };
    }

    public fixFocus(): void {
        if (this._firstProperty) {
            this._firstProperty.focus();
        }
    }

    public onShownModal() {
        this.fixFocus();
    }

    private onClose(): void {
        this.close();
        this.destroy();
    }

    private destroyCurrentDialogue() {
        let dialogue = this._dialoguesFormData.pop();
        for (var member in dialogue) {
            dialogue[member].destroy();
            delete dialogue[member];
        }
    }
    public destroy() {
        while(this._dialoguesFormData.length > 0) {
            this.destroyCurrentDialogue();
        }
        super.destroy();
    }
}