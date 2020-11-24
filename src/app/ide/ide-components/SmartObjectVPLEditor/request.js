import superagent from "superagent";

const urlInfo = Object.freeze({
  iotivityUrl: "http://147.52.17.129:3030",
});

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
  // Disable scan button
  // Display loader
  document.getElementById("scan-loader").style.display = "block";
  GetRequest(urlInfo.iotivityUrl + "/scan", function (err, res) {
    if (err) {
      onFail();
    } else {
      onSuccess(res.body.resources);
    }
  });
}
