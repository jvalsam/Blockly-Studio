import * as _ from "lodash";
import {
    ModalView,
    IViewUserStyleData,
    IViewEventRegistration
} from "../../../../component/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { PropertyView } from "../../../configuration/configuration-view/property-views/property-view";
import { ViewRegistry } from "../../../../component/registry";


export class ProjectManagerActionModalView extends ModalView {
    private _formElements: { [name: string]: PropertyView };
    private _state: number;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        styles: Array<IViewUserStyleData>,
        protected data
    ) {
        super(parent, name, _templateHTML, styles);
        this._formElements = {};
        this._state = 0;
    }

    public render() {
        this.renderTmplEl(this.data);
        _.forOwn(this.data.dialogueElems[this._state].formElems, (view, key) => {
            this._formElements[key] = <PropertyView> ViewRegistry
                .getEntry(view.name)
                .create(
                    this.parent,
                    ".project-manager-action-form-elements",
                    view.data
                );
            this._formElements[key].clearSelectorArea = false;
            this._formElements[key].render();
        });
    }

    private createEvtHandler (choice) {
        switch (choice) {
            case 'Cancel':
                return () => this.onClose();
            case 'Next':
                return () => {
                    ++this._state;

                };
            case 'Back':
                return () => {
                    --this._state;

                };
            default:
                return () => this.parent["onModalChoiceAction"] (
                                choice,
                                this.getDataFormElements(),
                                ()=>this.onClose()
                            );
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
        let data = {};
        _.forOwn(this._formElements, (view, name) => {
            data[name] = this._formElements[name].value;
        });
        return data;
    }

    private onClose(): void {
        this.close();
        this.destroy();
    }

    public destroy() {
        _.forEach(Object.keys(this._formElements), (key) => {
            this._formElements[key].destroy();
        });
        this._formElements = {};
        super.destroy();
    }
}
