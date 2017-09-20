/**
 * ComponentSignal - ComponentSignal are sent by components to the IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { ComponentCommunicationElement } from './component-communication-element';

export class ComponentSignal extends ComponentCommunicationElement {
    private _finalFunc: string;
    constructor(
        _srcName: string,
        _signal: string,
        private _argList?: Array<any>
    ) {
        super(_srcName, _signal);
        this._finalFunc = '';
    }

    copy(): ComponentSignal {
      const cs = new ComponentSignal(this.srcName, this.name, this.argList);
      cs.finalCallback = this._finalFunc;
      return cs;
    }

    get argList(): Array<any> { return this._argList; }
    get finalCallback(): string { return this._finalFunc; }
    set finalCallback(finalFunc: string) { this._finalFunc = finalFunc; }
}

export interface SignalListenerData {
  component: string;
  callback: string;
}

export interface ComponentSignalData {
  signal: ComponentSignal;
  components: Array<SignalListenerData>;
}
