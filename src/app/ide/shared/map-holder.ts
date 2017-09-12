/**
 * Sinlgeton - Pattern Implementation
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */


import { IDEError } from './ide-error';


export class MapHolder<T> {
    constructor(
        private _name: string,
        private _data: { [key: string]: T } = {},
        private _comparator?: (value1: T, value2: T) => boolean
    ) {
        this._name += 'Holder';
        if (!this._comparator) {
          this._comparator = (value1: T, value2: T) => { return value1 === value2; };
        }
        this._data = {};
    }

    public Initialize(): void {
    }

    public CleanUp(): void {
        delete this._data;
    }

    public ContainsKey(key: string): boolean {
        return key in this._data;
    }

    public ContainsValue(value: T): boolean {
      for (const key in this._data) {
        if (this._comparator(value, this._data[key])) {
          return true;
        }
      }
      return false;
    }

    public Get(key: string): T {
        if (!this.ContainsKey(key)) {
          return null;
        }

        return this._data[key];
    }

    public GetKeys(): Array<string> {
      return Object.keys(this._data);
    }

    public Put(key: string, value: T) {
        this._data[key] = value;
    }

    public Remove(key: string) {
        if (!(key in this._data)) {
            IDEError.raise(
                'Singleton-Remove',
                this._name + ' with name ' + key + ' does not exist.'
            );
        }

        delete this._data[key];
    }
}
