import { Entry } from "./entry";


export class Registry<T> {
  private entries: { [name: string]: Entry<T> };

  constructor() {
    this.entries = {};
  }

  public initialize() {}

  public getEntry (name: string): Entry<T> {
    return this.entries[name];
  }

  public hasEntry(name: string): boolean {
    return name in this.entries;
  }

  public createEntry (name: string, create: Function, initData: Array<any>): Entry<T> {
    this.entries[name] = new Entry<T> (name, create, initData);
    return this.entries[name];
  }

  public destroyEntry(name: string) {
    delete this.entries[name];
  }
}
