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
        css: {}, // e.g. color: "#ddd"
        class: Array<string> // bootstrap, or css styles class are already loaded
    }
}

export interface IViewStyleData {
    system ?: string;
    user ?: Array<IViewUserStyleData>;
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

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        protected _style: IViewStyleData,
        protected _selector: string,
        private _clearSelectorArea: boolean = true
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
    }

    get selector (): string { return this._selector; }

    get clearSelectorArea (): boolean { return this._clearSelectorArea; }
    set clearSelectorArea (csa: boolean) { this._clearSelectorArea = csa; }

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
        let hook = "<div id='" + newIDSel + "'" + (data && data.class ? " class='"+data.class+"'" : "") +
                                                  (data && data.style ? " style='"+data.style+"'" : "") +
                    ">" +
                        (data && data.innerHTML ? data.innerHTML : "")
                    "</div>";
        $(whereSel).append(hook);
    }

    protected renderTmplElHelper(data?: any): void {
        this.$el = $(this._template(data));
        this.$el.attr("id", this._id);
        this.registerEvents();
        this.applyUserStyles();
    }

    protected attachTmplEl(): void {
        if (this._clearSelectorArea) {
            $(this._selector).empty();
        }
        $(this._selector).append(this.$el);
    }

    public renderTmplEl(data?:any): void {
        this.renderTmplElHelper(data);
        this.attachTmplEl();
    }

    public abstract render(callback?: Function): void;
    public abstract registerEvents(): void;

    public set userStyle (data: IViewUserStyleData) {
        this._style.user[this._style.user.map(x=>x.selector).indexOf(data.selector)].styles = data.styles;
    }

    public get styles (): Array<IViewStyleData> {
        return this.styles;
    }

    public set styles (styles: Array<IViewStyleData>) {
        this.styles = styles;
    }

    private applyStyle (data: IViewUserStyleData): void {
        const $el: JQuery = this.$el.find(data.selector);
        if (!$el.length) {
            IDEError.raise (
                "View - Apply Style",
                "Selector " + data.selector + " is not found in View: " + this.name + "."
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
        _.forEach(this._style.user, (data) => this.applyStyle(data));
    }

    public updateUserStyle(style: IViewUserStyleData): void {
        let index = this._style.user.map(x=>x.selector).indexOf(style.selector);
        this._style.user[index].styles = style.styles;
    }

    public updateUserStyles(style: Array<IViewUserStyleData>): void {
        this._style.user = style;
        this.applyUserStyles();
        this.attachTmplEl();
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
    }

    get templateHTML(): string {
        return $("<div>").append(this.$el.clone(true, true)).html();
    }

    public element(selector: string): JQuery {
        return this.$el.find(selector);
    }

    public attachEvents(...eventRegs: Array<IViewEventRegistration>) {
        this.ensureElement();

        return _.map(eventRegs, (reg: IViewEventRegistration) => {
            const $target: JQuery = this.$el.find(reg.selector);
            if (!$target.length) {
                IDEError.raise(
                    "View - Attach Event",
                    "Selector " + reg.selector + " is not found in View: " + this.name + "."
                );
            }
            $target.bind(reg.eventType, reg.handler);

            ++this._nextEventID;
            this._events[this._nextEventID] = {
              type: reg.eventType,
              selector: reg.selector,
              handler: reg.handler,
              $target: $target
            };

            return this._nextEventID;
          });
    }

    public detachEvent(eventId): void {
        const eventInfo: IViewEventData = this._events[eventId];
        eventInfo.$target.unbind(eventInfo.type, eventInfo.handler);
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
}


export abstract class ModalView extends View {

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string,
        styles: IViewStyleData
    ) {
        super(parent, name, _templateHTML, styles, ".modal-platform-container");
    }

    public open(): void {
        this.render(
            () => $("#" + this.id)["modal"]("show")
        );
    }

    private close(): void {
        $("#" + this.id + " .close").click();
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
