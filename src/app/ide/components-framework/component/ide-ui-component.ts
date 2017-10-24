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
import { IViewElement } from "../view/view";
import { ComponentView } from "./component-view";
import {
    DeclareIDEUIComponent as UCI,
} from "./components-communication";

export let UIComponentMetadata: Function = UCI;

export interface IViewDataComponent {
    main?: JQuery;
    menubar?: JQuery;
    tools?: JQuery;
}

@ComponentMetadata({
    description: "All components which are visible in the IDE",
    version: "1.0"
})
export abstract class IDEUIComponent extends IDEComponent {
    protected _view: ComponentView;

    constructor(
        name: string,
        description: string,
        selector: string,
        templateHTML: string
    ) {
        super(name, description);
        this._view = new ComponentView(
            this,
            "_uiidecomponent_" + this.name,
            selector,
            templateHTML
        );
    }

    get templateHTML(): string {
        return this.view.templateHTML;
    }

    get templateJQ(): JQuery {
        return this.view.templateJQ;
    }

    get selector(): string {
        return this.view.selector;
    }

    get view(): ComponentView {
        return this._view;
    }

    public render(): void {
        this.view.render();
    }

    protected inject(selector: string, templateHTML: JQuery): void;
    protected inject(component: IDEUIComponent): void;
    protected inject(viewElem: IViewElement): void;

    protected inject(selector: any, content?: JQuery): void {
        if (typeof selector !== "string") {
            const elem: IDEUIComponent | IViewElement = selector;
            elem.view.render();
            content = elem.view.$el;
            selector = elem.selector;
        }
        
        this.view.templateJQ.find("div"+selector).empty();
        this.view.templateJQ.find("div"+selector).append(content);
    }

    public reset(): void {
        this.view.reset();
    }

    public abstract registerEvents(): void;
    public abstract update(): void;
    public abstract onOpen(): void;
    public abstract getView(): IViewDataComponent;
    public abstract onClose(): void;
}