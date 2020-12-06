/**
 * View - Events Registration Handler
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import * as $ from "jquery";
import * as _ from "lodash";
import { IDEUIComponent } from "./ide-ui-component";
import { IDEError, assert } from "../../shared/ide-error/ide-error";
import { ViewRegistry } from "./registry";
import ModalViewTmpl from "./modal-view.tmpl";


export interface IViewEvent {
    type: string;
    selector: string;
}

export interface IViewEventRegistration {
    eventType: string;
    selector: string;
    handler: (eventObject?: JQueryEventObject) => any;
}

export interface IViewUserStyleData {
    selector: string;
    styles: {
         // e.g. color: "#ddd"
        css: {},
        // bootstrap, or css styles class are already loaded
        class: Array<string>
    }
}

export interface IViewRegisterStyleData {
    system ?: string;
    user ?: Array<IViewUserStyleData> | string;
}

export interface IViewEventData {
    type: string;
    selector: string;
    handler: (eventObject?: JQueryEventObject) => any;
    $target: JQuery;
}

export interface IViewElement {
    selector: string;
    view: View;
}

export abstract class View {
    private static numOfViews: number = 0;
    protected _id: string;
    public $el: JQuery;
    private _template: Function;
    private _nextEventID: number;
    private _events: { [key: number]: IViewEventData };

    // Entry object of the View creator, access in shared data 
    // like style css, default data etc.
    private _shared: any;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected _templateHTML: string,
        protected _styles: Array<IViewUserStyleData>,
        protected _selector: string,
        protected _clearSelectorArea: boolean = true
    ) {
        this._events = {};
        this._nextEventID = 0;
        let id: string = $($.parseHTML(this._templateHTML)).attr("id");
        if (typeof id !== typeof undefined) {
            this._id = id;
        }
        else {
            this._id = this.name + (View.numOfViews++);
        }
        this._template = _.template(this._templateHTML);

        if (!this._styles) {
            this._styles = [];
        }
        else {
            let styles = [];
            _.forEach(this._styles, (style) => {
                styles.push($.extend(true, {}, style));
            });
            this._styles = styles;
        }
    }

    get selector (): string { return this._selector; }
    get type (): string { return this["_type"]; }

    get clearSelectorArea (): boolean { return this._clearSelectorArea; }
    set clearSelectorArea (csa: boolean) { this._clearSelectorArea = csa; }

    set template(tmpl: string) {
        this._templateHTML = tmpl;
        this._template = _.template(this._templateHTML);
    }

    public updateView(): void {
        let selector: string = "#" + this._id;
        if ($(selector).length) {
            $(selector).empty();
            $(selector).append(this.$el);
        }
    }

    private append(dst: JQuery, src: JQuery): boolean {
        if (dst.length) {
            dst.append(src);
            return true;
        }
        return false;
    }

    public appendLocal(selector: string, element: JQuery): void {
        let isAppended: boolean = this.append(this.$el.find(selector), element);
        assert(isAppended);
    }

    public appendGlb(selector: string, element: JQuery): void {
        let isAppended: boolean = this.append($(selector), element);
        assert(isAppended);
    }

    public createHook(
        whereSel: string,
        newIDSel: string,
        data ?: { class?: string, style?: string, innerHTML?: string }
    ): void {
        let hook =
            "<div id='" + newIDSel + "'"
            + (data && data.class
                ? " class='" + data.class + "'"
                : "")
            + (data && data.style
                ? " style='" + data.style + "'"
                : "")
            + ">"
            + (data && data.innerHTML
                ? data.innerHTML
                : "")
            + "</div>";
        $(whereSel).append(hook);
    }

    protected renderTmplElHelper(data?: any, registerEvtsByHand?: boolean): void {
        this.$el = $(this._template(data));
        this.$el.attr("id", this._id);
        if (!registerEvtsByHand) {
            this.registerEvents();
        }
        this.applyUserStyles();
    }

    protected attachTmplEl(): void {
        if (this._clearSelectorArea) {
            $(this._selector).empty();
        }
        $(this._selector).append(this.$el);
    }

    public renderTmplEl(data?:any, registerEvtsByHand:boolean=false): void {
        this.renderTmplElHelper(data, registerEvtsByHand);
        this.attachTmplEl();
    }

    public abstract render(callback?: Function): void;
    public abstract registerEvents(): void;

    public userStyle (data: IViewUserStyleData) {
        let index = this._styles.map(x=>x.selector).indexOf(data.selector);
        this._styles[index].styles = data.styles;
    }

    public userStyles (data: Array<IViewUserStyleData>) {
        _.forEach(data, (style) => this.userStyle(style) );
    }

    public get styles (): Array<IViewUserStyleData> {
        return this._styles;
    }

    public set styles (styles: Array<IViewUserStyleData>) {
        this._styles = styles;
    }

    public findEl(selector: string, glb: boolean = false): JQuery {
        return (selector === "this" || selector === "root")
            ? this.$el
            : glb
                ? $(selector)
                : this.$el.find(selector);
    }

    protected applyStyle (data: IViewUserStyleData): void {
        const $el: JQuery = this.findEl(data.selector);
        if (!$el.length) {
            IDEError.raise (
                "View - Apply Style",
                "Selector "
                + data.selector
                + " is not found in View: "
                + this.name
                + "."
            );
        }
        if (data.styles.css) {
            $el.css(data.styles.css);
        }
        if (data.styles.class) {
            _.forEach(data.styles.class, (classElement) => {
                $el.addClass(classElement);
            });
        }
    }

    private applyUserStyles(): void {
        this._styles.forEach((data)=> this.applyStyle(data));
    }

    public updateUserStyle(style: IViewUserStyleData): void {
        let index = this._styles.map(x=>x.selector).indexOf(style.selector);
        this._styles[index].styles = style.styles;
    }

    public updateUserStyles(styles: Array<IViewUserStyleData>): void {
        this._styles = styles;
        this.applyUserStyles();
        this.attachTmplEl();
    }

    public static MergeStyle(
        def: Array<IViewUserStyleData>,
        domainDef: Array<IViewUserStyleData>
    ): Array<IViewUserStyleData> {
        let styles = [];

        _.forEach(def, (style) => {
                styles.push($.extend(true, {}, style));
        });

        if (domainDef) {
            _.forEach(domainDef, (style) => {
                let index = styles.map(x=>x.selector).indexOf(style.selector);
                if (index > 0) {
                    styles[index] = style;
                }
                else {
                    styles.push(style);
                }
            });
        }

        return styles;
    }

    public get id(): string {
        return this._id;
    }

    /**
     * Empty static function used and called by all ViewElements OnInit of the IDE
     *
     */
    public static onInit(): void {}

    public initialize(): void {
        this.$el = $( $.parseHTML(this._templateHTML) );
    }

    public reset(): void {
        this.detachAllEvents();
        this.initialize();
    }

    public destroy(): void {
        this.reset();
        $("#"+this.id).empty();
    }

    get templateHTML(): string {
        return $("<div>").append(this.$el.clone(true, true)).html();
    }

    public element(selector: string): JQuery {
        return this.$el.find(selector);
    }

    public attachEvent(reg: IViewEventRegistration, glb:boolean=false) {
        const $target: JQuery = this.findEl(reg.selector, glb);
        if (!$target.length) {
            IDEError.raise(
                "View - Attach Event",
                "Selector "
                + reg.selector
                + " is not found in View: "
                + this.name
                + "."
            );
        }
        // $target.bind(reg.eventType, reg.handler);

        $target.get(0).addEventListener(reg.eventType, reg.handler);

        ++this._nextEventID;
        this._events[this._nextEventID] = {
            type: reg.eventType,
            selector: reg.selector,
            handler: reg.handler,
            $target: $target
        };

        return this._nextEventID;
    }

    public attachEventsLocal(...eventRegs: Array<IViewEventRegistration>) {
        this.ensureElement();

        return _.map(eventRegs, (reg: IViewEventRegistration) => {
            return this.attachEvent(reg, false);
          });
    }

    public attachEventsGlobal(...eventRegs: Array<IViewEventRegistration>) {
        this.ensureElement();

        return _.map(eventRegs, (reg: IViewEventRegistration) => {
            return this.attachEvent(reg, true);
          });
    }
    public attachEvents(...eventRegs: Array<IViewEventRegistration>) {
        this.ensureElement();

        return _.map(eventRegs, (reg: IViewEventRegistration) => {
            return this.attachEvent(reg);
          });
    }

    public detachEvent(eventId): void {
        const eventInfo: IViewEventData = this._events[eventId];
        
        eventInfo.$target.get(0).removeEventListener(eventInfo.type, eventInfo.handler, false);

        _.unset(this._events, [eventId]);
    }

    public detachAllEvents(): void {
        _.each(this._events, (event, eventId) => this.detachEvent(eventId));
    }

    protected ensureElement(): void {
        if (!this.$el) {
            throw new Error("This view has not context");
        }
    }

    public hide() {
        $("#"+this._id).hide();
    }

    public show() {
        $("#"+this._id).show();
    }
}


