/**
 * BlackboardComponent
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { ComponentFunction } from '../../components-framework/component-function';
import { ComponentsCommunication } from '../../components-framework/components-communication';
import { ComponentRegistry } from '../../components-framework/component-registry';
import { MapHolder } from '../map-holder';
import { Queue } from '../../../shared/collections/Queue';
import { ResponseValue } from './../../components-framework/response-value';
import { IDEError } from '../ide-error';


export type BlackboardId = string;
type Event = string;
type EventHandlerUniqueId = number;

interface EventHandler {
  compSource: string;
  funcName: string;
}

interface QueuedEvent {
  event: Event;
  data: Object;
}
var serialEventHandlerId: number = 0;

class EventHandlerContainer {
  private _eventHandlerId: EventHandlerUniqueId;
  constructor(
    private _eventHandler: EventHandler,
    private _oneTime: boolean = false
  ) {
    this._eventHandlerId = ++serialEventHandlerId;
  }

  get eventHandlerId(): EventHandlerUniqueId { return this._eventHandlerId; }
  get eventHandler(): EventHandler { return this._eventHandler; }
  get oneTime(): boolean { return this._oneTime; }
  set eventHandlerId(id: EventHandlerUniqueId) { this._eventHandlerId = id; }
  set eventHandler(evtHandler: EventHandler) { this._eventHandler = evtHandler; }
  set oneTime(oneTime: boolean) { this._oneTime = oneTime; }
}

class EventContainer {
  private _eventHandlerList: Array<EventHandlerContainer>;
  private _deleted: boolean;

  constructor(other?: EventContainer) {
    this._eventHandlerList = new Array<EventHandlerContainer>();
    this._deleted = other ? other._deleted : false;

    if (other) {
      for (const elem of other._eventHandlerList) {
        this._eventHandlerList.push(elem);
      }
    }
  }

  get eventHandlerList(): Array<EventHandlerContainer> { return this._eventHandlerList; }

  public addEventHandler(eventHandler: EventHandler, oneTime: boolean): EventHandlerUniqueId {
    const ehc = new EventHandlerContainer(eventHandler, oneTime);
    this._eventHandlerList.push(ehc);
    return ehc.eventHandlerId;
  }

  public getEventHandlerContainer(eventHandlerUniqueId: EventHandlerUniqueId): EventHandlerContainer {
    for (const elem of this._eventHandlerList) {
      if (elem.eventHandlerId === eventHandlerUniqueId) {
        return elem;
      }
    }
    return null;
  }

  public removeEventHandler(eventHandlerUniqueId: EventHandlerUniqueId) {
    let elem = this.getEventHandlerContainer(eventHandlerUniqueId);
    if (elem) {
      const index = this._eventHandlerList.indexOf(elem, 0);
      if (index > -1) {
        this._eventHandlerList.splice(index, 1);
      }
    }
  }

  public clearEventHandlers(){
    this._eventHandlerList.length = 0;
  }

}

interface Events {
  [eventName: string]: EventContainer;
}
interface Functions {
  [funcName: string]: ComponentFunction
}

export class BlackboardComponent {
  private _events: Events;
  private _queuedEvents: Queue<QueuedEvent>;
  private _functions: Functions;

  constructor(
    private _componentName: string
  ) {
    this._events = {};
    this._functions = {};
    this._queuedEvents = new Queue<QueuedEvent>();
  }

  private AssertExists(exist: boolean, element: string, elementsName: string, type: string) {
    const checkExists = element in this[elementsName];
    if (exist ? !checkExists : checkExists) {
      IDEError.raise(
        BlackboardComponent.name,
        'Try to add ' + type + ' ' + element +
        (exist ? 'that is not defined' : ' that already exists!')
      );
    }
  }

  public AddEvent(eventId: Event) {
    this.AssertExists(false, eventId, '_events', 'event');

    this._events[eventId] = new EventContainer();
  }

  public AddEventHandler(eventId: Event, evtHandler: EventHandler, callOnce = false): EventHandlerUniqueId {
    this.AssertExists(true, eventId, '_events', 'event handler in')

    return this._events[eventId].addEventHandler(evtHandler, callOnce);
  }

  public AddFunction(funcName: string, argsLen: number=-1) {
    this.AssertExists(false, funcName, '_functions', 'function');

    this._functions[funcName] = new ComponentFunction(this._componentName, funcName, argsLen);
  }

  public RemoveFunction(funcName: string) {
    this.AssertExists(true, funcName, '_functions', 'function');

    delete this._functions[funcName];
  }

  public RemoveEventHandler(eventId: Event, eventHandlerUniqueId: EventHandlerUniqueId): void {
    this._events[eventId].removeEventHandler(eventHandlerUniqueId);
  }

  public ClearEventHandlers(eventId: Event) {
    this._events[eventId].clearEventHandlers();
  }

  private ProcessEvent(eventId: Event, eventContent: Object) {
    for (const ehc of this._events[eventId].eventHandlerList) {
      const data = ehc.eventHandler;
      const compEntry = ComponentRegistry.GetComponentEntry(data.compSource);

      if (!compEntry) {
        IDEError.raise(
          BlackboardComponent.name,
          'Not found component with name ' + data.compSource,
          'Signal ' + eventId + ' posted and the aforementioned component is esteblish that listens it.'
        );
      }
      const components = compEntry.GetInstances();
      for (const component of components) {
        component.receiveFunctionRequest(data.funcName, eventContent['data']);
      }
    }
  }

  public PostEvent(eventId: Event, eventContent: Object): void {
    this.ProcessEvent(eventId, eventContent);
  }

  public CallFunction (funcName: string, args: Array<any>, source: string, destId?: string): ResponseValue {
    const func = this._functions[funcName];
    if (!func) {
      IDEError.raise(
          BlackboardComponent.name,
          'CallFunction: Not found function ' + funcName + ' in component ' + this._componentName + '.'
      );
    }

    if (func.argsLen !== args.length) {
      IDEError.raise(
          BlackboardComponent.name,
          'CallFunction: function ' + funcName + ' of component ' + this._componentName + ' requires ' + func.argsLen +
          ' while it is called by ' + source + ' using ' + args.length + '.'
      );
    }

    const components = ComponentRegistry.GetComponentEntry(this._componentName).GetInstances();
    if (!components || components.length === 0) {
      IDEError.raise(
        BlackboardComponent.name,
        'CallFunction: Requested function ' + funcName + ' of component ' + this._componentName +
        '. There is no instance of this component.'
      );
    }

    if (destId) {
      for (const component of components) {
        if (component.id === destId) {
          return component.receiveFunctionRequest(funcName, args);
        }
      }
    }
    else {
      const values = new Array<any>();
      for (const component of components) {
        values.push(component.receiveFunctionRequest(funcName, args).value);
      }
      let rval: any = values;
      if (values.length === 1) {
        rval = values[0];
      }
      return new ResponseValue(this._componentName, funcName, rval);
    }
  }

  public ProcessQueuedEvents(){
    // TODO: if we will need it
  }
  public PostQueuedEvent(eventId: Event, eventContent: Object): void {
    // TODO: if we will need it
  }

  public StopInvocationLoop() {
    // TODO: if we will need it
  }

}
