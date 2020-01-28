import _ from "lodash";
import { assert } from "../../../shared/ide-error/ide-error";

var menuSkeletonJson: any = require("./conf_menu.json");
var IoTMenuJSON = require("./../../../ide-components/iot/defs/run-time-manager/conf_menu.json");
var IoTConfJSON = require("./../../../ide-components/iot/defs/run-time-manager/conf_props.json");

export class RuntimeManagerDataHolder {
    private static _domainsMetaDataMap: { [domain:string]: any };
    private static _domainStylesDataMap: { [style: string]: any };
    private static _configMap;
    private static _menuJSON;

    public static load(callback: Function): void {

    }

    public static initialize(): void {
        RuntimeManagerDataHolder._configMap = {
            IoT: IoTConfJSON
        };
        RuntimeManagerDataHolder._menuJSON = {
            IoT: IoTMenuJSON
        };
    }

    public static getDomainsMenuJSON(): Array<String> {
        let path = "/Configure/ProjectManager/";
        _.forOwn(RuntimeManagerDataHolder._menuJSON, (value) => {
            value["path"] = path;
            menuSkeletonJson.MenuElements.push(value);
            // fix next path
            path += value["data"].title + "|";
        });
        return menuSkeletonJson;
    }

    public static getDomainsConfigJSON(): any {
        return RuntimeManagerDataHolder._configMap;
    }

    public static getWSPDomainStyle(style: string): any {
        assert(
            style in RuntimeManagerDataHolder._domainStylesDataMap,
            "Error: Not found "
            + style
            + " in existing domain styles of the Platform."
        );

        return RuntimeManagerDataHolder._domainStylesDataMap[style];
    }
}