export abstract class ModalView extends View {
    private readonly modalSelector = ".modal-platform-container";
    protected _firstRender: boolean;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        styles: Array<IViewUserStyleData>
    ) {
        super(parent, name, _templateHTML, styles, ".bs-modal-content");
        this._firstRender = true;
    }

    protected abstract justRender();

    protected attachTmplEl(): void {
        let $elem = $(this._selector).find(">:first-child");
        if ($elem.length === 0) {
            $elem = $(this._selector);
        } 
        if (this._clearSelectorArea) {
            $elem.empty();
        }
        $elem.append(this.$el);
    }

    protected injectModalTmpl () {
        let index = this._styles.map(x=>x.selector).indexOf(this.selector);
        let data = index > -1
            ? { style: this._styles[index].styles.css }
            : {};
        
        let $modal = _.template(ModalViewTmpl)(data);
        $(this.modalSelector).append($modal);
        this.attachEvent(
            {
                eventType: "hidden.bs.modal",
                selector: ".modal-container",
                handler: () => this.destroy()
            },
            true
        );
        this.attachEvent(
            {
                eventType: "shown.bs.modal",
                selector: ".modal-container",
                handler: () => this.onShownModal()
            },
            true
        );
    }

    public render(callback: Function) {
        this.justRender();
        callback();
    }

    public open(): void {
        this.render(
            () => $(this.modalSelector).children()["modal"]("show")
        );
    }

    public abstract onShownModal();

    protected close(): void {
        $(this.modalSelector).children()["modal"]('hide');
        $(".modal-backdrop").remove();
    }

    public destroy() {
        // change selector to the outer html element of the modal
        this._selector = this.modalSelector;
        super.destroy();
        $(this.modalSelector).empty();
    }
}

/**
 * Load View Component Elements
 *
 */

export interface IViewElementData {
    name: string;
    templateHTML: string;
    style?: IViewRegisterStyleData;
    initData?: Array<any>;
}

export let ViewMetadata = // Used as decorator
function DeclareViewElement (data: IViewElementData) {
    return (create: Function) => {
        if (ViewRegistry.hasEntry(name)) {
            IDEError.raise(
                "DeclareViewElement",
                "View " + name + " is already defined!"
            );
        }

        if (data.style && typeof data.style.user === "string") {
            data.style.user = JSON.parse(data.style.user);
        }

        var initData = (data.initData) ? data.initData : [];

        ViewRegistry.createEntry(
            data.name,
            create,
            [
                data.templateHTML,
                data.style ? data.style : { user:[], system: "" },
                ...initData
            ]
        );
    };
}
