import { IDEError } from "../../../../shared/ide-error/ide-error";
import { IViewElements } from "./../../../component/component-view";
import { IDEUIComponent, IViewDataComponent } from "../../../component/ide-ui-component";
import { UIComponentMetadata, ExportedFunction } from "../../../component/component-loader";
import { ComponentRegistry } from "../../../component/component-entry";

import * as _ from "lodash";

var basicMenuJson = require("./basic_menu.json");
var configJson = require("./conf_props.json");

interface MenuItemGeneralData {
    compName: string;
    title: string;
    help?: string;
    imagePath?: string;
    style?: string;
    groupName?: string; // in case item is in group
    type: string;
    root: boolean;
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

interface INodeArray {
    [index: number]: MenuElem;
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
    componentView: "MenuView",
    configDef: configJson
})
export class Menu extends IDEUIComponent {
    private paths: {[path:string]: string}; // helps in check that each path is unique
    private itemsPaths: { [index: number]: { [index: number]: Array<ItemLoadData> } }; // outer Array is scope of path
    private items: INodeArray;

    constructor(
        name: string,
        description: string,
        compViewName: string,
        hookSelector: string
    ) {
        super(name, description, compViewName, hookSelector);
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
        elem.data.root = (menuData.path.split("/").length > 2) ? false : true;
        elem.data.type = menuElem.type;

        if ( menuElem.type !== "divider" ) {
            if (menuElem.help) {
                elem.data.help = menuElem.help;
            }
            if (menuElem.imagePath) {
                elem.data.imagePath = menuElem.imagePath;
            }
            if (menuElem.style) {
                elem.data.style = menuElem.style;
            }

            if (menuElem.type === "sub-menu") {
                elem.data.children = {};
            }
            else {
                if (typeof (menuElem.events) === "undefined") {
                    IDEError.raise(
                        "CreateMenuElem",
                        "Component: " + compName + " defines menu leaf item " + menuElem.title +
                        " without events!"
                    );
                }
                elem.data.events = menuElem.events;
            }
        }
        return elem;
    }

    private checkPathValidity(path: string, compName: string): void {
        if (!path.startsWith("/") || !(path.endsWith("|") || path.endsWith("/"))) {
            IDEError.raise("MenuComponent", "Invalid Path "+path+" defined by component "+compName+
                                            ". Path has to ends with '/' or '|' or starts with '/' !"
            );
        }
    }

    private findNode(pathElems: any, compName: string): any {
        let node = this.items;
        let prvNode = null;
        for (let pathElem of pathElems.slice(0, pathElems.length - 1)) {
            let foundIndex = false;
            for (let index of Object.keys(node)) {
                if (node[index].data.title === pathElem) {
                    foundIndex = true;
                    prvNode = node[index];
                    node = (<MenuItem>node[index]).data.children;
                    if (!node) {
                        IDEError.raise(
                            "MenuLoad",
                            "Node path " + node[index].path + " with title " + node[index].data.title +
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
        return {
            "node": node,
            "previous": prvNode
        };
    }

    private findIndex(title, node) {
        for (let index of Object.keys(node)) {
            if (node[index].data.title === title) {
                return index;
            }
        }
        IDEError.raise("MenuLoad: findIndex", "Node path not found!");
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
                    this.checkPathValidity(path, compName);

                    // find where to add menu node based on path
                    let pathElems = path.split("/");
                    pathElems.splice(0, 1);

                    if (path.endsWith("/")) {
                        pathElems = pathElems.splice(0, pathElems.length-1);
                    }

                    let data = this.findNode(pathElems, compName);
                    let node = data.node;
                    let prvNode = data.previous;

                    let lastElem = pathElems[pathElems.length - 1];
                    let newElem = this.createElem(menuData, compName);

                    if (pathElems.length === 0) {
                        newElem.path = "/" + menuElem.title + "/";
                        this.items[0] = newElem;
                    }
                    else if (lastElem.endsWith("|")) {
                        let index = lastElem.split("|").length-1;
                        newElem.path = menuData.path.slice(0, menuData.path.length-1) + "/" + menuElem.title + "/";
                        if (prvNode === null) {
                            this.items[index] = newElem;
                        }
                        else {
                            prvNode.data.children[index] = newElem;
                        }
                    }
                    else {
                        newElem.path = path + menuElem.title + "/";
                        if (prvNode === null) {
                            let index = this.findIndex(pathElems[0], node);
                            (<MenuItemData>node[index].data).children[0] = newElem;
                        }
                        else {
                            (<MenuItemData>node[0].data).children[0] = newElem;
                        }
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

    private jsonLoader (menuElements: any, compName: string): void {
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
            this.itemsPaths[level][sLevel].push({
                path: path,
                item: menuElem.data,
                compName: compName
            });
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
    public onClickHomePage(): void {
        alert ("Go Home is not implemented yet!");
    }

    // 1st statement sets 
    @ExportedFunction
    public onChangeConfig(values: Object): void {
        alert("on change config data not developed yet in Menu Component");
    }
}
