import { IDEError } from "../../../../shared/ide-error/ide-error";
import { IViewElements } from "./../../../component/component-view";
import { IDEUIComponent, IViewDataComponent } from "../../../component/ide-ui-component";
import { UIComponentMetadata, ExportedFunction } from "../../../component/component-loader";
import { ComponentRegistry } from "../../../component/component-entry";

var basicMenuJson = require("./basic_menu.json");


interface MenuItemGeneralData {
    compName: string;
    title: string;
    help?: string;
    imagePath?: string;
    style?: string;
    groupName?: string; // in case item is in group
}
export interface MenuItemLeafData extends MenuItemGeneralData {
    events: Array<Object>;
}
export interface MenuItemData extends MenuItemGeneralData {
    children: {[index: number]: MenuElem};
}

export declare type MenuElem = MenuItem | MenuItemLeaf;
export interface MenuItem {
    path: string;
    data: MenuItemData;
}
export interface MenuItemLeaf {
    path: string;
    data: MenuItemLeafData;
}

export function isMenuItemLeaf(menuElem: MenuElem): boolean {
    return (<MenuItemLeafData>(menuElem.data)).events !== null;
}

interface ItemLoadData {
    path: string;
    item: any;
    compName: string;
}


@UIComponentMetadata({
    description: "Menu of the platform",
    authors: [
        {
            name: "Yannis Valsamakis",
            email: "jvalsam@ics.forth.gr",
            date: "November 2017"
        }
    ],
    componentView: "MenuView"
})
export class Menu extends IDEUIComponent {
    private paths: {[path:string]: string}; // helps in check that each path is unique
    private itemsPaths: { [index: number]: { [index: number]: Array<ItemLoadData> } }; // outer Array is scope of path
    private items: { [index: number]: MenuElem };

    constructor(
        name: string,
        description: string,
        compViewName: string
    ) {
        super(name, description, compViewName);
        this.items = {};
        this.paths = {};
        this.itemsPaths = {};
        this.loadMenus();
        this._view.setRenderData(this.items);
    }

    private createElem (menuData: ItemLoadData, compName): MenuElem {
        let menuElem = menuData.item;
        let elem: any = {
            path: menuData.path,
            data: {
                title: menuElem.title,
                compName: compName
            }
        };
        if (menuElem.help) {
            elem.data.help = menuElem.help;
        }
        if (menuElem.imagePath) {
            elem.data.imagePath = menuElem.imagePath;
        }
        if (menuElem.style) {
            elem.data.style = menuElem.style;
        }
        if (menuElem.hasChildren) {
            elem.data.children = {};
        }
        else {
            elem.data.events = menuElem.events;
        }
        return elem;
    }

    private load (): void {
        for (let indexItem of Object.keys(this.itemsPaths)) {
            let scopeElems = this.itemsPaths[indexItem];
            for (let mkey of Object.keys(scopeElems)) {
                let menusData = scopeElems[mkey];
                for (let menuData of menusData) {
                    let path = <string>menuData.path;
                    let menuElem = menuData.item;
                    let compName = menuData.compName;

                    // find where to add menu node based on path
                    let pathElems = path.split("/");
                    pathElems = pathElems.splice(0, pathElems.length-1);
                    let node = this.items;
                    let prvNode = null;
                    for (let pathElem of pathElems.slice(0, pathElems.length - 1)) {
                        let foundIndex = false;
                        for (let index of Object.keys(node)) {
                            let item = node[index];
                            if (item.data.title === pathElem) {
                                foundIndex = true;
                                prvNode = node;
                                node = (<MenuItem>item).data.children;
                                if (node === null) {
                                    IDEError.raise(
                                        "MenuLoad",
                                        "Node path " + item.path + " with title " + item.data.title +
                                        " has no children of component " + compName
                                    );
                                }
                                break;
                            }
                        }
                        if (!foundIndex) {
                            IDEError.raise(
                                "MenuLoad",
                                "Node path element " + pathElem + " not found. Requested by component " + compName + "."
                            );
                        }
                    }
                    let lastElem = pathElems[pathElems.length - 1];
                    let newElem = this.createElem(menuData, compName);

                    if (lastElem.endsWith("|")) {
                        let index = lastElem.split("|").length-1;
                        newElem.path = menuData.path + menuElem.data.title + "/";
                        if (prvNode === null) {
                            this.items[index] = newElem;
                        }
                        else {
                            prvNode.children[index] = newElem;
                        }
                    }
                    else if (lastElem === "") {
                        this.items[0] = newElem;
                    }
                    else {
                        (<MenuItemData>node[0].data).children[0] = newElem;
                    }
                }
            }
        }
    }

    private checkIfPathIsValid(path: string, compName: string, title: string) {
        if (!path || !(path.endsWith("|") || path.endsWith("/"))) {
            IDEError.raise(
                "MenuLoad",
                "Invalid Menu Path " + path + " of component " + compName + "."
            );
        }
        // check if already exists
        if (this.paths[path]) {
            IDEError.raise(
                "MenuLoad",
                "Path " + path + " of component " + compName + " already defined."
            );
        }

        this.paths[path] = compName;
    }

    private jsonLoader (menuElements: any, compName: string, group?: string): void {
        for (let menuElem of menuElements) {
            let path = menuElem.path;
            this.checkIfPathIsValid(path, compName, menuElem.data.title);
            let level = path.split("/").length - 1;
            let sLevel = path.split("|").length - 1;
            if (!this.itemsPaths[level]) {
                this.itemsPaths[level] = {};
            }
            if (!this.itemsPaths[level][sLevel]) {
                this.itemsPaths[level][sLevel] = [];
            }
            if (group) {
                menuElem.data.group = group;
            }
            this.itemsPaths[level][sLevel].push({
                path: path,
                item: menuElem.data,
                compName: compName
            });
            if (menuElem.data.group) {
                this.jsonLoader(menuElem.data.group, compName, menuElem.data.title);
            }
            if (menuElem.data.children) {
                this.jsonLoader(menuElem.data.children, compName);
            }
        }
    }

    private loadMenus (): void {
        // load menu metadata and validity check
        this.jsonLoader(basicMenuJson.MenuElements, basicMenuJson.ComponentName);
        for (let compName of Object.keys(ComponentRegistry.getEntries())) {
            let jsonMenuMetadata = ComponentRegistry.getEntry(compName).getMenuMetadata();
            if (jsonMenuMetadata) {
                this.jsonLoader(jsonMenuMetadata.MenuElements, jsonMenuMetadata.ComponentName);
            }
        }
        // load menu data
        this.load();
    }

    public activateMenuItems (menuElems: IViewElements): void {
        // TODO: implement it
    }

    public deactivateMenuItems (menuElems: IViewElements): void {
        // TODO: implement it
    }

    public destroy(): void {
        // first call destroy of the other components and then close
    }

    @ExportedFunction
    public registerEvents():void {
        ;
    }

    @ExportedFunction
    public update():void {
        ;
    }

    @ExportedFunction
    public onOpen(): void {
        ;
    }

    @ExportedFunction
    public onClose(): void {
        ;
    }

    @ExportedFunction
    public getView(): IViewDataComponent {
        return {};
    }

    /**
     * Events Callback functions which require components function request or signal
     */
    @ExportedFunction
    public onClickHomePage() {
        alert ("Go Home is not implemented yet!");
    }
}
