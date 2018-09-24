import * as _ from "lodash";
import { ModalView, IViewUserStyleData, View, IViewEventRegistration } from "../../../../component/view";
import { IDEUIComponent } from "../../../../component/ide-ui-component";
import { PropertyView } from "../../../configuration/configuration-view/property-views/property-view";
import { ViewRegistry } from "../../../../component/registry";
import { assert } from './../../../../../shared/ide-error/ide-error';


export class ProjectManagerActionModalView extends ModalView {
    private _formElements: { [name: string]: PropertyView };

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        styles: Array<IViewUserStyleData>,
        protected data
    ) {
        super(parent, name, _templateHTML, styles);
        this._formElements = {};
    }

    public render() {
        this.renderTmplEl(this.data);
        _.forOwn(this.data.formElems, (view, key) => {
            this._formElements[key] = <PropertyView>ViewRegistry.getEntry(view.name).create(this.parent, ".project-manager-action-form-elements", view.data);
            this._formElements[key].clearSelectorArea = false;
            this._formElements[key].render();
        });
    }

    public registerEvents() {
        let events: Array<IViewEventRegistration> = [];
        events.push({
            eventType: "click",
            selector: ".ts-btn-action-cancel",
            handler: () => this.onClose()
        });
        _.forEach(this.data.choices, (choice) => {
            events.push({
                eventType: "click",
                selector: ".ts-btn-action-"+choice,
                handler: () => this.parent["onModalChoiceAction"] (choice, this.getDataFormElements(), ()=>this.onClose())
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