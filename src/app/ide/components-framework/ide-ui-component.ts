/**
 * IDEUIComponent - standar functionality of visible ide components
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import {
    ComponentMetadata,
    ExportedFunction,
    IDEComponent
} from "./ide-component";
import {
    DeclareIDEUIComponent as UCI,
} from "./components-communication";

export interface IViewDataComponent {
    main?: string;
    menubar?: string;
    tools?: string;
}

export let UIComponentMetadata: Function = UCI;

@ComponentMetadata({
    name: "ui-ide-component",
    description: "All components which are visible in the IDE",
    version: "1.0"
})
export abstract class IDEUIComponent extends IDEComponent {
    private _initialTemplateJQ: JQuery;
    protected _templateJQ: JQuery;
    constructor(
        _name: string,
        _description: string,
        protected _selector: string,
        protected _templateHTML: string
    ) {
        super(_name, _description);
        this._templateJQ = $( $.parseHTML(this._templateHTML) );
        this._initialTemplateJQ = this._templateJQ.clone();
    }

    get templateHTML(): string {
        return this._templateJQ.html();
        // return $("<div />").append($(this._selector).clone()).html();
    }
    get selector(): string {
        return this._selector;
    }

    @ExportedFunction
    public inject(selector: string, templateHTML: string): void {
        this._templateJQ.find(selector).html(templateHTML);
    }

    @ExportedFunction
    public inject_c(component: IDEUIComponent): void {
        this.inject(component._selector, component.templateHTML);
    }

    public Reset(): void {
        this._templateJQ = $( this._initialTemplateJQ.html() );
    }
    public abstract Update(): void;
    public abstract OnOpen(): void;
    public abstract GetView(): IViewDataComponent;
    public abstract OnClose(): void;
}