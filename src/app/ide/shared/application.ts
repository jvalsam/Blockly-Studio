
interface Element {
    type: string;
    title: string;
    img: string;
    innerdata: any;
    children?: Array<Element>;
}

interface Category {
    type: string;
    elements: Array<Element>;
}

interface IAuthorInfo {
    _id: string;
    username: string;
}

interface ApplicationJSON {
    _id: string;
    title: string;
    type: string;
    author: IAuthorInfo;
    created: string;
    lastModified: string;
    categories: Array<Category>;
}


export class Application {
    constructor(
        private _id: string,
        public title: string,
        public readonly type: string,
        public author: IAuthorInfo,
        public readonly created: Date,
        public lastModified: Date,
        private categories: Array<Category>
    ) {}

    public toJSON(): any {
        return Object.assign({}, this, {
            created: this.created.toString(),
            lastModified: this.lastModified.toString()
        });
    }

    public static fromJSON(json: any): Application {
        let app = Object.create(Application.prototype);
        return Object.assign(app, json, {
            created: new Date(json.created),
            lastModified: new Date(json.lastModified)
        });
    }

}