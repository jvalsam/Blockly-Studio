import * as _ from "lodash";
import { IDEComponent } from "./ide-component";
import { ComponentMetadata, ExportedFunction } from "./component-loader";
import { IViewElement } from "./view";
import {
    ComponentView,
    ComponentViewRegistry
} from "./component-view";

export interface IViewDataComponent {
    main?: JQuery;
    menubar?: JQuery;
    tools?: JQuery;
}

@ComponentMetadata({
    description: "All components which are visible in the IDE",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "August 2017"
        }
    ],
    version: "1.0"
})
export abstract class IDEUIComponent extends IDEComponent {
    protected _view: ComponentView;

    constructor(
        name: string,
        description: string,
        compViewName: string
    ) {
        super(name, description);
        this._view = ComponentViewRegistry.getEntry(compViewName).create(this);
    }

    get templateHTML(): string {
        return this.view.templateHTML;
    }

    public get selector(): string {
        return this.view.selector;
    }

    public get view(): ComponentView {
        return this._view;
    }

    @ExportedFunction
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

        this.view.$el.find("div"+selector).empty();
        this.view.$el.find("div"+selector).append(content);
    }

    public reset(): void {
        this.view.reset();
    }

    public abstract registerEvents(): void;
    public abstract update(): void;
    public abstract onOpen(): void;
    public abstract onClose(): void;
}