/**
 * ApplicationModel - 
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

class ApplicationSrc {
  constructor (
    private id: string,
    private model: string=''
  ){}

}


export class ApplicationModel {
  private static readonly DEFAULT_DESCRIPTION = 'There is not description yet.';
  private static readonly DEFAULT_IMAGE_PATH = 'TODO: add default image path';
  private _appSource: ApplicationSrc;

  constructor(
    private _name: string,
    private _description: string = ApplicationModel.DEFAULT_DESCRIPTION,
    private _imagePath: string = ApplicationModel.DEFAULT_IMAGE_PATH,
    private _sourcePath: string = ''
  ){}

  get name(): string { return this._name; }
  set name(name: string) {
    // TODO: check if it is unique for the user and handle it
    this._name = name;
  }
  get description(): string { return this._description; }
  set description(description: string) {
    if (description === "") {
      this._description = ApplicationModel.DEFAULT_DESCRIPTION;
    }
    else {
      this._description = description;
    }
  }
  get imgPath(): string { return this._imagePath; }
  set imgPath(path: string) {
    this._imagePath = path;
  }
}
