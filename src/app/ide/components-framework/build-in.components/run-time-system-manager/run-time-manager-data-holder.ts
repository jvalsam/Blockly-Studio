
var IoTMenuJSON = require("");
var IoTConfJSON = require("./../../../ide-components/iot/defs/conf_props.json");

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
}
