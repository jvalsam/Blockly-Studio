import {iotivity_url} from "../../shared/data.ts";

function handle_response_errors(response) {
    let json = response.json();
    if (!response.ok) {
        throw Error(json);
    }
    return json;
}

function get_online_smart_objects(on_success, on_failure) {
    fetch(iotivity_url)
    .then(handle_response_errors)
    .then(function(smart_objects) {
        on_success(smart_objects);
    })
    .catch(function() {
        on_failure();
    });
}

export default {
    get_online_smart_objects
};