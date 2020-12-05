import superagent from "superagent";
import { urlInfo } from "./iotivity-server-conf";

/**
 * @param {string} url
 * @param {callback} callback
 * @description GET Request
 */
const GetRequest = (url, callback) => {
  superagent
    .get(url)
    .set("accept", "json")
    .end((err, res) => {
      return callback(err, res);
    });
};

/**
 * @description Request scan resources
 */
export function RequestScanResources(onSuccess, onFail) {
  GetRequest(urlInfo.iotivityUrl + "/scan", function (err, res) {
    if (err) {
      onFail();
    } else {
      onSuccess(res.body.resources);
    }
  });
}
