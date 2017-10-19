
export class Automation {
    constructor(
        private readonly _id: string,
        private _name: string
    ){

    }

    get name(): string { return this.name; }
    get id(): string { return this.id; }
}
