import { IDEUIComponent } from '../../component/ide-ui-component';


class ICompViewNode {
    constructor(
        private _selector: string,
        private _parent: ICompViewNode = null,
        private _children: Array<ICompViewNode> = [],
        private _component: IDEUIComponent = null
    ) {}

    get selector(): string { return this._selector; }
    get parent(): ICompViewNode { return this._parent; }
    get children(): Array<ICompViewNode> { return this._children; }
    get component(): IDEUIComponent { return this._component; }
    set selector(s: string) { this._selector = s; }
    set parent(p: ICompViewNode) { this._parent = p; }
    set children(ch: Array<ICompViewNode>) { this._children = ch; }
    set component(c: IDEUIComponent) { this._component = c; }
}

interface ISelectorCompViewMap {
    [selector: string]: ICompViewNode;
}

class _ComponentsViewTree {
    private compViewMap: ISelectorCompViewMap;

    constructor(
        private root: string
    ) {
        this.compViewMap = {};
    }

    public openComponent(selector: string) {
        this.compViewMap[selector];
    }

    public closeComponent(selector: string) {

    }

}

export let ComponentsViewTree = new _ComponentsViewTree();