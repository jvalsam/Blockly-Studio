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
        protected _selector: string
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
    }

    protected attachTmplEl(): void {
        $(this.selector).empty();
        $(this.selector).append(this.$el);
    }

    public renderTmplEl(data?:any): void {
        this.renderTmplElHelper(data);
        this.attachTmplEl();
    }

    public abstract render(callback?: Function): void;
    public abstract registerEvents(): void;

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
            const $target: JQuery = $(reg.selector);// this.$el.find(reg.selector);
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
        protected readonly _templateHTML: string
    ) {
        super(parent, name, _templateHTML, "modal-area");
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

        var initData = (data.initData) ? data.initData : [];

        ViewRegistry.createEntry(
            data.name,
            create,
            [data.templateHTML, ...initData]
        );
    };
}
