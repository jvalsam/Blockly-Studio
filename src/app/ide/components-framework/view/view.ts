/**
import { IDEError } from '../../shared/ide-error';
import { IDEError } from "./../../shared/ide-error";
 * View - Events Registration Handler
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import * as $ from 'jquery';
import * as _ from 'lodash';
import { DeclareViewElement } from "../component/components-communication";
import { IDEUIComponent } from "../component/ide-ui-component";
import { IDEError } from "../../shared/ide-error";

export let ViewMetadata = DeclareViewElement;

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
export function instanceOfIViewElement(object: any): boolean {
    return typeof object !== "string" && "view" in object && "selector" in object;
}

export abstract class View {
    public $el: JQuery;
    protected template: Function;
    private _nextEventID: number;
    private _events: { [key: number]: IViewEventData };

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string
    ) {
        this._events = {};
        this._nextEventID = 0;
        this.template = _.template(this._templateHTML);
        this.$el = $( $.parseHTML(this._templateHTML) );
    }

    public abstract render(): void;
    public abstract registerEvents(): void;

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

    public compileTemplate(data: Object): string {
        return this.template(data);
    }

    get templateHTML(): string {
        return $("<div>").append(this.$el.clone(true, true)).html();
    }

    get templateJQ(): JQuery {
        return this.$el;
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