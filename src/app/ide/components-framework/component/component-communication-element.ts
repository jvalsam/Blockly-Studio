/**
 * ComponentSignal - ComponentSignal are sent by components to the IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

export class ComponentCommunicationElement {
    constructor(
        private _srcName: string,
        private readonly _id: string
    ) { }

    get srcName(): string { return this._srcName; }
    set srcName(src: string) { this._srcName = src; }

    get name(): string { return this._id; }
}
