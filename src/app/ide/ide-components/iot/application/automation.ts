
export class Automation {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _type: string,
        private _src: string = ''
    ){}

    public get name(): string { return this._name; }
    public get id(): string { return this._id; }
    public get type(): string { return this._type; }
    public get src(): string { return this._src; }
}
