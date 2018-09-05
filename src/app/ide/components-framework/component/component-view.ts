import { IDEUIComponent } from "./ide-ui-component";
import {
    View,
    IViewElementData,
    IViewEventRegistration,
    IViewUserStyleData,
    IViewElement
} from "./view";
import { IDEError } from "../../shared/ide-error/ide-error";
import { Registry } from "../../shared/entry/registry";
import * as _ from "lodash";
import { ViewRegistry } from "./registry";


export abstract class ComponentViewElement extends View {
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        selector: string,
        protected renderData: any = {},
        protected eventRegData: Array<IViewEventRegistration> = new Array<IViewEventRegistration>(),
        protected styleData: Array<Array<IViewUserStyleData>> = new Array<Array<IViewUserStyleData>>()
    ) {
        super(parent, name, templateHTML, style, selector);
    }

    set selector (newSel: string) { this._selector = newSel; }

    public setRenderData(templateData: Object): void;
    public setRenderData(key: string, data: Object): void;
    public setRenderData (key: any, data?: Object): void {
        switch(typeof(key)) {
            case "string":
                this.renderData[key] = data;
                break;
            case "object":
                this.renderData = key;
                break;
            default:
                IDEError.raise("setRenderData", "First element is not string or object!");
        }
    }

    public setEventRegData (...eventRegs: Array<IViewEventRegistration>) {
        this.eventRegData = eventRegs;
    }

    public registerEvents (): void {
        this.attachEvents(...this.eventRegData);
    }

    public setStyle(): void {
        _.forEach(this.styleData, (style: Array<IViewUserStyleData>) => {
            
        });
    }
}

// export let ComponentViewElementRegistry = new Registry<ComponentViewElement>();

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

    private initViews (views: Array<IComponentViewDataElement>, parent: IDEUIComponent) {
        let viewElems = {};
        if (views) {
            for (let view of views) {
                viewElems[view.name] = ViewRegistry.getEntry(view.name).create(parent, view.selector);
            }
        }
        return viewElems;
    }
    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        selector: string,
        mainViews: Array<IComponentViewDataElement> = new Array<IComponentViewDataElement>(),
        menuViews: { [category: string/*MenuCategory*/]: Array<IComponentViewDataElement> } =
            { "OnRegistration": new Array<IComponentViewDataElement>(), "OnInstantiation": new Array<IComponentViewDataElement>() },
        toolViews: Array<IComponentViewDataElement> = new Array<IComponentViewDataElement>(),
        renderData: Object = {},
        eventRegdata: Array<IViewEventRegistration> = new Array<IViewEventRegistration>()
    ) {
        super(parent, name, templateHTML, style, selector, renderData, eventRegdata);
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

    public initialize() {

    }

    public render(): void {
        this.renderTmplEl(this.renderData);
        _.forEach(this.menuElems, (menuViewElement) => {
            menuViewElement.render();
        });
        _.forEach(this.toolsViewElems, (toolViewElement) => {
            toolViewElement.render();
        });
        // let responcesCounter = 0;
        _.forEach(this.mainViewElems, (mainViewElement: ComponentViewElement) => {
            mainViewElement.render(
            //     () => {
            //         // this.$el.find(mainViewElement.selector).empty();
            //         // this.$el.find(mainViewElement.selector).append(mainViewElement.$el);

            //         if (++responcesCounter === Object.keys(this.mainViewElems).length && callback) {
            //             callback();
            //         }
            //     }
            );
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

        this.$el.find("div" + selector).empty();
        this.$el.find("div" + selector).append(content);
    }
}

export let ComponentViewRegistry = new Registry<ComponentView>();

/**
 * Load View Component Elements
 *
 */

export interface IComponentViewDataElement {
    name: string;
    selector: string;
}

export interface IComponentViewData extends IViewElementData {
    mainElems?: Array<IComponentViewDataElement>;
    menuElems?: Array<IComponentViewDataElement>;
    toolsElems?: Array<IComponentViewDataElement>;
}

export let ComponentViewElementMetadata = // Used as decorator
function DeclareComponentViewElement (data: IViewElementData) {
    return (create: Function) => {
        if (ViewRegistry.hasEntry(name)) {
            IDEError.raise(
                "DeclareCompViewElement",
                "ComponentViewElement " + name + " is already defined!"
            );
        }

        var initData: any = [
            data.templateHTML,
            data.style ? data.style : { user:[], system: "" }
        ];
        if (data.initData) {
            initData.push(data.initData);
        }

        ViewRegistry.createEntry(
            data.name,
            create,
            initData
        );
    };
};

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
                data.templateHTML,
                data.style ? data.style : { user:[], system: "" },
                data.mainElems,
                data.menuElems,
                data.toolsElems,
                initData
            ]
        );
    };
};

