import * as _ from "lodash";

/**
 * ApplicationModel - 
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

class ApplicationSrc {
  constructor (
    private id: string,
    private model: string = ''
  ){}

}


export class ApplicationModel {
  private static readonly DEFAULT_DESCRIPTION = "There is not description yet.";
  private static readonly DEFAULT_IMAGE_PATH = "../../../../../images/default-app.jpg";

  public lastUpdated: Date;
  constructor(
    private _id: string,
    public name: string,
    public description: string = ApplicationModel.DEFAULT_DESCRIPTION,
    public imagePath: string = ApplicationModel.DEFAULT_IMAGE_PATH
  ) {
    this.lastUpdated = new Date(Date.now());
  }

  get id(): string { return this._id; }

  static getElements(): any {
    let obj = {};
    _.forEach(Object.getOwnPropertyNames(new ApplicationModel("", "")), (name) => {
      obj[name] = 1;
    });
    return obj;
  }
  
  // get name(): string { return this._name; }
  // set name(name: string) {
  //   // TODO: check if it is unique for the user and handle it
  //   this._name = name;
  // }
  // get description(): string { return this._description; }
  // set description(description: string) {
  //   if (description === "") {
  //     this._description = ApplicationModel.DEFAULT_DESCRIPTION;
  //   }
  //   else {
  //     this._description = description;
  //   }
  // }
  // get imagePath(): string { return this._imagePath; }
  // set imagePath(path: string) {
  //   this._imagePath = path;
  // }
  // get lastUpdated(): Date { return this._lastUpdated; }
  // set lastUpdated(date: Date) {
  //   this._lastUpdated = date;
  // }
}
