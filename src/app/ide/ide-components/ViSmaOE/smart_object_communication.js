import {smart_objects_backend_url} from "../../shared/data.ts";

function handle_response_errors(response) {
    let json = response.json();
    if (!response.ok) {
        throw Error(json);
    }
    return json;
}

function get_registered_smart_objects(on_success, on_failure) {
    fetch(smart_objects_backend_url + "/registered")
    .then(handle_response_errors)
    .then(function(response) {
        on_success(response);
    })
    .catch(function(response) {
        on_failure(response);
    });
}

function register_smart_object(smart_object, on_success, on_failure) {
    fetch(
        smart_objects_backend_url + "/register",
        {
            method: "POST",
            body: JSON.stringify(smart_object),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    .then(handle_response_errors)
    .then(on_success)
    .catch(function(response) {
        on_failure(response);
    });
}

function unregister_smart_object(smart_object_id, on_success, on_failure) {
    fetch(
        smart_objects_backend_url + "unregister/" + smart_object_id,
        { method: "DELETE" }
    )
    .then(handle_response_errors)
    .then(on_success)
    .catch(function(response) {
        on_failure(response);
    });
}

export default {
    get_registered_smart_objects,
    register_smart_object,
    unregister_smart_object
}