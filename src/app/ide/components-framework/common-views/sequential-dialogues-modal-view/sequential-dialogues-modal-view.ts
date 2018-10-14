import * as _ from "lodash";
import { ModalView, IViewUserStyleData, View, IViewEventRegistration, ViewMetadata } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { PropertyView, TypeToNameOfPropertyView } from "../../build-in.components/configuration/configuration-view/property-views/property-view";
import { ViewRegistry } from "../../component/registry";
import SequentialDialoguesModalViewTmpl from "./sequential-dialogues-modal-view.tmpl";
import { assert } from "../../../shared/ide-error/ide-error";


@ViewMetadata({
    name: "SequentialDialoguesModalView",
    templateHTML: SequentialDialoguesModalViewTmpl
})
export class SequentialDialoguesModalView extends ModalView {
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
    }

    private renderSimpleDialogue(data) {
        // before render has to regulate actions of the events will be attached
        this._currentActions = data.actions;
        data.id = this.id;

        this.renderTmplEl(data);
        let formElems = {};
        let firstProperty: PropertyView = null;
        this._firstProperty = null;
        _.forOwn(data.formElems, (elem) => {
            let key = elem.descriptionID;
            formElems[key] = <PropertyView>ViewRegistry.getEntry(TypeToNameOfPropertyView(elem.type)).create(
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
        });
        this._dialoguesFormData.push(formElems);
    }

    protected justRender() {
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
                index = current.dialogues.map(x=>x.dependsValue).indexOf(value);
                assert(index > -1);
                let currentDialogue = current.dialogues[index];
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
            return () => this.handleValidation(action.validation, () => action.callback(this.getDataFormElements()));
        }

        switch (action.choice) {
            case 'Cancel':
                return () => this.onClose();
            case 'Next':
                return () => {
                    this.handleValidation(action.validation, () => {
                        ++this._state;
                        this.justRender();
                        this.fixFocus();
                    });
                };
            case 'Back':
                return () => {
                    this.destroyCurrentDialogue();
                    --this._state;
                    this.justRender();
                    this.fixFocus();
                };
            default:
                return () => {
                    this.handleValidation(action.validation, () =>
                        this.parent["onModalChoiceAction"] (action.choice, this.getDataFormElements(), ()=>this.onClose())
                    );
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

    private getDataFormElements() {
        let data = [];
        _.forEach(this._dialoguesFormData, (dialogue) => {
            let elems = {};
            _.forOwn(dialogue, (view, name) => {
                elems[name] = dialogue[name].value;
            });
            data.push(elems);
        });
        return data;
    }

    public fixFocus() {
        this._firstProperty.focus();
    }

    public onShownModal() {
        this.fixFocus();
    }

    private onClose(): void { this.close(); }

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