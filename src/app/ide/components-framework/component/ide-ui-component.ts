import * as _ from "lodash";
import { IDEComponent } from "./ide-component";
import { ComponentMetadata, ExportedFunction, RequiredFunction } from "./component-loader";
import { IViewElement } from "./view";
import {
    ComponentView,
    ComponentViewRegistry
} from "./component-view";
import { ComponentsCommunication } from "./components-communication";

export interface IViewDataComponent {
    main?: JQuery;
    menubar?: JQuery;
    tools?: JQuery;
}

@ComponentMetadata({
    description: "All components which are visible in the IDE",
    authors: [
        { date: "August 2017", name: "Yannis Valsamakis", email: "jvalsam@ics.forth.gr" }
    ],
    version: "1.0"
})
export abstract class IDEUIComponent extends IDEComponent {
    protected _componentsData: { [projectId: string]: any };
    protected _viewElems;
    protected _view: ComponentView;

    constructor(
        name: string,
        description: string,
        compViewName: string,
        hookSelector: string
    ) {
        super(name, description);
        this._componentsData = {};
        this._viewElems = {};
        this._view = ComponentViewRegistry
            .getEntry(compViewName)
            .create(
                this,
                hookSelector);
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

    @RequiredFunction("Shell", "newToolbarArea")
    @ExportedFunction
    public render(): void {
            this.view.render();
    }
    
    @RequiredFunction("ProjectManager", "saveComponentData")
    protected saveProjectComponentData(projectId: string, data: any) {
        this._componentsData[projectId] = data;

        ComponentsCommunication.functionRequest(
            this.name,
            "ProjectManager",
            "saveComponentData",
            [
                this.name,
                projectId,
                this._componentsData[projectId]
            ]
        );
    }

    @RequiredFunction("ProjectManager", "getComponentData")
    protected getProjectComponentData(projectId: string) {
        if (this._componentsData[projectId]) {
            return this._componentsData[projectId];
        }
        else {
            let data = ComponentsCommunication.functionRequest(
                this.name,
                "ProjectManager",
                "getComponentData",
                [
                    this.name,
                    projectId
                ]
            ).value;
            return data || {};
        }
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