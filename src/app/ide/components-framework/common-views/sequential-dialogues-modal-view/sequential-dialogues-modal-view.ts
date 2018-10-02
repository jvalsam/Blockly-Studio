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
    private _dialoguesFormData: Array<{ [name: string]: PropertyView }>;
    private _state: number;
    private _firstProperty: PropertyView;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        styles: Array<IViewUserStyleData>,
        protected data
    ) {
        super(parent, name, _templateHTML, styles);
        this._dialoguesFormData = [];
        this._state = 0;
    }

    private renderSimpleDialogue(data) {
        this.renderTmplEl(data);
        let formElems = {};
        let firstProperty: PropertyView = null;
        _.forOwn(data.formElems, (elem, key) => {
            formElems[key] = <PropertyView>ViewRegistry.getEntry(TypeToNameOfPropertyView(elem.type)).create(this.parent, ".project-manager-action-form-elements", elem);
            if (elem.propertyID) {
                formElems[key]["dialoguePropID"] = elem.propertyID;
            }
            formElems[key].clearSelectorArea = false;
            formElems[key].render();
            if (!firstProperty) {
                this._firstProperty = formElems[key];
            }
        });
        this._dialoguesFormData.push(formElems);
        // needs time to set autofocus
        setTimeout(()=>this._firstProperty.focus(), 500);
    }

    protected justRender() {
        let current = this.data[this._state];

        switch(current.type) {
            case "simple":
                this.renderSimpleDialogue(current.data);
                break;
            case "depends_on":
                let depFormsData = Object["values"](this._dialoguesFormData[current.depedency.dialogueNO]);
                let index = depFormsData.map(x=>x.dialoguePropID).indexOf(current.depedency.propertyID);
                assert(index > -1);
                let value = (<PropertyView>depFormsData[index]).value;
                index = current.dialogues.map(x=>x.dependsValue).indexOf(value);
                assert(index > -1);
                this.renderSimpleDialogue(current.dialogues[index]);
                break;
        }
    }

    private createEvtHandler (action) {
        if (action.callback) {
            return () => action.callback(this.getDataFormElements());
        }

        switch (action.choice) {
            case 'Cancel':
                return () => this.onClose();
            case 'Next':
                return () => {
                    ++this._state;
                    this.justRender();
                };
            case 'Back':
                return () => {
                    this.destroyCurrentDialogue();
                    --this._state;
                    this.justRender();
                };
            default:
                return () => this.parent["onModalChoiceAction"] (action.choice, this.getDataFormElements(), ()=>this.onClose());
        }
    }

    public registerEvents() {
        let events: Array<IViewEventRegistration> = [];
        _.forEach(this.data.actions, (action) => {
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