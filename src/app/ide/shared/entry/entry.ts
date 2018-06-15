/**
 * Entry
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */

import { IDEUIComponent } from "../../components-framework/component/ide-ui-component";
import { IDEError } from "../../shared/ide-error/ide-error";

export class Entry<T> {
  protected _instanceList: Array<T>;
  protected _html: string;

  constructor(
    public readonly name?: string,
    protected _creationFunc?: any,
    protected _args?: Array<any>
  ) {
    this._instanceList = new Array<T>();
    if (this._args) {
      this._html = this._args.shift();
    }
  }

  public getInstances(): Array<T> {
    return this._instanceList;
  }

  public setArgs(args: Array<T>) {
    this._args = args;
    if (this._args) {
      this._html = this._args.shift();
    }
  }

  public create(parent: IDEUIComponent, ...extraElements: Array<any>): T {
    let selector = extraElements.shift();
    const newInst: T = new (this._creationFunc) (parent, this.name, this._html,  selector, ...this._args, ...extraElements);
    this._instanceList.push(newInst);
    return newInst;
  }

  public destroy(inst: T): void {
    inst["destroy"]();
    const index = this._instanceList.indexOf(inst);
    if (index === -1) {
      IDEError.raise(
        inst["name"],
        "Try to remove view instance of " + inst["name"] + "."
      );
    }
    this._instanceList.splice(this._instanceList.indexOf(inst), 1);
  }
}
