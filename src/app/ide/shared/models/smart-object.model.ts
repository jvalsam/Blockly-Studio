/**
 * SmartObjectModel - 
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

export class SOProperties {

}

export class SmartObjectModel {
  private _lastAction: Date;
  constructor(
    private _name: string,
    private _description: string,
    private _imagePath: string,
    private _properties: SOProperties
  ) {
    this._lastAction = new Date(Date.now());
  }

  public get name(): string { return this._name; }
  public set name(name: string) { this._name = name; }

  public get description(): string { return this._description; }
  public set description(descr: string) { this._description = descr; }

  public get imagePath(): string { return this._imagePath; }
  public set imagePath(imgPath: string) { this._imagePath = imgPath; }

  public get lastAction(): Date { return this._lastAction; }
  public set lastAction(lastAction: Date) { this._lastAction = lastAction; }
}
