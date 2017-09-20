/**
 * ComponentEntry -
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import { View } from "./view";
import { IDEError } from "../../shared/ide-error";

export class ViewEntry {
  private _instanceList: Array<View>;

  constructor(
    public readonly name: string,
    private _creationFunc: any,
    private _args?: Array<any>
  ) {
    this._instanceList = new Array<View>();
  }

  public getInstances(): Array<View> {
    return this._instanceList;
  }

  public setArgs(args: Array<any>) {
    this._args = args;
  }

  public create(): View {
    const newView: View = new (this._creationFunc) (this.name, ...this._args);
    this._instanceList.push(newView);
    return newView;
  }

  public destroy(view: View) {
    view.destroy();
    const index = this._instanceList.indexOf(view);
    if (index === -1) {
      IDEError.raise(
        ViewEntry.name,
        "Try to remove view instance of " + view.name + "."
      );
    }
    this._instanceList.splice(this._instanceList.indexOf(view), 1);
  }
}
