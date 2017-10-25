import { IDEError } from '../../../shared/ide-error';
import { IDEUIComponent } from "../../component/ide-ui-component";


class CompViewNode {
    private _parent: CompViewNode;
    private _children: Array<CompViewNode>;

    constructor(
        private _selector: string,
        private _component: IDEUIComponent
    ) {
        this._parent = null;
        this._children = [];
    }

    get selector(): string { return this._selector; }
    get parent(): CompViewNode { return this._parent; }
    get children(): Array<CompViewNode> { return this._children; }
    get component(): IDEUIComponent { return this._component; }
    set selector(s: string) { this._selector = s; }
    set parent(p: CompViewNode) { this._parent = p; }
    set children(ch: Array<CompViewNode>) { this._children = ch; }
    set component(c: IDEUIComponent) { this._component = c; }
}

interface ISelectorCompViewMap {
    [selector: string]: CompViewNode;
}

class _ComponentsViewTree {
    private rootSel: string;
    private compViewMap: ISelectorCompViewMap;

    constructor() {
        this.compViewMap = {};
        this.rootSel = "";
    }

    public setRootComponent(comp: IDEUIComponent, selector: string): void {
        if (this.rootSel) {
            IDEError.raise("ComponentsViewTree", "Error: ComponentView root is initialized already.");
        }

        this.rootSel = selector;
        this.compViewMap[this.rootSel] = new CompViewNode(this.rootSel, comp);
    }

    public onOpenComponent(comp: IDEUIComponent): void {
        if (this.compViewMap[comp.selector]) {
            this.onCloseComponent(comp);
            this.compViewMap[comp.selector].component = comp;
        }
        else {
            let parent = this.findParent(this.compViewMap[this.rootSel], comp, comp.selector);
            if (!parent) {
                IDEError.raise("ComponentsViewTree", "Error: selector "+comp.selector+" not found in DOM.");
            }
            this.compViewMap[comp.selector] = new CompViewNode(comp.selector, comp);
            parent.children.push(this.compViewMap[comp.selector]);
        }
    }

    public onCloseComponent(comp: IDEUIComponent): void {
        if (!this.compViewMap[comp.selector]) {
            IDEError.raise("ComponentsViewTree", "Error: Component "+comp.name+" not found in compviewtree.");
        }
        this.closeComponent(comp);
    }

    private onCloseComponentMenu(comp: IDEUIComponent) {

    }

    private onCloseComponentTools(comp: IDEUIComponent) {

    }

    private closeChildren(node: CompViewNode) {
        for (let child of node.children) {
            this.closeComponent(child.component);
            delete this.compViewMap[child.selector];
        }
        node.children = [];
    }

    private closeComponent(comp: IDEUIComponent) {
        this.closeChildren(this.compViewMap[comp.selector]);
        comp.onClose();
        this.onCloseComponentMenu(comp);
        this.onCloseComponentTools(comp);
    }
    
    private findParent(node: CompViewNode, comp: IDEUIComponent, selector: string) {
        if ($(node.selector).find(selector).length > 0) {
            if (node.children.length === 0 ) {
                return node;
            }
            let parent;
            for (let child of node.children) {
                if((parent = this.findParent(child, comp, selector)) != null) {
                    return parent;
                }
            }
        }
        return null;
    }
}

export let ComponentsViewTree = new _ComponentsViewTree();