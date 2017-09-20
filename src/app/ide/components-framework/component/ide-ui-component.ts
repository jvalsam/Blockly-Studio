/**
 * IDEUIComponent - standar functionality of visible ide components
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import * as _ from "lodash";
import {
    ComponentMetadata,
    ExportedFunction,
    IDEComponent
} from "./ide-component";
import { View } from "../view/view";
import { ComponentView } from "./component-view";
import {
    DeclareIDEUIComponent as UCI,
} from "./components-communication";

export let UIComponentMetadata: Function = UCI;

export interface IViewDataComponent {
    main?: string;
    menubar?: string;
    tools?: string;
}

@ComponentMetadata({
    name: "ui-ide-component",
    description: "All components which are visible in the IDE",
    version: "1.0"
})
export abstract class IDEUIComponent extends IDEComponent {
    protected _view: View;

    constructor(
        name: string,
        description: string,
        protected _selector: string,
        templateHTML: string
    ) {
        super(name, description);
        this._view = new ComponentView(
            '_uiidecomponent_' + this.name,
            _selector,
            templateHTML
        );
    }

    get templateHTML(): string {
        return this._view.templateHTML;
    }

    get templateJQ(): JQuery {
        return this._view.templateJQ;
    }

    get selector(): string {
        return this._selector;
    }

    public inject(selector: string, templateHTML: string): void;
    public inject(component: IDEUIComponent): void;
    public inject(viewElement: View): void;

    @ExportedFunction
    public inject(selector: any, templateHTML?: string): void {
        if (templateHTML && typeof selector == "string") {
            this._view.templateJQ.find("div"+selector).html(templateHTML);
        }
        else {
            const element: View|IDEUIComponent = (selector instanceof View) ? <View>selector : <IDEUIComponent>selector;
            this.inject(element.selector, element.templateHTML);
        }
    }

    public reset(): void {
        this._view.reset();
    }
    
    public abstract registerEvents(): void;
    public abstract update(): void;
    public abstract onOpen(): void;
    public abstract getView(): IViewDataComponent;
    public abstract onClose(): void;
}