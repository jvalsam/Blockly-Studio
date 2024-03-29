﻿/**
 * ComponentFunc - Function of Component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

import { ComponentCommunicationElement } from './component-communication-element';


export type Type = string;

export interface Argument {
    type: Type;
    value: any;
}

export class ComponentFunction extends ComponentCommunicationElement {
    constructor(
        _srcName: string,
        _funcName: string,
        private readonly _argsLen: number,
        private readonly _isStatic: boolean = false,
        private readonly _responseCallback?: string
    ) {
        super(_srcName, _funcName);
    }

    public copy(){
      return new ComponentFunction(this.srcName, this.name, this.argsLen, this._isStatic, this._responseCallback);
    }

    get argsLen(): number { return this._argsLen; }

    get isStatic(): boolean { return this._isStatic; }

    get hasArgsLenRestriction (): boolean { return this._argsLen !== -1; }

    get responseCallback(): string { return this._responseCallback; }

    public GetSignature(): string { return "TODO"; }
}

/**
 *
 *
 * @export
 * @class ComponentFunctionCall
 */
export class ComponentFunctionCall {
  constructor(
    private compFunction: ComponentFunction,
    private args: Array<any>
  ) {}


}
