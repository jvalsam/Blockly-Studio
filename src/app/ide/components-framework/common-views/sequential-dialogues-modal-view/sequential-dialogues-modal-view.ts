import * as _ from "lodash";
import { ModalView, IViewUserStyleData, View, IViewEventRegistration, ViewMetadata } from "../../component/view";
import { IDEUIComponent } from "../../component/ide-ui-component";
import { PropertyView } from "../../build-in.components/configuration/configuration-view/property-views/property-view";
import { ViewRegistry } from "../../component/registry";
import SequentialDialoguesModalViewTmpl from "./sequential-dialogues-modal-view.tmpl";
import { assert } from '../../../shared/ide-error/ide-error';

@ViewMetadata({
    name: "SequentialDialoguesModalView",
    templateHTML: SequentialDialoguesModalViewTmpl//,
    // style: {
    //     system: ActionsViewSYCSS
    // }
})
export class SequentialDialoguesModalView extends ModalView {
    private _dialoguesFormData: Array<{ [name: string]: PropertyView }>;
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
        this._state = 0;
    }

    protected justRender() {
        this.renderTmplEl(this.data[this._state]);
        if (this._dialoguesFormData[this._state]) {
            _.forEach(this._dialoguesFormData[this._state], (view) => view.render());
        }
        else {
            let formElems = {};
            _.forOwn(this.data[this._state].formElems, (view, key) => {
                formElems[key] = <PropertyView>ViewRegistry.getEntry(view.name).create(this.parent, ".project-manager-action-form-elements", view.data);
                formElems[key].clearSelectorArea = false;
                formElems[key].render();
            });
            this._dialoguesFormData.push(formElems);
        }
    }

    private createEvtHandler (choice) {
        switch (choice) {
            case 'Cancel':
                return () => this.onClose();
            case 'Next':
                return () => {
                    ++this._state;
                    this.justRender();
                };
            case 'Back':
                return () => {
                    --this._state;
                    this.justRender();
                };
            default:
                return () => this.parent["onModalChoiceAction"] (choice, this.getDataFormElements(), ()=>this.onClose());
        }
    }
    public registerEvents() {
        let events: Array<IViewEventRegistration> = [];
        _.forEach(this.data.choices, (choice) => {
            events.push({
                eventType: "click",
                selector: ".ts-btn-action-"+_.toLower(choice),
                handler: this.createEvtHandler(choice)
            });
        });
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

    public destroy() {
        while(this._dialoguesFormData.length > 0) {
            let dialogue = this._dialoguesFormData.pop();
            for (var member in dialogue) {
                dialogue[member].destroy();
                delete dialogue[member];
            }
        }
        super.destroy();
    }
}