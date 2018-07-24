/**
 * Entry
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * Octomber 2017
 */

import { IDEUIComponent } from "../../components-framework/component/ide-ui-component";
import { IDEError } from "../../shared/ide-error/ide-error";
import { IViewStyleData } from './../../components-framework/component/view';

export class Entry<T> {
  protected _instanceList: Array<T>;
  protected _html: string;
  protected _style: IViewStyleData;
  protected _args: Array<any>;

  constructor(
    public readonly name?: string,
    protected _creationFunc?: any,
    _args?: Array<any>
  ) {
    this._instanceList = new Array<T>();
    this.setArgs(_args);
  }

  public getInstances(): Array<T> {
    return this._instanceList;
  }

  public setArgs(args: Array<T>) {
    this._args = args;
    if (this._args) {
      this._html = this._args.shift();
      this._style = this._args.shift();
    }
  }

  private isInstArgStyle(instArg) {
    return  Array.isArray(instArg) && instArg.length>0 &&
            typeof instArg === "object" &&
            instArg[0].selector && instArg[0].styles;
  }

  public create(parent: IDEUIComponent, ...instArgs: Array<any>): T {
    let selector = instArgs.shift();
    let style = this._style;
    if (this.isInstArgStyle(instArgs[0])) {
      style.user = instArgs.shift();
    }
    const newInst: T = new (this._creationFunc) (parent, this.name, this._html, style,  selector, ...this._args, ...instArgs);
    this._instanceList.push(newInst);
    if (this._instanceList.length === 1) {
      // care for loading css from the system using: this._style.system === css file name path
    }
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
    if (this._instanceList.length === 0) {
      // care for unloading css from the system
    }
  }
}
