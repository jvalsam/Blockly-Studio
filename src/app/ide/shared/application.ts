

export class Application {

    constructor(
        private readonly _type: string
    ) {}

    get type(): string { return this._type; }
    
}