/**
 * ComponentView - IDEUIComponent has instance of ComponentView which is responsible for the look and feel of the component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "./ide-ui-component";
import {
    View,
    IViewElementData,
    IViewEventRegistration,
    IViewElement
} from "../view/view";
import { IDEError } from "../../shared/ide-error";
import { Registry } from "../../shared/entry/registry";
import * as _ from "lodash";


export abstract class ComponentViewElement extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        private _selector: string,
        templateHTML: string,
        protected renderData: Object = {},
        protected eventRegData: Array<IViewEventRegistration> = new Array<IViewEventRegistration>()
    ) {
        super(parent, name, templateHTML);
    }

    get selector (): string { return this._selector; }
    set selector (newSel: string) { this._selector = newSel; }


    public setRenderData (templateData: Object): void {
        this.renderData = templateData;
    }

    public setEventRegData (...eventRegs: Array<IViewEventRegistration>) {
        this.eventRegData = eventRegs;
    }

    public registerEvents (): void {
        this.attachEvents(...this.eventRegData);
    }
}

export let ComponentViewElementRegistry = new Registry<ComponentViewElement>();

type MenuCategory = "OnRegistration" | "OnInstantiation";
export interface IViewElements {
    [name: string]: ComponentViewElement;
}
interface IMenuViewElements {
    OnRegistration: IViewElements;
    OnInstantiation: IViewElements;
}

export class ComponentView extends ComponentViewElement {
    private mainViewElems: IViewElements;
    // TODO: add functionality for two categories of menu view elements (OnRegistration, OnInstantiation)
    private menuViewElems: IMenuViewElements;
    private toolsViewElems: IViewElements;

    private initViews (views: Array<string>, parent: IDEUIComponent) {
        let viewElems = {};
        for (let view of views) {
            viewElems[view] = ComponentViewElementRegistry.getEntry(view).create(parent);
        }
        return viewElems;
    }
    constructor(
        parent: IDEUIComponent,
        name: string,
        selector: string,
        templateHTML: string,
        mainViews: Array<string> = new Array<string>(),
        menuViews: { [category: string/*MenuCategory*/]: Array<string> } =
            { "OnRegistration": new Array<string>(), "OnInstantiation": new Array<string>() },
        toolViews: Array<string> = new Array<string>(),
        renderData: Object = {},
        eventRegdata: Array<IViewEventRegistration> = new Array<IViewEventRegistration>()
    ) {
        super(parent, name, selector, templateHTML, renderData, eventRegdata);
        this.mainViewElems = this.initViews(mainViews, parent);
        this.menuViewElems = { OnRegistration: {}, OnInstantiation: {} };
        this.menuViewElems.OnRegistration = this.initViews(menuViews["OnRegistration"], parent);
        this.menuViewElems.OnInstantiation = this.initViews(menuViews["OnInstantiation"], parent);
        this.toolsViewElems = this.initViews(toolViews, parent);
    }

    public get main(): JQuery {
        return this.$el;
    }
    public get menuElems (): IViewElements {
        return this.menuViewElems["OnInstantiation"];
    }
    public get toolElems (): IViewElements {
        return this.toolsViewElems;
    }

    public render(): void {
        this.$el = $(this.template(this.renderData));
        this.registerEvents();
        _.forEach(this.mainViewElems, (mainViewElement: ComponentViewElement) => {
            mainViewElement.render();
            this.$el.find(mainViewElement.selector).empty();
            this.$el.find(mainViewElement.selector).append(mainViewElement.$el);
        });
        _.forEach(this.menuElems, (menuViewElement) => {
            menuViewElement.render();
        });
        _.forEach(this.toolsViewElems, (toolViewElement) => {
            toolViewElement.render();
        });
    }

    protected inject (selector: string, templateHTML: JQuery): void;
    protected inject (component: IDEUIComponent): void;
    protected inject (view: IViewElement): void;
    protected inject (viewElem: ComponentViewElement): void;

    protected inject (selector: any, content?: JQuery): void {
        if (typeof selector !== "string") {
            if (selector.view) {
                const elem: IDEUIComponent | IViewElement = selector;
                elem.view.render();
                content = elem.view.$el;
            }
            else {
                const elem: ComponentViewElement = selector;
                elem.render();
                content = elem.$el;
            }
            selector = selector.selector;
        }

        this.templateJQ.find("div" + selector).empty();
        this.templateJQ.find("div" + selector).append(content);
    }
}

export let ComponentViewRegistry = new Registry<ComponentView>();

/**
 * Load View Component Elements
 *
 */

export interface IComponentViewElementData extends IViewElementData {
    // set selector as default value, on create 
    // new ComponentViewElement user can set other selector
    selector?: string;
}

export interface IComponentViewData extends IComponentViewElementData {
    mainElems?: Array<string>;
    menuElems?: Array<string>;
    toolsElems?: Array<string>;
}

export let ComponentViewElementMetadata = // Used as decorator
function DeclareComponentViewElement (data: IComponentViewElementData) {
    return (create: Function) => {
        if (ComponentViewElementRegistry.hasEntry(name)) {
            IDEError.raise(
                "DeclareCompViewElement",
                "ComponentViewElement " + name + " is already defined!"
            );
        }

        var initData = (data.initData) ? data.initData : [];

        ComponentViewElementRegistry.createEntry(
            data.name,
            create,
            [data.selector, data.templateHTML, initData]
        );
    };
}

export let ComponentViewMetadata = // Used as decorator
function DeclareComponentView (data: IComponentViewData) {
    return (create: Function) => {
        if (ComponentViewRegistry.hasEntry(name)) {
            IDEError.raise(
                "DeclareComponentView",
                "ComponentView " + name + " is already defined!"
            );
        }

        var initData = (data.initData) ? data.initData : [];

        ComponentViewRegistry.createEntry(
            data.name,
            create,
            [
                data.selector,
                data.templateHTML,
                data.mainElems,
                data.menuElems,
                data.toolsElems,
                initData
            ]
        );
    };
}

