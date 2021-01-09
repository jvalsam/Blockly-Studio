const tpl_path =
  "/src/app/application-domain-frameworks/domains-vpl-conf/IoT/third-party-libs/";

export function ThirdPartyLibsList() {
  return [
    tpl_path + "js/jquery-3.4.1.slim.min.js",
    tpl_path + "js/popper.min.js",
    tpl_path + "js/bootstrap.min.js",
    tpl_path + "js/dayjs.min.js",
    tpl_path + "js/utc.js",
    tpl_path + "js/lodash.min.js",
    tpl_path + "js/calendarorganizer.min.js",
    tpl_path + "js/deepmerge.js",
    tpl_path + "js/all.min.js",
    "./domains-libs/IoT/AutoIoTGen/iot-interfaces/dist/iot-ui.js",
  ];
}

export function ThirdPartyStylesList() {
  return [
    tpl_path + "css/bootstrap.min.css",
    tpl_path + "css/calendarorganizer.min.css",
    tpl_path + "css/all.min.css",
  ];
}
