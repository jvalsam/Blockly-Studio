
export class Queue<T> {
  private _data: T[];

  constructor() {
    this._data = [];
  }

  public push(val: T) {
    this._data.push(val);
  }

  public pop(): T | undefined {
    return this._data.shift();
  }

  enqueue(elem: T) {
    this._data.push(elem);
  }

  dequeue(): T {
      if (this._data.length !== 0) {
          const el = this._data[0];
          delete this._data[0];
          return el;
      }
      return undefined;
  }

  peek(): T {
    if (this._data.length !== 0) {
        return this._data[0];
    }
    return undefined;
  }

  size(): number {
      return this._data.length;
  }

  contains(elem: T, equalsFunction?: Function): boolean {
    equalsFunction = (equalsFunction ?
                      equalsFunction :
                      (elem1:T, elem2:T) => { return elem1 == elem2; });

    for(let delem of this._data)
      if (equalsFunction(elem, delem))
        return true;
    return false;
  }

  isEmpty(): boolean {
    return this._data.length == 0;
  }

  clear(): void {
    this._data = [];
  }

  forEach(callback: Function): void {
    for(let elem of this._data)
      callback(elem);
  }

}
