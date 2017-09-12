/**
 * ComponentManager - Handles components communication requests
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */



export class ResponseValue {
  constructor(
    private _compName: string,
    private _funcName: string,
    private _value: any
  ) {}

  get componentName(): string { return this._compName; }
  get functionName(): string { return this._funcName; }
  get value(): any { return this._value; }
}
